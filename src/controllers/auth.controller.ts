import mongoose from "mongoose";
import User from '../models/user.model.ts';
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRY } from '../config/env.ts';
import { generateError } from "../utilities/common.ts";
import { NextFunction, Request, Response } from "express";
import { SignInRequest, SignUpRequest } from "../types/auth.ts";

export const signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response, next: NextFunction) => {
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
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRY } as SignOptions
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

export const signIn = async (req: Request<{}, {}, SignInRequest>, res: Response, next: NextFunction) => {
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
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRY } as SignOptions
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

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  
}