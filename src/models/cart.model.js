import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  size: {
    type: String
  },
  quentity: {
    type: Number
  }

}, { timestamps: true })

export const Cart = mongoose.model("Cart", cartSchema)