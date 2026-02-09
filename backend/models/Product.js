const mongoose=require("mongoose")
const Baker=require("../models/Baker")

const productSchema=mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
        required:true
    },
    mode:{
        type:String,
        enum:["Veg","Non-veg","Eggless"],
        required:true
    },
    description:{
        type:String,
        required:true
    },
    customization:{
        type:String,
        enum:["Yes","No"],
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    preparationTime:{
        type:Number,
        required:true
    },
    bakerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Baker",
    required:true
    }
})

module.exports=mongoose.model("Product",productSchema)