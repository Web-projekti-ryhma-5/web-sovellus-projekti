import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                email,
                password,
            });
            const { token } = response.data;

            setToken(token);
            setUser({ email });
            localStorage.setItem('authToken', token);

            console.log('Login successful');
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            await axios.post('http://localhost:3001/api/auth/register', {
                email,
                password,
            });
            console.log('Registration successful');
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            await axios.post('http://localhost:3001/api/auth/logout', {}, {
                headers: { Authorization: authToken },
            });

            setToken(null);
            setUser(null);
            localStorage.removeItem('authToken');

            console.log('Logout successful');
        } catch (error) {
            console.error('Logout failed:', error.response?.data?.message || error.message);
            throw error;
        }
    };

    const value = { user, token, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
