import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import xml2js from 'xml2js';
import './MoviePage.css'

export default function MoviePage() {
    const [searchParams] = useSearchParams();
    const title = searchParams.get('title');
    const eventID = searchParams.get('eventID');
    const [movieDetails, setMovieDetails] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const tmdbToken = import.meta.env.VITE_TOKEN;

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setIsLoading(true);

                const tmdbResponse = await axios.get(
                    `https://api.themoviedb.org/3/search/movie`,
                    {
                        params: {
                            query: title,
                            include_adult: false,
                            language: 'en-US',
                        },
                        headers: {
                            Authorization: `Bearer ${tmdbToken}`,
                            accept: 'application/json',
                        },
                    }
                );

                const movieData = tmdbResponse.data.results[0];
                if (!movieData) {
                    throw new Error(`No movie found for title "${title}"`);
                }

                if (eventID) {
                    const finnkinoResponse = await axios.get(
                        `https://www.finnkino.fi/xml/Schedule/?eventID=${eventID}`
                    );

                    const parser = new xml2js.Parser({ explicitArray: false });
                    const scheduleData = await parser.parseStringPromise(finnkinoResponse.data);
                    const shows = scheduleData.Schedule.Shows.Show;

                    setSchedules(Array.isArray(shows) ? shows : [shows]);
                }

                setMovieDetails({
                    title: movieData.title,
                    overview: movieData.overview,
                    rating: movieData.vote_average,
                    image: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                });
            } catch (error) {
                console.error("Error fetching movie details or schedules:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieData();
    }, [title, eventID]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading movie details.</div>;

    return (
        <div className="movie-page">
            <div className="movie-details">
                <img 
                    src={movieDetails.image} 
                    alt={`Poster for ${movieDetails.title}`} 
                    className="movie-poster"
                />
                <h1>{movieDetails.title}</h1>
                <p><strong>Rating:</strong> {movieDetails.rating}/10</p>
                <p>{movieDetails.overview}</p>
            </div>
            <div className="schedule-details">
                <h2>Showtimes</h2>
                {schedules.map((schedule, index) => (
                    <div key={index} className="schedule-item">
                        <p><strong>Theater:</strong> {schedule.Theatre}</p>
                        <p><strong>Show Start:</strong> {new Date(schedule.dttmShowStart).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

