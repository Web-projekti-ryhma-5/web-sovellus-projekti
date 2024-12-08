import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // refresh user and token between page reloads
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            try {
                const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
                const isExpired = decodedToken.exp * 1000 < Date.now();
                if (isExpired) {
                    localStorage.removeItem('authToken');
                } else {
                    setToken(storedToken);
                    setUser({ email: decodedToken.email });
                }
            } catch (error) {
                localStorage.removeItem('authToken');
            }
        }
    }, []);

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

        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            await axios.post('http://localhost:3001/api/auth/register', {
                email,
                password,
            });
        } catch (error) {
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

        } catch (error) {
            throw error;
        }
    };

    const value = { user, token, login, register, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
