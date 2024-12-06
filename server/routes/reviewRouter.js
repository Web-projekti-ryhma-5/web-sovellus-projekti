import express from 'express';
import {addReview} from '../controllers/reviewController.js';
import {auth} from '../util/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/new', auth, addReview);

export {reviewRouter};
