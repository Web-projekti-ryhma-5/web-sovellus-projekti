import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './ProfilePage.css';

export default function ProfilePage() {
    const { token, user } = useAuth();
    const { showNotification } = useNotification();

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [favourites, setFavourites] = useState([]);
    const [newMovie, setNewMovie] = useState('');

    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                setIsLoading(true);

                const response = await fetch('http://localhost:3001/api/favourites/', {
                    headers: {
                        Authorization: token,
                    },
                });

                const data = await response.json();

                if (data.favourites) {
                    setFavourites(data.favourites);
                }
            } catch(error) {
                console.error(error)
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavourites();
    }, [token]);

    const addFavourite = async () => {
        if (!newMovie) {
            showNotification('Title is required', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/favourites/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ title: newMovie, finnkino_event: '' }),
            });

            const data = await response.json();

            if (data.favourite) {
                setFavourites([...favourites, { title: newMovie }]);
                setNewMovie('');
            }
        } catch(error) {
            console.error(error)
            showNotification(error.response?.data?.message || 'An error occurred', 'error');
        }
    };

    const deleteFavourite = async (title) => {
        try {
            const response = await fetch(`http://localhost:3001/api/favourites/${title}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            const data = await response.json();

            if (data.message === 'Movie removed from favourites successfully') {
                setFavourites(favourites.filter((movie) => movie.title !== title));
            }
        } catch(error) {
            console.error(error)
            showNotification(error.response?.data?.message || 'An error occurred', 'error');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading movie details.</div>;

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-details">
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="favourites-section">
                <h2>Favourite Movies</h2>
                <ul className="favourites-list">
                    {favourites.map((movie, index) => (
                        <li key={index} className="favourite-item">
                            {movie.title}
                            <button
                                className="delete-button"
                                onClick={() => deleteFavourite(movie.title)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="add-movie">
                    <input
                        type="text"
                        value={newMovie}
                        placeholder="Add new movie title"
                        onChange={(e) => setNewMovie(e.target.value)}
                    />
                    <button className="add-button" onClick={addFavourite}>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};