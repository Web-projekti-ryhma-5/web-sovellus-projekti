import { postReview } from '../models/reviewModel.js';

export const addReview = async (req, res, next) => {
    try {
        const { movieId, rating, info } = req.body;

        if (!movieId || !rating) {
            return res.status(400).json({ message: 'Movie ID and rating are required' });
        }

        if (!['1', '2', '3', '4', '5'].includes(rating)) {
            return res.status(400).json({ message: 'Rating must be a string value between 1 and 5' });
        }

        const userId = req.user.id;
        const review = await postReview(userId, movieId, rating, info);

        return res.status(201).json({
            message: 'Review added successfully',
            review: review.rows[0],
        });
    } catch (err) {
        return next(err);
    }
};
