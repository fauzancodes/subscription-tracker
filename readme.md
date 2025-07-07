# Subscription Tracker API

Many users today struggle to keep track of their digital subscriptions. From streaming services like Netflix to productivity tools and online platforms, it’s easy to forget when renewals are due—leading to unexpected charges and account deductions. This is a common issue that causes confusion, frustration, and unnecessary financial drain.

**Subscription Tracker API** is a RESTful API designed to solve that problem. It allows users to store and manage their subscription data, and automatically notifies them via email before the renewal date—specifically 7, 5, 2, and 1 day(s) in advance. With this system, users are reminded ahead of time and can take appropriate action, whether to renew or cancel—helping them stay in control of their finances and avoid surprise charges.

The API is built using [Express.js](https://expressjs.com/) with [TypeScript](https://www.typescriptlang.org/) for strong typing and enhanced developer experience. [MongoDB](https://www.mongodb.com/) is used as the primary database, managed via [Mongoose](https://mongoosejs.com/) as the ODM. Authentication and account security are handled using [JWT (JSON Web Tokens)](https://jwt.io/) and [bcrypt](https://github.com/dcodeIO/bcrypt.js) to ensure secure access. For sending reminder emails, it utilizes [Nodemailer](https://nodemailer.com/), while [Upstash](https://upstash.com/) take care of scheduled background jobs to trigger those reminders reliably. The API is protected by [Arcjet](https://arcjet.com/), which provides advanced endpoint security against XSS, SQL injection, brute-force attacks, bots, and other common web threats.

---

## Key Features

- **Subscription Management**  
  Add and manage multiple subscription accounts with details such as name, cost, billing cycle, and next renewal date.

- **Automated Email Reminders**  
  Receive timely email alerts 7, 5, 2, and 1 day(s) before a subscription renews.

- **Secure Authentication**  
  Protected endpoints with JWT and hashed passwords via bcrypt.

- **Real-Time Protection**  
  Built-in Arcjet middleware to guard against common web attacks and abusive traffic.

- **Serverless Workflow Integration**  
  Uses Upstash QStash and Workflows to trigger email reminders without maintaining a cron server.

---

Feel free to integrate this API into your own applications, or extend it for mobile/web-based subscription management tools.
