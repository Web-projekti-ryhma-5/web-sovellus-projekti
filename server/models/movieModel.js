import { pool } from '../db.js';

export const postMovie = async (title, finnkino_event) => {
    const query = `
        INSERT INTO movies (title, finnkino_event)
        VALUES ($1, $2)
        RETURNING *;
    `;
    return pool.query(query, [title, finnkino_event]);
};

export const getMovieByTitle = async (title) => {
    const query = `
        SELECT * FROM movies
        WHERE title = $1;
    `;
    return pool.query(query, [title]);
};