import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        const queryParams = new URLSearchParams();
        queryParams.append('title', movie.title);
        if (movie.eventID) {
            queryParams.append('eventID', movie.eventID);
        }

        navigate(`/movie?${queryParams.toString()}`);
    };

    return (
        <div 
            className="movie-card"
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            {movie.imageUrl && <img 
                src={movie.imageUrl} 
                alt={`Poster for ${movie.title}`} 
                className="movie-image"
            />}
            <h3>{movie.title}</h3>
            { movie.theater && <p>Theater: {movie.theater}</p> }
            { movie.showStart && <p>Show Start: {movie.showStart}</p> }
            { movie.lengthInMinutes && <p>Length: {movie.lengthInMinutes} minutes</p> }

            { movie.rating && <p>Rating: {movie.rating}</p> }
            { movie.releaseDate && <p>Released: {movie.releaseDate}</p> }
        </div>
    );
}