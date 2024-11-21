import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/movie?title=${encodeURIComponent(movie.title)}&eventID=${movie.eventID}`);
    };

    return (
        <div 
            className="movie-card"
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            <img 
                src={movie.imageUrl} 
                alt={`Poster for ${movie.title}`} 
                className="movie-image"
            />
            <h3>{movie.title}</h3>
            <p>Theater: {movie.theater}</p>
            <p>Show Start: {movie.showStart}</p>
            <p>Length: {movie.lengthInMinutes} minutes</p>
        </div>
    );
}