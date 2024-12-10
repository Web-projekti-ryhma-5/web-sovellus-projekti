import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import './MovieForm.css';

const MovieForm = ({ groupId }) => {
    const [movieTitle, setMovieTitle] = useState('');
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                `http://localhost:3001/api/groups/${groupId}/movies`,
                { title: movieTitle },
                { headers: { Authorization: token } }
            );
            setMovieTitle('');
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    };

    return (
        <div className="movie-form">
            <h2>Add a Movie</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="movieTitle">Movie Title:</label>
                <input
                    id="movieTitle"
                    type="text"
                    value={movieTitle}
                    onChange={(e) => setMovieTitle(e.target.value)}
                    required
                />
                <button type="submit">Add Movie</button>
            </form>
        </div>
    );
};

export default MovieForm;
