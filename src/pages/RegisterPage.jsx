import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './RegisterPage.css';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register, user } = useAuth();
    const { showNotification } = useNotification();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            setError('');
            navigate('/login');
            showNotification('Registration successful', 'success');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        }
    };

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </>
    );
};

