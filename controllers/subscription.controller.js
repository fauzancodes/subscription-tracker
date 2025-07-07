import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { generateError } from "../utilities/common.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    })

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
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

export const getUserSubscription = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: "Success to get user subscriptions",
      data: subscriptions
    })
  } catch (error) {
    next(error);
  }
}

export const getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();

    res.status(200).json({
      success: true,
      message: "Success to get Subscriptions",
      data: subscriptions
    })
  } catch (error) {
    next(error)
  }
}

export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = generateError("Subscription not found", 404);
      throw error;
    }

    if (!req.user.isAdmin && subscription.user != req.user.id) {
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

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = generateError("Subscription not found", 404);
      throw error;
    }

    if (!req.user.isAdmin && subscription.user != req.user.id) {
      const error = generateError("Subscription not found", 404);
      throw error;
    }

    await Subscription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Success to get subscription details"
    })
  } catch (error) {
    next(error)
  }
}

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = generateError("Subscription not found", 404);
      throw error;
    }

    if (!req.user.isAdmin && subscription.user != req.user.id) {
      const error = generateError("Subscription not found", 404);
      throw error;
    }

    if (req.body.name) {
      subscription.name = req.body.name
    }
    if (req.body.price) {
      subscription.price = req.body.price
    }
    if (req.body.currency) {
      subscription.currency = req.body.currency
    }
    if (req.body.frequency) {
      subscription.frequency = req.body.frequency
    }
    if (req.body.category) {
      subscription.category = req.body.category
    }
    if (req.body.paymentMethod) {
      subscription.paymentMethod = req.body.paymentMethod
    }
    if (req.body.status) {
      subscription.status = req.body.status
    }
    if (req.body.startDate) {
      subscription.startDate = req.body.startDate
    }
    if (req.body.renewalDate) {
      subscription.renewalDate = req.body.renewalDate
    }

    res.status(200).json({
      success: true,
      message: "Success to get subscription details"
    })
  } catch (error) {
    next(error)
  }
}
