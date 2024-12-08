import express from 'express';
import {getReviews, addReview, updateReview, deleteReview} from '../controllers/reviewController.js';
import {auth} from '../util/auth.js';

const reviewRouter = express.Router();

reviewRouter.get('/:title', getReviews);
reviewRouter.post('/new', auth, addReview);
reviewRouter.put('/:title', auth, updateReview);
reviewRouter.delete('/:title', auth, deleteReview);

export {reviewRouter};
