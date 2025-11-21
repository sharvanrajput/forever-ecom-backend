import { Router } from "express"
import { addProduct, listProducts, removeProduct, singleProduct, updateProduct } from "../controllers/product.controller.js"
import { upload } from "../middleware/multer.js"
import { verifyJwt } from "../middleware/authMiddleware.js"
import { Adminauth } from "../middleware/adminAuth.js"

const productRoute = Router()

productRoute.post("/add", verifyJwt, Adminauth, upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 },]), addProduct)
productRoute.patch("/update/:id", verifyJwt, Adminauth, upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 },]), updateProduct)
productRoute.delete("/remove", verifyJwt, Adminauth, removeProduct)
productRoute.get("/single/:id", singleProduct)
productRoute.get("/list", listProducts)

export default productRoute
