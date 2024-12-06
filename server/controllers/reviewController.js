import { postReview, getReviewByUserAndMovie, updateReviewByUserAndMovie, deleteReviewByUserAndMovie } from '../models/reviewModel.js';

export const addReview = async (req, res, next) => {
    try {
        const { movieId, rating, info } = req.body;
        const userId = req.user.id;

        if (!movieId || !rating) {
            return res.status(400).json({ message: 'Movie ID and rating are required' });
        }

        if (!['1', '2', '3', '4', '5'].includes(rating)) {
            return res.status(400).json({ message: 'Rating must be a string value between 1 and 5' });
        }

        // Check if the user already reviewed the movie
        const existingReview = await getReviewByUserAndMovie(userId, movieId);
        if (existingReview.rowCount > 0) {
            return res.status(409).json({ message: 'You have already reviewed this movie' });
        }

        const review = await postReview(userId, movieId, rating, info);

        return res.status(201).json({
            message: 'Review added successfully',
            review: review.rows[0],
        });
    } catch (err) {
        return next(err);
    }
};

export const updateReview = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const { rating, info } = req.body;

        if (!rating) {
            return res.status(400).json({ message: 'Rating is required for update' });
        }

        const userId = req.user.id;

        const updatedReview = await updateReviewByUserAndMovie(userId, movieId, rating, info);
        if (updatedReview.rowCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.status(200).json({
            message: 'Review updated successfully',
            review: updatedReview.rows[0],
        });
    } catch (err) {
        return next(err);
    }
};

export const deleteReview = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const userId = req.user.id;

        const deletedReview = await deleteReviewByUserAndMovie(userId, movieId);
        if (deletedReview.rowCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        return next(err);
    }
};
