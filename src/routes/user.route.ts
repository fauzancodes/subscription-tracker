import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.ts";
import { authorize, checkIsAdmin } from "../middlewares/auth.middleware.ts";

const userRouter = Router();

userRouter.get("/", authorize, checkIsAdmin, getUsers);
userRouter.get("/:id", authorize, getUser);
userRouter.post("/", authorize, checkIsAdmin, createUser);
userRouter.put("/:id", authorize, updateUser);
userRouter.delete("/:id", authorize, deleteUser);

export default userRouter;