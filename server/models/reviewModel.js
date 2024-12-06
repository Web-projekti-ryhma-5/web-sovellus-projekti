import { pool } from '../db.js';

export const postReview = async (userId, movieId, rating, info) => {
    const query = `
        INSERT INTO reviews (user_id, movie_id, rating, info)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    return pool.query(query, [userId, movieId, rating, info]);
};
