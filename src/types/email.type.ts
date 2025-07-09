import { SubscriptionType } from "./workflow.type.js";

export interface EmailTemplate {
  userName?: string,
  subscriptionName?: string,
  renewalDate?: string,
  planName?: string,
  price?: string,
  paymentMethod?: string,
  daysLeft?: number,
}

export interface EmailReminderRequest {
  to?: string;
  type?: string;
  subscription?: SubscriptionType
}