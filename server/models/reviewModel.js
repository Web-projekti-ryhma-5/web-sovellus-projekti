import { pool } from '../db.js';

export const postReview = async (userId, movieId, rating, info) => {
    const query = `
        INSERT INTO reviews (user_id, movie_id, rating, info)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    return pool.query(query, [userId, movieId, rating, info]);
};

export const getReviewByUserAndMovie = async (userId, movieId) => {
    const query = `
        SELECT * FROM reviews
        WHERE user_id = $1 AND movie_id = $2;
    `;
    return pool.query(query, [userId, movieId]);
};

export const updateReviewByUserAndMovie = async (userId, movieId, rating, info) => {
    const query = `
        UPDATE reviews
        SET rating = $1, info = $2, updated = CURRENT_TIMESTAMP
        WHERE user_id = $3 AND movie_id = $4
        RETURNING *;
    `;
    return pool.query(query, [rating, info, userId, movieId]);
};

export const deleteReviewByUserAndMovie = async (userId, movieId) => {
    const query = `
        DELETE FROM reviews
        WHERE user_id = $1 AND movie_id = $2
        RETURNING *;
    `;
    return pool.query(query, [userId, movieId]);
};
