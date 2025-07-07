import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authorize = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    };
    
    if (!token) {
      console.log("Token not provided")
      return res.status(401).json({ message: 'Unauthorized' });
    };

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("User not found")
      return res.status(401).json({ message: 'Unauthorized' });
    };

    req.user = user

    next();
  } catch (error) {
    console.log("Unknown authorization")
    res.status(401).json({
      message: "Unauthorized",
      error: error.message
    });
  }
}

export const checkIsAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(401).json({ message: 'Unauthorized' });
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
      error: error.message
    });
  }
}