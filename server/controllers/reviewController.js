import { getAllReviewsByMovieId, postReview, getReviewByUserAndMovie, updateReviewByUserAndMovie, deleteReviewByUserAndMovie } from '../models/reviewModel.js';
import { postMovie, getMovieByTitle } from '../models/movieModel.js';

export const getReviews = async (req, res, next) => {
    try {
        const { title } = req.params;

        const movies = await getMovieByTitle(title);

        if (!movies.rows[0]) {
            return res.status(201).json({ reviews: [] });
        }

        const reviews = await getAllReviewsByMovieId(movies.rows[0].id);

        return res.status(201).json({reviews: reviews.rows});
    } catch (err) {
        return next(err);
    }
};

export const addReview = async (req, res, next) => {
    try {
        const { title, rating, info } = req.body;
        const userId = req.user.id;
        const email = req.user.email;

        if (!title || !rating) {
            return res.status(400).json({ message: 'Movie title and rating are required' });
        }

        if (!['1', '2', '3', '4', '5'].includes(rating)) {
            return res.status(400).json({ message: 'Rating must be a string value between 1 and 5' });
        }

        let movie = await getMovieByTitle(title);

        if (!movie.rows[0]) {
            movie = await postMovie(title);
        }

        // Check if the user already reviewed the movie
        const existingReview = await getReviewByUserAndMovie(userId, movie.rows[0].id);
        if (existingReview.rowCount > 0) {
            return res.status(409).json({ message: 'You have already reviewed this movie' });
        }

        const review = await postReview(userId, email, movie.rows[0].id, rating, info);

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
        const { title } = req.params;
        const { rating, info } = req.body;
        const userId = req.user.id;

        if (!rating) {
            return res.status(400).json({ message: 'Rating is required for update' });
        }

        let movie = await getMovieByTitle(title);

        const updatedReview = await updateReviewByUserAndMovie(userId, movie.rows[0]?.id, rating, info);
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
        const { title } = req.params;
        const userId = req.user.id;

        let movie = await getMovieByTitle(title);

        const deletedReview = await deleteReviewByUserAndMovie(userId, movie.rows[0].id);
        if (deletedReview.rowCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        return next(err);
    }
};