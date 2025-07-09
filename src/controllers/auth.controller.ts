import { NextFunction, Request, Response } from "express";
import { SignInRequest, SignUpRequest } from "../types/auth.type.js";
import { signInService, signUpService } from "../service/auth.service.js";

export const signUp = async (req: Request<{}, {}, SignUpRequest>, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const { user, token } = await signUpService({ name, email, password })

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user
      }
    });
  } catch (error) {
    next(error);
  }
}

export const signIn = async (req: Request<{}, {}, SignInRequest>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await signInService({email, password})

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