const express = require("express")
const router = express.Router()

const deliveryController = require("../controller/application/deliveryController")
const { protect } = require("../middleware/authMiddleware")

router.put("/outForDelivery/:orderId", protect, deliveryController.outForDelivery)
router.put("/confirmDelivery", protect, deliveryController.confirmDelivery)
router.get("/partnerOrders", protect, deliveryController.getPartnerOrders)
router.put("/markDelivered/:orderId", protect, deliveryController.markDelivered)
// ... existing routes ...
router.put("/updateLocation", protect, deliveryController.updateLocation);
router.get("/getLocation/:orderId", protect, deliveryController.getLocation);
// ... existing routes ...

module.exports = router
