import React from 'react';

export default function MovieCard({ movie }){

    return (
        <div className="movie-card">
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
    )
}