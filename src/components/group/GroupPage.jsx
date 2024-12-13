import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import JoinRequests from './JoinRequests';
import MembersList from './MembersList';
import './GroupPage.css';


const GroupPage = () => {
    const { groupId } = useParams();
    const { token, user } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [movies, setMovies] = useState([]);
    const [showJoinRequests, setShowJoinRequests] = useState(false);
    const [showMembersList, setShowMembersList] = useState(false);

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
                navigate('/groups');
                showNotification(error.response?.data?.message || 'An error occurred', 'error');
            }
        };

        fetchGroupDetails();
        fetchMovies();
    }, [groupId, token, navigate, showNotification]);

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
        if (!showJoinRequests) setShowMembersList(false);
    };

    const toggleMembersList = () => {
        setShowMembersList((prev) => !prev);
        if (!showMembersList) setShowJoinRequests(false);
    };

    const leaveGroup = async (userId) => {
        try {
            await axios.delete(`http://localhost:3001/api/groups/${groupId}/members/${userId}`, {
                headers: { Authorization: token },
            });
            navigate('/groups');
            showNotification('Group left', 'success');
        } catch (error) {
            console.error('Error removing member:', error);
            showNotification(error.response?.data?.message || 'An error occurred', 'error');
        }
    };

    return (
        <>
            {group && (
                <>
                    <div className="group-toolbar">
                        { /* Leave group button is allowed for members only */
                        user.email !== group.email && (
                            <button onClick={() => leaveGroup(user.id)} className="toolbar-button delete-button">
                                Leave
                            </button>
                        )}
                        {/* These buttons are allowed for group owner only */
                        user.email === group.email && (
                            <>
                                <button onClick={handleDeleteGroup} className="toolbar-button delete-button">
                                    Delete Group
                                </button>
                                <button onClick={toggleJoinRequests} className="toolbar-button">
                                    {showJoinRequests ? 'Close Join Requests' : 'Show Join Requests'}
                                </button>
                                <button onClick={toggleMembersList} className="toolbar-button">
                                    {showMembersList ? 'Close Members' : 'Show Members'}
                                </button>
                            </>
                        )}
                    </div>
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
                    {showMembersList && (
                        <div className="members-list-menu">
                            <MembersList groupId={groupId} />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default GroupPage;
