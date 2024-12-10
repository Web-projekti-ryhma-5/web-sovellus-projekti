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
            { movie.theater && <p>Theater: {movie.theater}</p> }
            { movie.showStart && <p>Show Start: {movie.showStart}</p> }
            { movie.lengthInMinutes && <p>Length: {movie.lengthInMinutes} minutes</p> }

            { movie.rating && <p>Rating: {movie.rating}</p> }
            { movie.releaseDate && <p>Released: {movie.releaseDate}</p> }
        </div>
    );
}