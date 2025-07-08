import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import { EMAIL_USER } from "../config/env.js";
import transporter from "../config/nodemailer.js";
import { EmailReminderRequest, EmailTemplate } from "../types/email.js";

export const sendReminderEmail = async ({ to, type, subscription }: EmailReminderRequest) => {
  if (!to || !type) {
    throw new Error("Missing required parameters");
  }

  const template = emailTemplates.find((t) => t.label === type);

  if (!template) {
    throw new Error("Invalid email type");
  }

  const mailInfo: EmailTemplate = {
    userName: subscription?.user.name,
    subscriptionName: subscription?.name,
    renewalDate: dayjs(subscription?.renewalDate).format("MMM D, YYYY"),
    planName: subscription?.name,
    price: `${subscription?.currency} ${subscription?.price} ${subscription?.frequency}`,
    paymentMethod: subscription?.paymentMethod,
  }

  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOption = {
    from: EMAIL_USER,
    to: to,
    subject: subject,
    html: message,
  }

  transporter.sendMail(mailOption, (error, info) => {
    if (error) return console.log(error, "Error sending email");

    console.log("Email sent:", info.response);
  })
}