import { Cart } from "../models/cart.model.js";

export const addToCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { productId, size, quentity } = req.body;

    // FIND ONE document (NOT array)
    const existingProduct = await Cart.findOne({
      userid: id,
      productId,
      size
    });

    // IF product does not exist in cart → create new
    if (!existingProduct) {
      const cart = await Cart.create({
        userid: id,
        productId,
        size,
        quentity: quentity || 1
      });

      return res.status(201).send({
        success: true,
        message: "Product added to your cart",
        cart
      });
    }

    // IF product exists → update quantity
    existingProduct.quentity += quentity || 1;
    await existingProduct.save();

    return res.status(200).send({
      success: true,
      message: "Quantity updated successfully",
      cart: existingProduct
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: `Internal Server Error: ${error.message}`
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { id } = req.body
    const deleteProduct = await Cart.findByIdAndDelete(id)
    return res.status(200).send({
      success: true,
      message: "Item Removed from cart successfully",
      deleteProduct
    });

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const { id } = req.user
    const userCart = await Cart.find({ userid: id }).populate("productId").populate("userid");
    return res.status(200).send({ success: true, message: `All Cart Items`, userCart });
  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

export const updateItemQuentity = async (req, res) => {
  try {

    const { id } = req.user
    const { productId, size, quentity } = req.body;

    // FIND ONE document (NOT array)
    const existingProduct = await Cart.findOne({
      userid: id,
      productId,
      size
    });

    existingProduct.quentity = Number(quentity);
    await existingProduct.save();

    return res.status(200).send({
      success: true,
      message: "Item Quentity Update successfully",
      existingProduct
    });

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};
