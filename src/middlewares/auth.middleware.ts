import { JWT_SECRET } from "../config/env.ts";
import jwt from "jsonwebtoken";
import User from "../models/user.model.ts";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean;
      };
    }
  }
}

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    };
    
    if (!token) {
      console.log("Token not provided");
      res.status(401).json({ message: 'Unauthorized' });
      return;
    };

    const decoded = jwt.verify(token, JWT_SECRET as string);

    let userId: string | undefined;
    if (typeof decoded === "object" && "userId" in decoded) {
      userId = (decoded as jwt.JwtPayload).userId as string;
    }

    if (!userId) {
      console.log("userId not found in token");
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      console.log("User not found")
      res.status(401).json({ message: 'Unauthorized' });
      return;
    };

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin || false
    }

    next();
  } catch (error: any) {
    console.log("Unknown authorization")
    res.status(401).json({
      message: "Unauthorized",
      error: error.message
    });
  }
}

export const checkIsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.isAdmin) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      message: "Unauthorized",
      error: error.message
    });
  }
}