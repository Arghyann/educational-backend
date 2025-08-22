import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';     
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import { connect } from 'mongoose';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';

 const app = express();

// Parse middleware should come first
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);
// Routes come after parsing middleware
app.use('/api/v1/users',userRouter)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.get('/', (req, res) => {
  res.send('Subscription tracker here');
});

// Error handlers come last
app.use(errorMiddleware);
app.use(errorHandler);

 app.listen(PORT, async ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectToDatabase();
 })

 export default app;