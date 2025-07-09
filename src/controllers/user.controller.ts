import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../types/user.type.js";
import { generateError } from "../utilities/common.js";
import { createUserService, deleteUserByIdService, getUserByIdService, getUsersService, updateUserByIdService } from "../service/user.service.js";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { search, name, email } = req.query

    search = typeof search === "string" ? search : ""
    name = typeof name === "string" ? name : ""
    email = typeof email === "string" ? email : ""

    const users = await getUsersService({search, name, email})

    res.status(200).json({
      success: true,
      message: "Success to get users",
      data: users
    })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.user?.id
    if (req.user?.isAdmin) {
      userId = req.params.id
    }

    const user = await getUserByIdService(userId || "")
    if (!user) {
      const error = generateError("User not found", 404);
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Success to get user details",
      data: user
    })
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req: Request<{}, {}, UserRequest>, res: Response, next: NextFunction) => {
  try {
    const user = await createUserService({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
    })

    res.status(201).json({
      success: true,
      message: "Success to create user",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let userId = req.user?.id
    if (req.user?.isAdmin) {
      userId = req.params.id
    }

    await deleteUserByIdService(userId || "")

    res.status(200).json({
      success: true,
      message: "Success to delete user"
    })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req: Request<{ id: string }, {}, UserRequest>, res: Response, next: NextFunction) => {
  try {
    let userId = req.user?.id
    if (req.user?.isAdmin) {
      userId = req.params.id
    }

    const user = await updateUserByIdService(userId || "", req.body, req.user?.isAdmin || false)

    res.status(200).json({
      success: true,
      message: "Success to update user",
      data: {
        user
      }
    })
  } catch (error) {
    next(error)
  }
}
