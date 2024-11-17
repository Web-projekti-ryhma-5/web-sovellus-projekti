import React, { useEffect, useState } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

import MovieCard from './MovieCard.jsx';
import { useSearch } from '../context/SearchContext.jsx';

export default function MovieList(){
    
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const { searchTerm } = useSearch();

    const filteredMovies = movies?.filter((movie) =>
        movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.theater && movie.theater.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.lengthInMinutes && movie.lengthInMinutes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('https://www.finnkino.fi/xml/Schedule/');
                const parser = new xml2js.Parser({ explicitArray: false });

                const result = await parser.parseStringPromise(response.data);

                let shows = result.Schedule.Shows.Show;

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

    if (isLoading) return (<div>Loading ...</div>);
    if (isError) return (<div>Error</div>);

    return (
        <div className='movie-list'>
            {filteredMovies?.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
            ))}
        </div>
    );
}