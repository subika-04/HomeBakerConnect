const mongoose = require("mongoose");

const bakerSchema = mongoose.Schema({
  bakerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNo: {
    type: Number,
    required: true,
    unique: true
  },
  bakeryBrandName: {
    type: String,
    required: true,
    unique: true
  },
  typeOfBaker: {
    type: String,
    enum: ["Home Baker", "Cloud Kitchen"],
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: true
  },
  kitchenAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  specialities: {
    type: String,
    enum: ["Cakes", "Snacks", "Sweets, breads", "All"]
  },
  mode: {
    type: String,
    enum: ["Veg", "Non-veg", "Both"]
  },
  customOrdersSupported: {
    type: String,
    enum: ["Yes", "No"]
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String
  }
});

module.exports = mongoose.model("Baker", bakerSchema);
