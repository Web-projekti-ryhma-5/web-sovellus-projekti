import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton() {
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout failed');
        }
    };

    if (!user) return (
        <div>
            <Link
                to="/login"
                style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#444',
                    color: '#fff',
                    textDecoration: 'none',
                    border: 'none',
                }}
            >
                Login
            </Link>
        </div>
    );

    return (
        <button
            onClick={handleLogout}
            style={{
                padding: '0.5rem 1rem',
                maxWidth: '6em',
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
            }}
        >
            Logout
        </button>
    );
}
