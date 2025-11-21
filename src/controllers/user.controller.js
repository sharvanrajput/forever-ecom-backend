import { User } from "../models/user.model.js";



const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: false,        // keep false on localhost
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000
};


export const register = async (req, res) => {
  try {


    const { name, email, password } = req.body

    if ([name, email, password].some(field => field.trim() === "")) {
      return res.status(400).send({ success: false, message: `All fields are required` });
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(400).send({ success: false, message: `user already exist` });
    }

    const user = await User.create({
      name, email, password
    })

    const token = await user.generateToken()

    res.cookie("token", token, cookieOptions)

    res.status(201).send({ success: true, message: `User Register Successfully`, user, token });

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if ([email, password].some(field => field.trim() === "")) {
      return res.status(400).send({ success: false, message: `All fields are required` });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ success: false, message: `user not exist` });
    }

    const checkpass = user.isPasswordCorrect(password)

    if (!checkpass) {
      return res.status(500).send({ success: false, message: `Incrroce Password` });
    }

    const token = await user.generateToken()

    res.cookie("token", token, cookieOptions)
    res.status(201).send({ success: true, message: `User login Successfully`, user, token });

  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", cookieOptions)
    res.send({ success: true, message: `User logout Successfully` });
  } catch (error) {
    return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
  }
};

