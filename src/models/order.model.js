import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      quentity: {
        type: Number,
        required: true
      },
      size: {
        type: String,
        required: true
      }
    }
  ],

  amount: {
    type: Number,
    required: true
  },

  address: {
    type: Object,
    required: true
  },

  status: {
    type: String,
    required: true
  },

  paymentMethod: {
    type: String,
    required: true
  },

  payment: {
    type: Boolean,
    default: false,
    required: true
  },

  date: {
    type: Number,
    required: true
  }

}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema)