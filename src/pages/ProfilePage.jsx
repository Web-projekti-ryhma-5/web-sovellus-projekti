import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

import AddFavouriteMovieList from '../components/profile/AddFavouriteMovieList';
import './ProfilePage.css';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { token, user, logout } = useAuth();
    const { showNotification } = useNotification();

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [favourites, setFavourites] = useState([]);
    const [showAddMovie, setShowAddMovie] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth/invalidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            if (!response.ok) throw new Error('Failed to delete account');

            showNotification('Account deleted successfully', 'success');
            logout();
            navigate('/');
        } catch (error) {
            console.error(error);
            showNotification(error.message || 'Failed to delete account', 'error');
        }
    };

    const handleClick = (title) => {
        const queryParams = new URLSearchParams();
        queryParams.append('title', title);
        navigate(`/movie?${queryParams.toString()}`);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading movie details.</div>;

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="profile-details">
                <p><strong>Email:</strong> {user.email}</p>
                <button className="delete-account-button" onClick={() => setShowDeleteDialog(true)}>
                    Delete Account
                </button>
            </div>
            <div className="favourites-section">
                <h2>Favourite Movies</h2>
                <ul className="favourites-list">
                    {favourites.map((movie, index) => (
                        <li
                            key={index}
                            className="favourite-item"
                        >
                            <div className="favourite-item-box" onClick={() => handleClick(movie.title)}>
                                <p>{movie.title}</p>
                            </div>
                            <button
                                className="delete-button"
                                onClick={() => deleteFavourite(movie.title)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
                <button className='add-button' onClick={() => setShowAddMovie(true)}>Add Movie</button>
            </div>
            {showAddMovie && (
                <div className="dialog-modal">
                    <div className="dialog-modal-content">
                        <div className="dialog-header">
                            <h2>Add Movie</h2>
                            <button className="dialog-close-button" onClick={() => setShowAddMovie(false)}>
                                ×
                            </button>
                        </div>
                        <AddFavouriteMovieList />
                    </div>
                </div>
            )}
            {showDeleteDialog && (
                <div className="dialog-modal" role="dialog" aria-labelledby="delete-dialog-title">
                    <div className="confirmation-dialog-content">
                        <div className="dialog-header">
                            <h2 id="delete-dialog-title">Confirm Account Deletion</h2>
                        </div>
                        <div className="dialog-body">
                            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                            <button className="confirm-button" onClick={handleDeleteAccount}>Confirm</button>
                            <button className="cancel-button" onClick={() => setShowDeleteDialog(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};