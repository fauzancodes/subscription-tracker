import User from "../models/user.model.js";
import { generateError } from "../utilities/common.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      message: "Success to get users",
      data: users
    })
  } catch (error) {
    next(error)
  }
}

export const getUser = async (req, res, next) => {
  try {
    let user = req.user
    if (req.user.isAdmin) {
      user = await User.findById(req.params.id).select("-password");
      if (!user) {
        const error = generateError("User not found", 404);
        throw error;
      }
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

export const createUser = async (req, res, next) => {
  req.body.password = await bcrypt.hash(req.body.password, 12);
  
  try {
    const user = await User.create({
      ...req.body,
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

export const deleteUser = async (req, res, next) => {
  try {
    let userId = req.user.id
    if (req.user.isAdmin) {
      userId = req.params.id
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = generateError("User not found", 404);
      throw error;
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "Success to delete user"
    })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    let userId = req.user.id
    if (req.user.isAdmin) {
      userId = req.params.id
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = generateError("User not found", 404);
      throw error;
    }

    if (req.body.name) {
      user.name = req.body.name
    }
    if (req.body.email) {
      user.email = req.body.email
    }
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 12);
    }
    if (req.user.isAdmin) {
      user.isAdmin = req.body.isAdmin
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Success to update user"
    })
  } catch (error) {
    next(error)
  }
}
