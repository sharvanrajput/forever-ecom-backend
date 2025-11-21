import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJwt = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];


    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized request" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECREATE_KEY);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};
