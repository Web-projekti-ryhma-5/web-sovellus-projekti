import React, { useEffect, useState } from 'react';
import axios from 'axios';

import MovieCard from './MovieCard.jsx'; // Reuse existing MovieCard component
import { useSearch } from '../context/SearchContext.jsx'; // Reuse search context

export default function IMDbMovieList() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { searchTerm } = useSearch();

    const filteredMovies = movies?.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsLoading(true);

                const API_KEY = 'API_KEY_HERE'; // Replace with your TMDb API key
                const BASE_URL = 'https://api.themoviedb.org/3';

                const response = await axios.get(`${BASE_URL}/movie/popular`, {
                    params: {
                        api_key: API_KEY,
                        language: 'en-US',
                        page: currentPage,
                    },
                });

                const fetchedMovies = response.data.results.map((movie) => ({
                    title: movie.title,
                    overview: movie.overview,
                    releaseDate: movie.release_date,
                    imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }));

                setMovies(fetchedMovies);
            } catch (error) {
                console.error('Error fetching IMDb movies:', error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [currentPage]);

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    if (isLoading) return <div>Loading movies...</div>;
    if (isError) return <div>Error fetching IMDb movies.</div>;

    return (
        <>
            <div className="schedule-dates-navigation">
                <button 
                    onClick={handlePrevPage} 
                    disabled={currentPage === 1} 
                    className="nav-button"
                >
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button 
                    onClick={handleNextPage} 
                    className="nav-button"
                >
                    Next
                </button>
            </div>
            <div className="movie-list">
                {filteredMovies?.map((movie, index) => (
                    <MovieCard key={index} movie={movie} />
                ))}
            </div>
        </>
    );
}
