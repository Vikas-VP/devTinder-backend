const express = require("express");
const userAuth = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const PAYMENT_OPTIONS = require("../utils/payment.constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/User");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  const currUser = req.user;

  const { membershipType } = req.body;
  try {
    const order = await razorpayInstance.orders.create({
      amount: PAYMENT_OPTIONS[membershipType] * 100, // we are multiplying buy hundred because it takes the least currency value i.e paisa in India Eg:₹700 is 700*100=>70000 paisa
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName: currUser.firstName,
        lastName: currUser.lastName,
        membershipType,
      },
    });
    const payment = new Payment({
      userId: currUser._id,
      orderId: order?.id,
      amount: order?.amount,
      currency: order?.currency,
      notes: order?.notes,
      receipt: order?.receipt,
      status: order?.status,
    });
    const savedPayment = await payment.save();
    res.json({
      message: "Payment Order created successfully",
      data: { ...savedPayment, keyId: process.env.RAZORPAY_KEY_ID },
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    console.log("webhook called");
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log(webhookSignature, "webhookSignature");
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).send("Invalid webhook signature");
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({
      orderId: paymentDetails?.order_id,
    });

    if (!payment) {
      return res.status(404).send("Payment record not found");
    }

    payment.status = paymentDetails?.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    if (user) {
      user.isPremium = true;
      user.membershipType = payment.notes.membershipType;
      await user.save();
    }

    console.log("✅ Payment processed:", paymentDetails, payment, user);
    res.status(200).json({ message: "Payment successful", data: user });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).send("Error: " + error.message);
  }
});

module.exports = paymentRouter;
