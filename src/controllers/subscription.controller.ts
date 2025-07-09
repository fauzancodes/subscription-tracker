import { NextFunction, Request, Response } from "express";
import Subscription from "../models/subscription.model.js";
import { generateError } from "../utilities/common.js";
import { SubscriptionRequest } from "../types/subscription.type.js";
import { createSubscriptionService, deleteSubscriptionByIdService, getSubscriptionByIdService, getSubscriptionsService, updateSubscriptionByIdService } from "../service/subscription.service.js";
import { getSubscriptionsData } from "../repository/subscription.repository.js";

export const createSubscription = async (req: Request<{}, {}, SubscriptionRequest>, res: Response, next: NextFunction) => {
  try {
    const { subscription, workflowRunId} = await createSubscriptionService({
      ...req.body,
      user: req.user?.id,
    })

    res.status(201).json({
      success: true,
      message: "Success to create subscription",
      data: {
        subscription,
        workflowRunId,
      }
    });
  } catch (error) {
    next(error);
  }
}

export const getUserSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await getSubscriptionsData({ userId: req.user?.id });

    res.status(200).json({
      success: true,
      message: "Success to get user subscriptions",
      data: subscriptions
    })
  } catch (error) {
    next(error);
  }
}

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let {
      search,
      name,
      currency,
      frequency,
      category,
      status,
      startDateFrom,
      startDateTo,
      renewalDateFrom,
      renewalDateTo,
      paymentMethod,
      userId,
    } = req.query

    search = typeof search === "string" ? search : ""
    name = typeof name === "string" ? name : ""
    currency = typeof currency === "string" ? currency : ""
    frequency = typeof frequency === "string" ? frequency : ""
    category = typeof category === "string" ? category : ""
    status = typeof status === "string" ? status : ""
    startDateFrom = typeof startDateFrom === "string" ? startDateFrom : ""
    startDateTo = typeof startDateTo === "string" ? startDateTo : ""
    renewalDateFrom = typeof renewalDateFrom === "string" ? renewalDateFrom : ""
    renewalDateTo = typeof renewalDateTo === "string" ? renewalDateTo : ""
    paymentMethod = typeof paymentMethod === "string" ? paymentMethod : ""
    userId = typeof userId === "string" ? userId : ""

    const startDateFromDate = new Date(startDateFrom)
    const startDateToDate = new Date(startDateTo)
    const renewalDateFromDate = new Date(renewalDateFrom)
    const renewalDateToDate = new Date(renewalDateTo)

    const subscriptions = getSubscriptionsService({
      search,
      name,
      currency,
      frequency,
      category,
      status,
      startDateFrom: startDateFromDate,
      startDateTo: startDateToDate,
      renewalDateFrom: renewalDateFromDate,
      renewalDateTo: renewalDateToDate,
      paymentMethod,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Success to get Subscriptions",
      data: subscriptions
    })
  } catch (error) {
    next(error)
  }
}

export const getSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await getSubscriptionByIdService(req.params.id, req.user?.id || "", req.user?.isAdmin || false);
    if (!subscription) {
      const error = generateError("Subscription not found", 404);
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Success to get subscription details",
      data: subscription
    })
  } catch (error) {
    next(error)
  }
}

export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteSubscriptionByIdService(req.params.id, req.user?.id || "", req.user?.isAdmin || false)

    res.status(200).json({
      success: true,
      message: "Success to get subscription details"
    })
  } catch (error) {
    next(error)
  }
}

export const updateSubscription = async (req: Request<{ id: string }, {}, SubscriptionRequest>, res: Response, next: NextFunction) => {
  try {
    const subscription = await updateSubscriptionByIdService(req.params.id, req.user?.id || "", req.body, req.user?.isAdmin || false)

    res.status(200).json({
      success: true,
      message: "Success to get subscription details",
      data: {
        subscription
      }
    })
  } catch (error) {
    next(error)
  }
}
