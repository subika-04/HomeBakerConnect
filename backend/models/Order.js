const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bakerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Baker",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        quantity: Number,
        productImage: String
      }
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Placed",
        "Preparing",
        "Ready for Delivery",
        "Out for Delivery",
        "Delivered"
      ],
      default: "Placed",
    },

    deliveryPartnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      default: null
    },

    deliveryCode: {
      type: String,
      default: null
    },

    // ⭐ ADD THIS FIELD
    deliveredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      default: null
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
