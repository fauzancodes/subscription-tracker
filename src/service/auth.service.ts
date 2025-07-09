import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUserData, getUserDataByEmail } from "../repository/user.repository.js";
import { generateError } from "../utilities/common.js";
import { JWT_SECRET, JWT_EXPIRY } from "../config/env.js";
import { UserResponse } from "../types/user.type.js";
import { SignInRequest, SignUpRequest } from "../types/auth.type.js";

export const signUpService = async ({ name, email, password }: SignUpRequest): Promise<{ user: UserResponse; token: string }> => {
  try {
    const existingUser = await getUserDataByEmail(email);
    if (existingUser) {
      const error = generateError("User already exists", 409);
      throw error;
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUsers = await createUserData([{
      name,
      email,
      password: hashedPassword
    }]);

    const token = jwt.sign(
      { userId: newUsers[0].id },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRY } as SignOptions
    );

    return {
      user: {
        id: newUsers[0]?._id.toString(),
        name: newUsers[0]?.name,
        email: newUsers[0]?.email,
        isAdmin: newUsers[0]?.isAdmin || false,
      },
      token
    };
  } catch (error) {
    throw error
  }
}

export const signInService = async ({ email, password }: SignInRequest): Promise<{ user: UserResponse; token: string }> => {
  try {
    const user = await getUserDataByEmail(email);
    if (!user) {
      const error = generateError("User not found", 404);
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      const error = generateError("Invalid password", 401);
      throw error;
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRY } as SignOptions
    );

    return {
      user: {
        id: user?._id.toString(),
        name: user?.name,
        email: user?.email,
        isAdmin: user?.isAdmin || false,
      },
      token
    };
  } catch (error) {
    throw error
  }
}