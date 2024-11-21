import React, { useEffect, useState } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

import MovieCard from './MovieCard.jsx';
import { useSearch } from '../context/SearchContext.jsx';

export default function MovieList({ selectedDate }) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!selectedDate) return;

            try {
                setIsLoading(true);
                const response = await axios.get(`https://www.finnkino.fi/xml/Schedule/?dt=${selectedDate}`);
                const parser = new xml2js.Parser({ explicitArray: false });

                const result = await parser.parseStringPromise(response.data);

                let shows = result.Schedule.Shows.Show;

                if (!Array.isArray(shows)) {
                    shows = [shows];
                }

                const parsedMovies = shows.map((show) => ({
                    title: show.Title,
                    theater: show.Theatre,
                    showStart: new Date(show.dttmShowStart).toLocaleString(),
                    lengthInMinutes: show.LengthInMinutes,
                }));

                setMovies(parsedMovies);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [selectedDate]);

    if (isLoading) return <div>Loading movies...</div>;
    if (isError) return <div>Error fetching movies.</div>;

    return (
        <div className='movie-list'>
            {movies.map((movie, index) => (
                <div key={index} className="movie-card">
                    <h3>{movie.title}</h3>
                    <p>Theater: {movie.theater}</p>
                    <p>Show Start: {movie.showStart}</p>
                    <p>Length: {movie.lengthInMinutes} minutes</p>
                </div>
            ))}
        </div>
    );
}