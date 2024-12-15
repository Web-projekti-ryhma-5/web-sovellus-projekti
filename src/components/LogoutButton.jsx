import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './LogoutButton.css';

export default function LogoutButton() {
    const { logout, user } = useAuth();
    const { showNotification } = useNotification();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed');
            showNotification(err.response?.data?.message || 'An error occurred', 'error');
        }
    };

    if (!user) return (
        <div>
            <Link to="/login" className="login-button">
                Login
            </Link>
        </div>
    );

    return (
        <button onClick={handleLogout} className="logout-button">
            Logout
        </button>
    );
}
