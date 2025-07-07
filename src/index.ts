import express from 'express';
import { PORT } from './config/env.ts';
import authRouter from './routes/auth.route.ts';
import userRouter from './routes/user.route.ts';
import subscriptionRouter from './routes/subscription.route.ts';
import connectToDatabase from './database/mongodb.ts';
import errorMiddleware from './middlewares/error.middleware.ts';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.ts';
import workflowRouter from './routes/workflow.route.ts';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

const baseRouter = "/api/v1";

app.use(express.static(path.join(__dirname, '../public')));

app.use(`${baseRouter}/auth`, authRouter);
app.use(`${baseRouter}/users`, userRouter);
app.use(`${baseRouter}/subscriptions`, subscriptionRouter);
app.use(`${baseRouter}/workflows`, workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;