import { Router } from "express"

import { upload } from "../middleware/multer.js"
import { verifyJwt } from "../middleware/authMiddleware.js"
import { Adminauth } from "../middleware/adminAuth.js"
import { addToCart, getUserCart, removeItemFromCart, updateItemQuentity } from "../controllers/cart.controller.js"

const cartRoute = Router()

cartRoute.get("/get", verifyJwt, getUserCart)
cartRoute.post("/add", verifyJwt, addToCart)
cartRoute.post("/update", verifyJwt, updateItemQuentity)
cartRoute.post("/remove", verifyJwt, removeItemFromCart)


export default cartRoute
