import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './GroupPage.css';

const GroupPage = () => {
    const { groupId } = useParams();
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/groups/${groupId}`, {
                    headers: { Authorization: token },
                });
                setGroup(response.data.group);
            } catch (error) {
                console.error('Error fetching group details:', error);
            }
        };

        const fetchMovies = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/groups/${groupId}/movies`, {
                    headers: { Authorization: token },
                });
                setMovies(response.data.movies);
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchGroupDetails();
        fetchMovies();
    }, [groupId, token]);

    const handleDeleteGroup = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/groups/${groupId}`, {
                headers: { Authorization: token },
            });
            navigate('/');
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    return (
        <div className="group-page">
            {group && (
                <>
                    <h1>{group.title}</h1>
                    {user.email === group.email && (
                        <button onClick={handleDeleteGroup}>Delete Group</button>
                    )}
                    <h2>Movies</h2>
                    <ul>
                        {movies.map((movie) => (
                            <li key={movie.id}>{movie.title}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default GroupPage;
