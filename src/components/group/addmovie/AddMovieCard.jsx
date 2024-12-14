import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';

export default function AddMovieCard({ groupId, movie }) {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { showNotification } = useNotification();

    const handleMovieAdd = async (movie) => {
        try {
            await axios.post(`http://localhost:3001/api/groups/${groupId}/movies`,
                {
                    title: movie.title,
                    finnkino_event: movie.eventID ? movie.eventID : ''
                },
                {
                    headers: { Authorization: token },
                }
            );
            showNotification('Movie added successfully!', 'success');
        } catch (error) {
            console.error('Error adding movie:', error);
            showNotification('Failed to add movie.', 'error');
        } finally {
            navigate(`/groups`);
        }
    };

    return (
        <div 
            className="movie-card"
            onClick={() => handleMovieAdd(movie)}
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