const jwt = require("jsonwebtoken")
const axios = require("axios")
const Order = require("../models/Order.model")
const OrderStatus = require("../models/OrderStatus.model")
const WebhookLog = require("../models/WebhookLog.model")
const User = require("../models/User.model")
// Create a new payment
const createPayment = async (req, res, next) => {
  try {
    const { school_id, amount } = req.body

    // Generate a unique custom order ID

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
        sign: sign.toString(),
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

    const trustee_id = process.env.TRUSTEE_ID || "1234567890";
    const gateway_name = process.env.GATEWAY_NAME || "PhonePe";
    // console.log("user id ", req.user.id);
    const student_info = await User.findOne({ _id: req.user.id });
    // console.log(" Stu info ", student_info);

    const custom_order_id =  Math.floor(1000000000 + Math.random() * 9000000000).toString();
 
    const order = new Order({
      school_id,
      trustee_id,
      student_info: {
        name: student_info.username,
        id: student_info._id.toString(),
        email: student_info.email,
      },
      gateway_name,
      amount,
      edviron_collect_id: collect_request_id,
      custom_order_id: custom_order_id
    });

    await order.save();

    const orderDetails = await Order.findOne({ edviron_collect_id: collect_request_id });
    // console.log("Order id ", orderDetails);

    const orderStatus = new OrderStatus({
      order_id: orderDetails.id,
      order_amount: amount,
      transaction_amount: amount,
      status: "pending",
      gateway: gateway_name,
      payment_mode: "upi",
      payment_details: "success@ybl",
      bank_reference: "YESBNK222",
      payment_message: "payment success",
      status: "success",
      error_message: "NA",
      payment_time: new Date(),
      edviron_collect_id: collect_request_id,
    })

    await orderStatus.save()
    // console.log(" colect req id ", collect_request_id);
    console.log("Order created successfully", order);
    res.json(responsePayload);
  } catch (error) {
    console.error("Error creating payment:", error)
    next(error)
  }
}

// Process webhook
const processWebhook = async (req, res, next) => {
  try {
    const { status, EdvironCollectRequestId } = req.query;

    if (status === "SUCCESS") {
      // console.log("EdvironCollectRequestId  ", EdvironCollectRequestId);

      // Update order status
      await OrderStatus.findOneAndUpdate(
        { edviron_collect_id: EdvironCollectRequestId },
        { status: "success" },
        { new: true }
      )


      // Check if the order exists in the database
      const orderDetails = await Order.findOne({ edviron_collect_id: EdvironCollectRequestId });
      // console.log("Order id ", orderDetails);

      if (!orderDetails) {
        return res.status(404).json({ message: "Order not found" });
      }
      const webhookLog = new WebhookLog({
        collect_request_id: EdvironCollectRequestId,
        status: status,
        order_id: orderDetails._id,
      })

      await webhookLog.save();

      console.log("Webhook log saved successfully");
      res.redirect(`${process.env.CLIENT_URL}/payment-success?status=${status}`);
      res.json({ message: "Webhook processed successfully" })
      
     
    } else {
      res.redirect(`${process.env.CLIENT_URL}/payment-success?status=${status}`);
      res.json({ message: "Webhook processed successfully" })
    }
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
    // console.log(statusResponse)
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
