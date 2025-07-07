import express from 'express';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import subscriptionRouter from './routes/subscription.route.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.route.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

const baseRouter = "/api/v1";

app.use(`${baseRouter}/auth`, authRouter);
app.use(`${baseRouter}/users`, userRouter);
app.use(`${baseRouter}/subscriptions`, subscriptionRouter);
app.use(`${baseRouter}/workflows`, workflowRouter);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send('Welcome to The Subscription Tracker API!');
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;