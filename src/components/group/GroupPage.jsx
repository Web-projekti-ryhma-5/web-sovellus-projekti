import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import JoinRequests from './JoinRequests';
import './GroupPage.css';

const GroupPage = () => {
    const { groupId } = useParams();
    const { token, user } = useAuth();
    const { showNotification } = useNotification();

    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [movies, setMovies] = useState([]);
    const [showJoinRequests, setShowJoinRequests] = useState(false);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/groups/${groupId}`, {
                    headers: { Authorization: token },
                });
                setGroup(response.data.group);
            } catch (error) {
                navigate('/groups');
                showNotification(error.response?.data?.message || 'An error occurred', 'error');
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
                showNotification(error.response?.data?.message || 'An error occurred', 'error');
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
            showNotification(error.response?.data?.message || 'An error occurred', 'error');
        }
    };

    const toggleJoinRequests = () => {
        setShowJoinRequests((prev) => !prev);
    };

    return (
        <>
            {group && (
                <>
                    {user.email === group.email && (
                        <div className="group-toolbar">
                            <button onClick={handleDeleteGroup} className="toolbar-button delete-button">
                                Delete Group
                            </button>
                            <button onClick={toggleJoinRequests} className="toolbar-button">
                                {showJoinRequests ? 'Close Join Requests' : 'Show Join Requests'}
                            </button>
                        </div>
                    )}
                    <h1>{group.title}</h1>
                    <h2>Movies</h2>
                    <ul>
                        {movies.map((movie) => (
                            <li key={movie.id}>{movie.title}</li>
                        ))}
                    </ul>

                    {showJoinRequests && (
                        <div className="join-requests-menu">
                            <JoinRequests groupId={groupId} />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default GroupPage;
