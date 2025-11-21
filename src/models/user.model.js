import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  cartData: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]

}, { timestamps: true })


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECREATE_KEY, { expiresIn: "1d" })
}


export const User = mongoose.model("User", userSchema)