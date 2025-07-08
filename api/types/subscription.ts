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
}