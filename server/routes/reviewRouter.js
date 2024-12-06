import express from 'express';
import {addReview, updateReview, deleteReview} from '../controllers/reviewController.js';
import {auth} from '../util/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/new', auth, addReview);
reviewRouter.put('/:movieId', auth, updateReview);
reviewRouter.delete('/:movieId', auth, deleteReview);

export {reviewRouter};
