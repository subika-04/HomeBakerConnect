const Baker = require("../../models/Baker");
const Product=require("../../models/Product")
const Order=require("../../models/Order")

exports.addProduct=async(req,res)=>{
    console.log("BODY:", req.body);
console.log("FILE:", req.file);

    try{
    if (req.user.role !== "Baker") {
      return res.status(403).json({ message: "Access denied" });
    }
    const {
  productName,
  category,
  mode,
  description,
  customization,
  price,
  preparationTime,
} = req.body;
    if (!req.file) {
  return res.status(400).json({ message: "Product image is required" });
}
    const productImage = req.file.path;
    const existingProduct=await Product.findOne({productName:productName,bakerId:req.user.id});
    if(existingProduct)
    {
        return res.status(400).json({message:"Product already exists"});
    }
    const product=await Product.create({
        productName, category, productImage, mode, description, customization, price, preparationTime,bakerId:req.user.id
    })
    res.status(201).json({message:"Product added to inventory Successfully",product});
}
catch(error)
{
    res.status(400).json({message:error.message});
}
}

exports.getBakerProducts=async(req,res)=>{
    const baker=req.user.id;
    const products=await Product.find({bakerId:baker}).sort({ createdAt: -1 })
    if (products.length === 0) {
  return res.status(200).json({ message: "No products added yet", products: [] });
}
    res.status(200).json({products});
}


exports.getAllProductsForCustomer=async(req,res)=>{
    try
    {
    const bakers=await Baker.find();
    const data=await Promise.all(
        bakers.map(async(baker)=>{
            const products=await Product.find({ bakerId: baker._id });
            return {baker,products}
        })
        
    )
    res.send(data)
}
catch(error)
{
    res.status(400).json({message:error.message})
}
}

exports.placeOrder = async (req, res) => {
    try {
        const { cart } = req.body;
        if (!cart || cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        const placedOrder = await Order.create({
  userId: req.user.id,         // comes from JWT middleware
  bakerId: cart[0].bakerId,    // same baker for all items
  items: cart.map(item => ({
    productId: item._id,
    name: item.productName,
    price: item.price,
    quantity: item.quantity,
    productImage:item.productImage
  })),
  totalAmount: cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ),
});

        res.status(201).json({ message: "Order Placed Successfully", order: placedOrder,orderId:placedOrder._id });
    } catch (error) {
  console.error("Place order error:", error);
  res.status(500).json({ message: error.message });
}

};

exports.getUserOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate(
        "bakerId",
        "name bakeryBrandName email phoneNo kitchenAddress"
      )
      .populate(
        "deliveryPartnerId",
        "fullName phoneNo city location"
      )
      .populate(
        "userId",
        "fullName phoneNo location"   // 🔥 ADD THIS
      );

    res.status(200).json({ orders });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 


exports.getBakerOrder=async(req,res)=>{
    try{
    const bakerId=req.user.id;
    const orders = await Order.find({ bakerId: bakerId }).sort({ createdAt: -1 })
.populate("deliveryPartnerId", "fullName phoneNo")
.populate("deliveredBy", "fullName _id")   // ⭐ ADD THIS

    res.status(200).json({orders:orders})
    }
    catch(error){
        res.status(500).json({message:error.message})
    }
}


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId).sort({ createdAt: -1 });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBakeryDetails = async (req, res) => {
  try {
    const mongoose = require("mongoose");

const baker = await Baker.findById(
  new mongoose.Types.ObjectId(req.params.id)
);

    console.log("Requested Baker ID:", req.params.id);

    console.log("Found Baker:", baker);

    if (!baker) {
      return res.status(404).json({ message: "Bakery not found" });
    }

    res.json(baker);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

