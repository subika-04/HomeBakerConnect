const express = require("express");
const router = express.Router();
const paymentController = require("../controller/application/paymentController");

// Create Checkout Session
router.post("/createCheckoutSession", paymentController.createCheckoutSession);

// Update Payment Status (Success Page Method)
router.put("/updatePaymentStatus/:orderId", paymentController.updatePaymentStatus);

// Webhook Route (MUST use raw body)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);

module.exports = router;
