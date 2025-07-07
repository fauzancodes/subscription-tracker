import mongoose from "mongoose";
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRY } from '../config/env.js';
import { generateError } from "../utilities/common.js";

export const signUp = async (req, res, next) => {
  const databaseSession = await mongoose.startSession();
  databaseSession.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      const error = generateError("User already exists", 409);
      throw error;
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUsers = await User.create([
      {
        name,
        email,
        password: hashedPassword,
        isAdmin: false
      }
    ], { databaseSession })

    const token = jwt.sign(
      { userId: newUsers[0]._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    await databaseSession.commitTransaction();
    databaseSession.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers[0]
      }
    });
  } catch (error) {
    await databaseSession.abortTransaction();
    databaseSession.endSession();
    next(error);
  }
}

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      const error = generateError("User not found", 404);
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = generateError("Invalid password", 401);
      throw error;
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.status(200).json({
      success: true,
      message: "",
      data: {
        token,
        user
      }
    });
  } catch (error) {
    next(error)
  }
}

export const signOut = async (req, res, next) => {
  
}