import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {userRouter} from './routes/userRouter.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const root = process.env.ROOT;
app.use(root + '/auth', userRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 