import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./config/db.js"
import userRotue from "./routes/user.route.js"
import productRoute from "./routes/product.route.js"
import cartRoute from "./routes/cart.route.js"
import orderRoute from "./routes/orders.route.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"));

app.use("/api/v1/user", userRotue)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/cart", cartRoute)
app.use("/api/v1/order", orderRoute)

connectDB().then(() => (
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
))

