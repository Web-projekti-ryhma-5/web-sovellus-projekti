import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import {userRouter} from './routes/userRouter.js';
import {reviewRouter} from './routes/reviewRouter.js';
import groupRouter from './routes/groupRouter.js';
// use assert keyword instead if with keyword does not work
import swaggerDocument from './swagger.json' with { type: "json" };

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const root = process.env.ROOT;
app.use(root + '/auth', userRouter);
app.use(root + '/groups', groupRouter);
app.use(root + '/reviews', reviewRouter);

// Swagger docs
app.use(root + '/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log(err)
  res.status(statusCode).json({ message: err.message });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 