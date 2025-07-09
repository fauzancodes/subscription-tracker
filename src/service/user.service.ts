import { createUserData, getUserDataByEmail, getUserDataById, getUsersData } from "../repository/user.repository.js";
import { UsersParams, UserRequest, UserResponse } from "../types/user.type.js";
import { generateError } from "../utilities/common.js";
import bcrypt from "bcryptjs";

export const getUsersService = async (params: UsersParams): Promise<UserResponse[]> => {
  try {
    const users = await getUsersData(params);

    return users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin ?? false,
    }));
  } catch (error) {
    throw error
  }
}

export const getUserByIdService = async (id: string): Promise<UserResponse> => {
  try {
    const user = await getUserDataById(id);

    return {
      id: user?._id.toString(),
      name: user?.name,
      email: user?.email,
      isAdmin: user?.isAdmin || false,
    }
  } catch (error) {
    throw error
  }
}

export const createUserService = async ({ name, email, password, isAdmin }: UserRequest): Promise<UserResponse> => {
  try {
    const existingUser = await getUserDataByEmail(email || "");
    if (existingUser) {
      const error = generateError("User already exists", 409);
      throw error;
    }
    
    const hashedPassword = await bcrypt.hash(password || "", 12);

    const newUsers = await createUserData([{
      name,
      email,
      password: hashedPassword,
      isAdmin
    }]);

    return {
      id: newUsers[0]?._id.toString(),
      name: newUsers[0]?.name,
      email: newUsers[0]?.email,
      isAdmin: newUsers[0]?.isAdmin || false,
    };
  } catch (error) {
    throw error
  }
}

export const deleteUserByIdService = async (id: string) => {
  try {
    const user = await getUserDataById(id);
    if (!user) {
      throw generateError("User not found", 404);
    }

    await user?.deleteOne()

    return;
  } catch (error) {
    throw error
  }
}

export const updateUserByIdService = async (id: string, user: UserRequest, isAdmin: boolean) => {
  try {
    const userData = await getUserDataById(id);
    if (!userData) {
      throw generateError("User not found", 404);
    }

    if (user.name) {
      userData.name = user.name
    }
    if (user.email) {
      userData.email = user.email
    }
    if (user.password) {
      userData.password = await bcrypt.hash(user.password, 12);
    }
    if (isAdmin) {
      userData.isAdmin = user.isAdmin
    }

    return;
  } catch (error) {
    throw error
  }
}