const Stripe = require("stripe");
const Order = require("../../models/Order");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ============================================
// CREATE STRIPE CHECKOUT SESSION
// ============================================
exports.createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Order already paid" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "HomeBakerConnect Order",
            },
            unit_amount: order.totalAmount * 100, // Stripe uses paise
          },
          quantity: 1,
        },
      ],

      success_url: `https://home-baker-connect.vercel.app/payment-success?orderId=${order._id}`,
      cancel_url: `https://home-baker-connect.vercel.app/userOrder`,
    });

    res.json({ url: session.url });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ============================================
// UPDATE PAYMENT STATUS (Manual Success Page Method)
// ============================================
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "Paid") {
      return res.json({ message: "Already Paid" });
    }

    order.paymentStatus = "Paid";
    await order.save();

    res.json({ message: "Payment Updated Successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ============================================
// STRIPE WEBHOOK (Recommended Production Method)
// ============================================
exports.stripeWebhook = async (req, res) => {

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed.");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const orderId = session.success_url.split("orderId=")[1];

    if (orderId) {
      const order = await Order.findById(orderId);

      if (order && order.paymentStatus !== "Paid") {
        order.paymentStatus = "Paid";
        await order.save();
      }
    }
  }

  res.status(200).json({ received: true });
};
