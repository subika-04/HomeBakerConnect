const express=require("express")
const router=express.Router()

const {addProduct, getBakerProducts,getAllProductsForCustomer,placeOrder,getUserOrder,getBakerOrder,updateOrderStatus,getBakeryDetails}=require("../controller/application/productController")
const { protect } = require("../middleware/authMiddleware")
const upload = require("../middleware/multer")
router.post("/addProduct",protect,upload.single("productImage"), addProduct)
router.get("/getBakerProducts",protect,getBakerProducts)
router.get("/getAllProductsForCustomer",protect,getAllProductsForCustomer)
router.post("/placeOrder",protect,placeOrder)
router.get("/getUserOrder",protect,getUserOrder)
router.get("/getBakerOrder",protect,getBakerOrder)
router.put("/updateOrderStatus",protect,updateOrderStatus)
router.get("/getBakeryDetails/:id",protect,getBakeryDetails)

module.exports=router