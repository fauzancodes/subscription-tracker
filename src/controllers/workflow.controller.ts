import { createRequire } from "module";
const customRequire = createRequire(import.meta.url);
const { serve } = customRequire("@upstash/workflow/express");
import dayjs, { Dayjs } from "dayjs";
import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from "../utilities/send-email.js";
import { Context, SubscriptionType } from "../types/workflow.type.js";

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context: Context) => {
  const { subscriptionId } = context.requestPayload;
  const subscriptionData = await fethSubscription(context, subscriptionId);

  const user = (subscriptionData?.user && typeof subscriptionData.user === "object" && "name" in subscriptionData.user && "email" in subscriptionData.user)
    ? subscriptionData.user as { name: string; email: string }
    : undefined;

  const subscription: SubscriptionType = {
    id: subscriptionData?.id,
    user: {
      email: user?.email,
      name: user?.name,
    },
    status: subscriptionData?.status,
    renewalDate: dayjs(subscriptionData?.renewalDate),
    name: subscriptionData?.name,
    currency: subscriptionData?.currency,
    price: subscriptionData?.price,
    frequency: subscriptionData?.frequency,
    paymentMethod: subscriptionData?.paymentMethod,
  }

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `${daysBefore} days before renewal date`, reminderDate);
    }

    if (dayjs().isSame(reminderDate, "day")) {
      await triggerReminder(context, `${daysBefore} days before renewal date`, subscription);
    }
  }
});

const fethSubscription = async (context: Context, subscriptionId: string) => {
  return await context.run("get subscription", async () => {
    return await Subscription.findById(subscriptionId).populate("user", "name email");
  });
};

const sleepUntilReminder = async (context: Context, label: string, date: Dayjs) => {
  console.log(`Sleeping until ${label}, reminder at ${date}`);
  await context.sleepUntil(label, date);
};

const triggerReminder = async (context: Context, label:string, subscription: SubscriptionType) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription
    })
  });
};