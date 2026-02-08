const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); 
const express=require("express")
const app=express()

const mongoose=require("mongoose")
const dotenv=require("dotenv")
const cors=require("cors")

dotenv.config();
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
  });


app.use("/auth",require("./routes/authRoutes"))
app.use("/product",require("./routes/productRoutes"))
app.use("/delivery", require("./routes/deliveryRoutes"))
app.get("/demo",(req,res)=>{
res.send("hi from express")
})

app.listen(9000,()=>{
    console.log("Server running on Port 9000");
})

const multer = require("multer");

app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err.message) {
    return res.status(500).json({ message: err.message });
  }

  res.status(500).json({ message: "Unknown server error" });
});
