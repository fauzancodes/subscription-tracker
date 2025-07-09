import Subscription from "../models/subscription.model"
import { SubscriptionRequest, SubscriptionResponse, SubscriptionsParams } from "../types/subscription.type";
import { escapeRegex } from "../utilities/common";

export const createSubscriptionData = async (subscription: SubscriptionRequest) => {
  try {
    const newSubscriptions = await Subscription.create(subscription);
  
    return newSubscriptions;
  } catch (error) {
    throw error;
  }
}

export const getSubscriptionsData = async (params: SubscriptionsParams = {}) => {
  const {
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
    offset,
    limit,
    order,
    sort,
  } = params;

  const filter: any = {};

  if (name) filter.name = name;
  if (currency) filter.currency = currency;
  if (frequency) filter.frequency = frequency;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  if (userId) filter.user = userId;

  if (startDateFrom || startDateTo) {
    filter.startDate = {};
    if (startDateFrom) filter.startDate.$gte = startDateFrom;
    if (startDateTo) filter.startDate.$lte = startDateTo;
  }

  if (renewalDateFrom || renewalDateTo) {
    filter.renewalDate = {};
    if (renewalDateFrom) filter.renewalDate.$gte = renewalDateFrom;
    if (renewalDateTo) filter.renewalDate.$lte = renewalDateTo;
  }

  if (search) {
    const safeSearch = escapeRegex(search);
    filter.$or = [
      { name: { $regex: `.*${safeSearch}.*`, $options: 'i' } },
    ];
  }

  let query = Subscription.find(filter);

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

export const getSubscriptionDataById = async (id: string) => {
  return await Subscription.findById(id);
};
