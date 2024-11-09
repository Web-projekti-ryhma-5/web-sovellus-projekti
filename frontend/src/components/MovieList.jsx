import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard.jsx';
import xml2js from 'xml2js';

export default function MovieList({ searchTerm }){
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('https://www.finnkino.fi/xml/Schedule/');
                const parser = new xml2js.Parser({ explicitArray: false });

                const result = await parser.parseStringPromise(response.data);

                const shows = result.Schedule.Shows.Show;

                if (!Array.isArray(shows)) {
                    shows = [shows];
                }

                const parsedMovies = shows.map((show) => ({
                    title: show.Title,
                    theater: show.Theatre,
                    showStart: show.dttmShowStart,
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
    }, []);

    const filteredMovies = movies?.filter((movie) =>
        movie.Title && movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return (<div>Loading ...</div>);
    if (isError) return (<div>Error</div>);

    return (
        <div className='movie-list'>
            {movies?.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
            ))}
        </div>
    );
}