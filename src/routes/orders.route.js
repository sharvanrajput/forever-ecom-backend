import { Router } from "express"
import { upload } from "../middleware/multer.js"
import { verifyJwt } from "../middleware/authMiddleware.js"
import { Adminauth } from "../middleware/adminAuth.js"
import { allOrders, placeOrder, placeOrderStripe, updateOrderStatus, userOrder, verifyStripe } from "../controllers/order.controller.js"

const orderRoute = Router()

// admin route 
orderRoute.post("/listorder", verifyJwt, Adminauth, allOrders)
orderRoute.post("/status", verifyJwt, Adminauth, updateOrderStatus)

// payment feature 
orderRoute.post("/place", verifyJwt, placeOrder)
orderRoute.post("/stripe", verifyJwt, placeOrderStripe)

// user orders
orderRoute.post("/myorder", verifyJwt, userOrder)

// verify payment 
orderRoute.post("/verifystripe", verifyJwt, verifyStripe)



export default orderRoute
