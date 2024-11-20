import React from 'react';

export default function MovieCard({ movie }){

    return (
        <div className='movie-card'>
            <h3>{movie.title}</h3>
            <p>{movie.theater}</p>
            <p>{movie.showStart}</p>
            <p>{movie.lengthInMinutes} mins</p>
        </div>
    )
}