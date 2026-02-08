const mongoose = require("mongoose")

const deliveryPersonSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phoneNo: {
    type: String,
    required: true,
    unique: true
  },

  city: {
    type: String,
    required: true
  },

  pincode: {
    type: String,
    required: true
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

  isAvailable: {
    type: Boolean,
    default: true
  },
  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  }

},{timestamps:true})

module.exports = mongoose.model("DeliveryPerson", deliveryPersonSchema)
