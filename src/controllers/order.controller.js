import { Cart } from "../models/cart.model.js";
import { Order } from "../models/order.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "inr"
const deliveryCharges = 10

export const placeOrder = async (req, res) => {
  try {

    const { id } = req.user
    const { amount, address } = req.body

    const userCart = await Cart.find({ userid: id })
    if (userCart.length < 1) {
      return res.status(500).send({ success: false, message: `select a product cart is empty` });
    }

    const orderData = {
      userid: id,
      amount,
      address,
      items: [...userCart],
      status: "Ready for Dispatch",
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    }

    const newOrder = await Order.create(orderData)

    return res.status(201).send({ success: true, message: `Order placed successfully`, newOrder });

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

export const verifyStripe = async (req, res) => {
  try {
    const { id } = req.user
    const { orderid, success } = req.body

    if (success === "true") {
      await Order.findByIdAndUpdate(orderid, { payment: success })
      await Cart.deleteMany({ userid: id })
      res.json({ success: true })
    } else {
      await Order.findByIdAndDelete(orderid)
      res.json({ success: false })
    }

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};


export const placeOrderStripe = async (req, res) => {
  try {
    const { id } = req.user;
    const { amount, address } = req.body;

    const userCart = await Cart.find({ userid: id }).populate("productId");

    if (!userCart || userCart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // ---- Create Order First ----
    const orderData = {
      userid: id,
      amount,
      address,
      items: userCart,
      status: "Order Placed",
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now()
    };

    const newOrder = await Order.create(orderData);

    // ---- Create Stripe Line Items ----
    const line_items = userCart.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.productId.name,
          images: [item.productId.image[0]],
        },
        unit_amount: item.productId.price * 100,
      },
      quantity: item.quentity,
    }));

    // Add delivery charge
    const deliveryCharges = 50; // <-- Change according to your logic
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });

    const origin = process.env.FRONTEND_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};


export const placeOrderRazorpay = async (req, res) => {
  try {

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

export const allOrders = async (req, res) => {
  try {
    const { id } = req.user
    const order = await Order.find({ userid: id }).populate({ path: "items.productId", strictPopulate: false }).populate({ path: "items.userid", strictPopulate: false });
    return res.status(200).send({ success: true, message: `All Orders for adming`, order });

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message} ` });
  }
};

export const userOrder = async (req, res) => {
  try {
    const { id } = req.user
    const userOrder = await Order.find({ userid: id }).populate("items.productId").populate("items.userid");

    return res.status(200).send({ success: true, message: `User order fatch successfully`, userOrder });
  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message} ` });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {

    const { id, status } = req.body

    const updatestatus = await Order.findByIdAndUpdate(id, { status })

    return res.status(200).send({ success: true, message: `status updated successfully`, updatestatus });

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message} ` });
  }
};