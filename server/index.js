import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {userRouter} from './routes/userRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import groupRouter from './routes/groupRouter.js';
import favouriteMoviesRouter from './routes/favouriteMoviesRouter.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const root = process.env.ROOT;
app.use(root + '/auth', userRouter);
app.use(root + '/favourites', favouriteMoviesRouter);
app.use(root + '/groups', groupRouter);
app.use(root + '/reviews', reviewRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log(err)
  res.status(statusCode).json({ message: err.message });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 