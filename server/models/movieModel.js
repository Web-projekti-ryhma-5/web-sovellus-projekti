import { pool } from '../db.js';

export const postMovie = async (movie_name) => {
    const query = `
        INSERT INTO movies (movie_name)
        VALUES ($1)
        RETURNING *;
    `;
    return pool.query(query, [movie_name]);
};

export const getMovieByTitle = async (title) => {
    const query = `
        SELECT * FROM movies
        WHERE movie_name = $1;
    `;
    return pool.query(query, [title]);
};