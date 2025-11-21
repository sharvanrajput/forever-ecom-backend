import { Router } from 'express';
import { login, logout, register } from '../controllers/user.controller.js';
import { verifyJwt } from '../middleware/authMiddleware.js';

const userRotue = Router()

userRotue.post("/register", register)
userRotue.post("/login", login)
userRotue.post("/logout", logout)
userRotue.get("/me", verifyJwt, (req, res) => {
  res.status(200).json({ user: req.user });
});


export default userRotue