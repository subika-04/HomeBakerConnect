const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Baker = require("../../models/Baker");
const DeliveryPerson = require("../../models/DeliveryPerson")


exports.userRegister = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNo,
      username,
      password,
      confirmPassword,
      houseFlatNo,
      areaStreet,
      city,
      pincode
    } = req.body;

    if (password != confirmPassword) {
      return res.status(400).json({message:"Password doesn't match with Confirm Password"});
    }

    const existingUser = await User.findOne({ email:email });
    const existingPhoneNo = await User.findOne({ phoneNo:phoneNo });
    const existingUsername=await User.findOne({username:username});

    if (existingUser || existingPhoneNo || existingUsername) {
      return res.status(400).json({message:"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phoneNo,
      username,
      password: hashedPassword,
      houseFlatNo,
      areaStreet,
      city,
      pincode
    });

    res.status(201).json({ message: "User Registered Successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.bakerRegister = async (req, res) => {
  try {
    const {
      bakerName,
      email,
      phoneNo,
      bakeryBrandName,
      typeOfBaker,
      yearsOfExperience,
      kitchenAddress,
      city,
      pincode,
      specialities,
      mode,
      customOrdersSupported,
      username,
      password,
      confirmPassword
    } = req.body;

    if (password != confirmPassword) {
      return res.status(400).json({message:"Password doesn't match with Confirm Password"});
    }

    const existingBaker = await Baker.findOne({ email });
    const existingPhoneNo = await Baker.findOne({ phoneNo });
    const existingUsername=await Baker.findOne({username:username});

    if (existingBaker || existingPhoneNo || existingUsername) {
      return res.status(400).json({message:"Baker already registered"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const baker = await Baker.create({
      bakerName,
      email,
      phoneNo,
      bakeryBrandName,
      typeOfBaker,
      yearsOfExperience,
      kitchenAddress,
      city,
      pincode,
      specialities,
      mode,
      customOrdersSupported,
      username,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Home Baker Registration Successfully Completed",
      baker
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {

  const { username, password } = req.body;

  let existingUser = await User.findOne({ username });
  let role = "User";

  if (!existingUser) {
    existingUser = await Baker.findOne({ username });
    role = "Baker";
  }

  if (!existingUser) {
    existingUser = await DeliveryPerson.findOne({ username });
    role = "Delivery";
  }

  if (!existingUser) {
    return res.status(400).send("User doesn't exist please register first");
  }

  const isMatching = await bcrypt.compare(password, existingUser.password);

  if (!isMatching) {
    
    return res.status(400).send("Incorrect Password");
  }

  const token = jwt.sign(
    { id: existingUser._id, role },
    process.env.JWT_SECRETKEY,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    message:"Login Successful",
    role,
    token,
    existingUser
  });
};

exports.deliveryRegister = async (req,res)=>{
  try{

    const {
      fullName,
      email,
      phoneNo,
      city,
      pincode,
      username,
      password,
      confirmPassword
    } = req.body

    if(password !== confirmPassword){
      return res.status(400).json({message:"Password mismatch"})
    }

    const existingDelivery = await DeliveryPerson.findOne({
      $or:[
        { email },
        { phoneNo },
        { username }
      ]
    })

    if(existingDelivery){
      return res.status(400).json({message:"Delivery Partner already exists"})
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const delivery = await DeliveryPerson.create({
      fullName,
      email,
      phoneNo,
      city,
      pincode,
      username,
      password: hashedPassword
    })

    res.status(201).json({
      message:"Delivery Partner Registered Successfully",
      delivery
    })

  }catch(error){
    res.status(400).json({message:error.message})
  }
}
