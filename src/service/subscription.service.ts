import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import { createSubscriptionData, getSubscriptionDataById, getSubscriptionsData } from "../repository/subscription.repository.js";
import { SubscriptionRequest, SubscriptionResponse, SubscriptionsParams } from "../types/subscription.type.js";
import { generateError } from "../utilities/common.js";

export const createSubscriptionService = async (subscription: SubscriptionRequest): Promise<{ subscription: SubscriptionResponse, workflowRunId: string }> => {
  try {
    const newSubscription = await createSubscriptionData(subscription);

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: newSubscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    })

    return {
      subscription: {
        id: newSubscription?._id.toString(),
        name: newSubscription?.name,
        price: newSubscription?.price,
        currency: newSubscription?.currency,
        frequency: newSubscription?.frequency ?? undefined,
        category: newSubscription?.category,
        status: newSubscription?.status,
        startDate: newSubscription?.startDate,
        renewalDate: newSubscription?.renewalDate ?? undefined,
        paymentMethod: newSubscription?.paymentMethod,
        user: newSubscription?.user.toString(),
      },
      workflowRunId
    };
  } catch (error) {
    throw error
  }
}

export const getSubscriptionsService = async (params: SubscriptionsParams): Promise<SubscriptionResponse[]> => {
  try {
    const subscriptions = await getSubscriptionsData(params);

    return subscriptions.map(subscription => ({
      id: subscription._id.toString(),
      name: subscription.name,
      price: subscription.price,
      currency: subscription.currency,
      frequency: subscription.frequency ?? undefined,
      category: subscription.category,
      status: subscription.status,
      startDate: subscription.startDate ?? undefined,
      renewalDate: subscription.renewalDate ?? undefined,
      paymentMethod: subscription.paymentMethod,
      user: subscription.user.toString(),
    }));
  } catch (error) {
    throw error
  }
}

export const getSubscriptionByIdService = async (id: string, userId: string, isAdmin: boolean): Promise<SubscriptionResponse> => {
  try {
    const subscription = await getSubscriptionDataById(id);

    if (!isAdmin && subscription?.user.toString() != userId) {
      const error = generateError("Subscription not found", 404);
      throw error;
    }

    return {
      id: subscription?._id.toString(),
      name: subscription?.name,
      price: subscription?.price,
      currency: subscription?.currency,
      frequency: subscription?.frequency ?? undefined,
      category: subscription?.category,
      status: subscription?.status,
      startDate: subscription?.startDate,
      renewalDate: subscription?.renewalDate ?? undefined,
      paymentMethod: subscription?.paymentMethod,
      user: subscription?.user.toString(),
    }
  } catch (error) {
    throw error
  }
}

export const deleteSubscriptionByIdService = async (id: string, userId: string, isAdmin: boolean) => {
  try {
    const subscription = await getSubscriptionDataById(id);
    if (!subscription) {
      throw generateError("Subscription not found", 404);
    }
    if (!isAdmin && subscription?.user.toString() != userId) {
      const error = generateError("Subscription not found", 404);
      throw error;
    }

    await subscription?.deleteOne()

    return;
  } catch (error) {
    throw error
  }
}

export const updateSubscriptionByIdService = async (id: string, userId: string, subscription: SubscriptionRequest, isAdmin: boolean) => {
  try {
    const subscriptionData = await getSubscriptionDataById(id);
    if (!subscriptionData) {
      throw generateError("Subscription not found", 404);
    }
    if (!isAdmin && subscriptionData?.user.toString() != userId) {
      const error = generateError("Subscription not found", 404);
      throw error;
    }

    if (subscription.name) {
      subscriptionData.name = subscription.name
    }
    if (subscription.price) {
      subscriptionData.price = subscription.price
    }
    if (subscription.currency) {
      subscriptionData.currency = subscription.currency
    }
    if (subscription.frequency) {
      subscriptionData.frequency = subscription.frequency
    }
    if (subscription.category) {
      subscriptionData.category = subscription.category
    }
    if (subscription.paymentMethod) {
      subscriptionData.paymentMethod = subscription.paymentMethod
    }
    if (subscription.status) {
      subscriptionData.status = subscription.status
    }
    if (subscription.startDate) {
      subscriptionData.startDate = subscription.startDate
    }
    if (subscription.renewalDate) {
      subscriptionData.renewalDate = subscription.renewalDate
    }

    return;
  } catch (error) {
    throw error
  }
}