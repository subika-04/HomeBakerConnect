const express=require("express")
const router=express.Router()

const {userRegister,bakerRegister,login,deliveryRegister}=require("../controller/authentication/authController")
router.post("/userRegister",userRegister)
router.post("/bakerRegister",bakerRegister)
router.post("/login",login)
router.post("/deliveryRegister",deliveryRegister)

module.exports=router