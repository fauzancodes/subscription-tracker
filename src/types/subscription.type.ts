export interface SubscriptionRequest {
  name?: string;
  price?: number;
  currency?: "USD" | "EUR" | "GBP" | "IDR";
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  category?: "sports" | "news" | "entertainment" | "lifestyle" | "technology" | "finance" | "politics" | "other";
  status?: "active" | "cancelled" | "expired";
  startDate?: Date;
  renewalDate?: Date;
  paymentMethod?: string;
  user?: string;
}

export interface SubscriptionResponse {
  id?: string;
  name?: string;
  price?: number;
  currency?: "USD" | "EUR" | "GBP" | "IDR";
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  category?: "sports" | "news" | "entertainment" | "lifestyle" | "technology" | "finance" | "politics" | "other";
  status?: "active" | "cancelled" | "expired";
  startDate?: Date;
  renewalDate?: Date;
  paymentMethod?: string;
  user?: string;
}

export interface SubscriptionsParams {
  search?: string;
  name?: string;
  currency?: string;
  frequency?: string;
  category?: string;
  status?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  renewalDateFrom?: Date;
  renewalDateTo?: Date;
  paymentMethod?: string;
  userId?: string;
  offset?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  sort?: keyof SubscriptionResponse;
}