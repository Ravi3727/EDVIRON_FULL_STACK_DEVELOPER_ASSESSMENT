const Order = require("../models/Order.model")
const OrderStatus = require("../models/OrderStatus.model")

// Get all transactions with pagination, sorting, and filtering
const getAllTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sort || "orderStatus.payment_time";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const filter = {};

    if (req.query.status) {
      filter["orderStatus.status"] = req.query.status;
    }

    if (req.query.schoolId) {
      filter["school_id"] = req.query.schoolId;
    }

    if (req.query.startDate || req.query.endDate) {
      filter["orderStatus.payment_time"] = {};
      if (req.query.startDate) {
        filter["orderStatus.payment_time"].$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter["orderStatus.payment_time"].$lte = new Date(req.query.endDate);
      }
    }

    const transactions = await Order.aggregate([
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "order_id",
          as: "orderStatus",
        },
      },
      { $unwind: "$orderStatus" },
      { $match: filter },
      {
        $project: {
          collect_id: "$edviron_collect_id",
          school_id: 1,
          gateway: "$gateway_name",
          order_amount: "$orderStatus.order_amount",
          transaction_amount: "$orderStatus.transaction_amount",
          status: "$orderStatus.status",
          custom_order_id: "$custom_order_id",  
          payment_time: "$orderStatus.payment_time",
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await Order.countDocuments();

    res.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get transactions by school
const getTransactionsBySchool = async (req, res, next) => {
  try {
    const { schoolId } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sort || "orderStatus.payment_time";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const transactions = await Order.aggregate([
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "order_id", // ✅ CORRECT FIELD
          as: "orderStatus",
        },
      },
      { $unwind: "$orderStatus" },
      {
        $project: {
          collect_id: "$edviron_collect_id",
          school_id: 1,
          gateway: "$gateway_name",
          order_amount: "$orderStatus.order_amount",
          transaction_amount: "$orderStatus.transaction_amount",
          status: "$orderStatus.status",
          custom_order_id: "$custom_order_id",
          payment_time: "$orderStatus.payment_time",
        },
      },
      { $sort: { [sortField]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const total = await Order.countDocuments({ school_id: schoolId });

    res.json({
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};


// Check transaction status
const checkTransactionStatus = async (req, res, next) => {
  try {
    const { customOrderId } = req.params

    // Find order by custom_order_id
    const order = await Order.findOne({ custom_order_id: customOrderId })

    if (!order) {
      return res.status(404).json({ message: "Transaction not found" })
    }

    // Find order status
    const orderStatus = await OrderStatus.findOne({ order_id: order._id })

    if (!orderStatus) {
      return res.status(404).json({ message: "Transaction status not found" })
    }

    res.json({
      transaction_id: customOrderId,
      collect_id: order._id,
      school_id: order.school_id,
      gateway: order.gateway_name,
      order_amount: orderStatus.order_amount,
      transaction_amount: orderStatus.transaction_amount,
      status: orderStatus.status,
      payment_mode: orderStatus.payment_mode,
      payment_details: orderStatus.payment_details,
      payment_time: orderStatus.payment_time,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllTransactions,
  getTransactionsBySchool,
  checkTransactionStatus,
}
