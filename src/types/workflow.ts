import { Dayjs } from "dayjs";
import Subscription from "../models/subscription.model.ts";

export interface SendReminderEmailParams {
  to: string;
  type: string;
  subscription: typeof Subscription;
}

export interface SubscriptionUser {
  name?: string;
  email?: string;
}

export interface SubscriptionType {
  id: string;
  user: SubscriptionUser;
  status?: string;
  renewalDate?: Dayjs;
  name?: string;
  currency?: string;
  price?: number;
  frequency?: "daily" | "weekly" | "monthly" | "yearly" | null;
  paymentMethod?: string;
}

export interface Context {
  requestPayload: {
    subscriptionId: string;
  };
  run: <T>(label: string, fn: () => Promise<T>) => Promise<T>;
  sleepUntil: (label: string, date: Dayjs) => Promise<void>;
}