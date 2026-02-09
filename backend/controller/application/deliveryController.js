const Order = require("../../models/Order")
const DeliveryPerson = require("../../models/DeliveryPerson")

// =====================================
// ASSIGN DELIVERY PARTNER
// =====================================
exports.outForDelivery = async (req, res) => {
  try {

    const { orderId } = req.params

    const order = await Order.findById(orderId)

    if (!order)
      return res.status(404).json({ message: "Order not found" })

    if (order.deliveryPartnerId)
      return res.status(400).json({ message: "Partner already assigned" })

    const partners = await DeliveryPerson.find({ isAvailable: true })

    if (!partners.length)
      return res.status(400).json({ message: "No Delivery Partner Available" })

    const randomPartner =
      partners[Math.floor(Math.random() * partners.length)]

    const code = Math.floor(1000 + Math.random() * 9000).toString()

    order.status = "Out for Delivery"
    order.deliveryPartnerId = randomPartner._id
    order.deliveryCode = code

    await order.save()

    await DeliveryPerson.findByIdAndUpdate(randomPartner._id, {
      isAvailable: false,
      currentOrder: order._id
    })

    res.json({ message: "Delivery Partner Assigned", order })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// =====================================
// VERIFY DELIVERY CODE
// =====================================
exports.confirmDelivery = async (req, res) => {

  try {

    const { orderId, deliveryCode } = req.body

    const order = await Order.findById(orderId)

    if (!order)
      return res.status(404).json({ message: "Order not found" })

    if (order.deliveryCode !== deliveryCode)
      return res.status(400).json({ message: "Invalid Delivery Code" })

    res.json({ message: "Code Verified" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// =====================================
// GET DELIVERY PARTNER ORDERS
// =====================================


exports.getPartnerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartnerId: req.user.id,
      status: { $ne: "Delivered" },
    })
      .populate("userId", "fullName phoneNo houseFlatNo areaStreet city pincode")
      .sort({ createdAt: -1 });

    // Add this for debugging
    console.log("Fetched orders:", JSON.stringify(orders, null, 2));  // Check if userId is populated

    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};



// =====================================
// MARK DELIVERED
// =====================================
exports.markDelivered = async (req, res) => {

  try {

    const partnerId = req.user.id
    const { orderId } = req.params

    const order = await Order.findById(orderId)

    if (!order)
      return res.status(404).json({ message: "Order not found" })

    // ⭐ FIXED COMPARISON
    if (order.deliveryPartnerId.toString() !== partnerId.toString())
      return res.status(403).json({ message: "Unauthorized Delivery Attempt" })

    order.status = "Delivered"
    order.deliveredBy = partnerId
    order.deliveryCode = null

    await order.save()

    // FREE PARTNER
    await DeliveryPerson.findByIdAndUpdate(partnerId, {
      isAvailable: true,
      currentOrder: null
    })

    res.json({ message: "Order Delivered Successfully" })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ... existing code ...

// =====================================
// UPDATE DELIVERY PARTNER LOCATION
// =====================================
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const partnerId = req.user.id;

    await DeliveryPerson.findByIdAndUpdate(partnerId, {
      location: { lat, lng },
    });

    res.json({ message: "Location updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =====================================
// GET LOCATION FOR AN ORDER
// =====================================
exports.getLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id; // For user/baker auth

    const order = await Order.findById(orderId).populate("deliveryPartnerId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Allow only user or baker associated with the order
    if (order.userId.toString() !== userId && order.bakerId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.status !== "Out for Delivery") {
      return res.status(400).json({ message: "Tracking not available for this order" });
    }

    const location = order.deliveryPartnerId.location;
    res.json({ location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... existing code ...