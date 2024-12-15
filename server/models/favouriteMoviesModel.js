import { pool } from '../db.js';

export const addFavouriteMovie = async (userId, movieId) => {
    const query = `
        INSERT INTO favourite_movies (user_id, movie_id)
        VALUES ($1, $2)
        RETURNING *;
    `;
    return pool.query(query, [userId, movieId]);
};

export const removeFavouriteMovie = async (userId, movieId) => {
    const query = `
        DELETE FROM favourite_movies
        WHERE user_id = $1 AND movie_id = $2
        RETURNING *;
    `;
    return pool.query(query, [userId, movieId]);
};

export const getFavouriteMoviesByUserId = async (userId) => {
    const query = `
        SELECT fm.movie_id, m.title, m.finnkino_event
        FROM favourite_movies fm
        JOIN movies m ON fm.movie_id = m.id
        WHERE fm.user_id = $1;
    `;
    return pool.query(query, [userId]);
};