const jwt = require("jsonwebtoken")
const axios = require("axios")
const Order = require("../models/Order.model")
const OrderStatus = require("../models/OrderStatus.model")
const WebhookLog = require("../models/WebhookLog.model")

// Create a new payment
const createPayment = async (req, res, next) => {
  try {
    const { school_id, trustee_id, student_info, gateway_name, amount } = req.body

    // Generate a unique custom order ID
    const custom_order_id = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`

    // Create new order
    const order = new Order({
      school_id,
      trustee_id,
      student_info,
      gateway_name,
      custom_order_id,
    })

    await order.save()
    
    // Create initial order status
    const orderStatus = new OrderStatus({
      collect_id: order._id,
      order_amount: amount,
      transaction_amount: amount,
      status: "pending",
    })

    await orderStatus.save()

    const signPayload = {
      school_id: school_id.toString(),
      amount: amount.toString(),
      callback_url: process.env.CALLBACK_URL.toString() || "https://your-app.com/payment-callback",
    }

    const sign = jwt.sign(signPayload, process.env.PG_KEY)


    const paymentResponse = await axios.post(
      'https://dev-vanilla.edviron.com/erp/create-collect-request',
      {
        school_id: school_id.toString(),
        amount: amount.toString(),
        callback_url: process.env.CALLBACK_URL.toString() || "https://your-app.com/payment-callback",
        sign:sign.toString(),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )


    // Simulated response
    const { collect_request_id, collect_request_url } = paymentResponse.data
    const responsePayload = {
      status: 200,
      message: "Payment request created successfully",
      data: {
        collect_request_id,
        collect_request_url,
        sign,
      },
    }

    const simulatedWebhookData = {
      status: 200,
      order_info: {
        order_id: custom_order_id,
        order_amount: amount,
        transaction_amount: amount,
        gateway: gateway_name,
        status: "SUCCESS",
        bank_reference: "YESBNK222",
        payment_mode: "UPI",
        payemnt_details: "success@ybl",
        Payment_message: "payment success",
        payment_time: new Date().toISOString(),
        error_message: "NA",
      },
    }
    await processWebhook(
      { body: simulatedWebhookData },
      { json: (data) => console.log("Webhook simulated:", data), status: () => ({ json: console.log }) },
      (err) => console.error("Webhook error:", err)
    )

    res.json(responsePayload)
  } catch (error) {
    next(error)
  }
}

// Process webhook
const processWebhook = async (req, res, next) => {
  try {
    const webhookData = req.body

    // Log the webhook payload
    const webhookLog = new WebhookLog({
      payload: webhookData,
      processed: false,
    })

    await webhookLog.save()

    // Extract order info
    const { order_info } = webhookData

    if (!order_info || !order_info.order_id) {
      webhookLog.error = "Invalid webhook payload"
      await webhookLog.save()
      return res.status(400).json({ message: "Invalid webhook payload" })
    }

    const order = await Order.findOne({ custom_order_id: order_info.order_id });

    if (!order) {
      webhookLog.error = "Order not found"
      await webhookLog.save()
      return res.status(404).json({ message: "Order not found" })
    }

    // Update order status
    await OrderStatus.findOneAndUpdate(
      { collect_id: order._id },
      {
        order_amount: order_info.order_amount,
        transaction_amount: order_info.transaction_amount,
        payment_mode: order_info.payment_mode,
        payment_details: order_info.payemnt_details,
        bank_reference: order_info.bank_reference,
        payment_message: order_info.Payment_message,
        status: order_info.status.toLowerCase(),
        error_message: order_info.error_message,
        payment_time: order_info.payment_time || new Date(),
      },
    )

    // Mark webhook as processed
    webhookLog.processed = true
    await webhookLog.save()

    res.json({ message: "Webhook processed successfully" })
  } catch (error) {
    next(error)
  }
}



const checkPaymentStatus = async (req, res, next) => {
  try {
    const { collect_request_id, school_id } = req.body;

    // Create the JWT sign using PG_KEY
    const sign = jwt.sign(
      { school_id: school_id.toString(), collect_request_id: collect_request_id.toString() },
      process.env.PG_KEY
    );
    const statusResponse = await axios.get(
      `https://dev-vanilla.edviron.com/erp/collect-request/${collect_request_id}?school_id=${school_id}&sign=${sign}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(statusResponse)
    res.status(200).json({
      status: statusResponse.data.status,
      message: "Payment status retrieved successfully",
      data: statusResponse.data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  processWebhook,
  checkPaymentStatus,
}
