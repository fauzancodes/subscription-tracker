import { Router } from "express";
import { authorize, checkIsAdmin } from "../middlewares/auth.middleware.ts";
import { createSubscription, deleteSubscription, getSubscription, getSubscriptions, getUserSubscription, updateSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.get("/", authorize, checkIsAdmin, getSubscriptions);
subscriptionRouter.get("/user", authorize, getUserSubscription);
subscriptionRouter.get("/:id", authorize, getSubscription);
subscriptionRouter.put("/:id", authorize, updateSubscription);
subscriptionRouter.delete("/:id", authorize, deleteSubscription);

export default subscriptionRouter;