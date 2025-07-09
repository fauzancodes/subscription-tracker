import mongoose from "mongoose";
import User from "../models/user.model.js"
import { UsersParams, UserRequest } from "../types/user.type.js";
import { escapeRegex } from "../utilities/common.js";

export const getUserDataByEmail = async (email: string) => {
  return await User.findOne({ email: email });
};

export const createUserData = async (users: UserRequest[]) => {
  const databaseSession = await mongoose.startSession();
  databaseSession.startTransaction();

  try {
    const newUsers = await User.create(users, { session: databaseSession });
    await databaseSession.commitTransaction();
    databaseSession.endSession();
  
    return newUsers;
  } catch (error) {
    await databaseSession.abortTransaction();
    databaseSession.endSession();

    throw error;
  }
}

export const getUsersData = async (params: UsersParams = {}) => {
  const {
    search,
    name,
    email,
    offset,
    limit,
    order,
    sort,
  } = params
  const filter: any = {};

  if (name) filter.name = name;
  if (email) filter.email = email;

  if (search) {
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { name: { $regex: `.*${safeSearch}.*`, $options: 'i' } },
      { email: { $regex: `.*${safeSearch}.*`, $options: 'i' } }
    ];
  }

  let query = User.find(filter);

  if (sort) {
    const sortOrder: 1 | -1 = order === 'desc' ? -1 : 1;
    query = query.sort({ [sort]: sortOrder });
  }

  if (typeof offset === 'number') {
    query = query.skip(offset);
  }

  if (typeof limit === 'number') {
    query = query.limit(limit);
  }

  return await query.exec();
};

export const getUserDataById = async (id: string) => {
  return await User.findById(id);
};
