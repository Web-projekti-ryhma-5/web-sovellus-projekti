import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './JoinRequests.css';

const JoinRequests = ({ groupId }) => {
    const { token } = useAuth();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/groups/${groupId}/join-requests`, {
                    headers: { Authorization: token },
                });
                setRequests(response.data.requests);
            } catch (error) {
                console.error('Error fetching join requests:', error);
            }
        };

        fetchRequests();
    }, [groupId, token]);

    const handleRequestUpdate = async (requestId, status) => {
        try {
            await axios.put(
                `http://localhost:3001/api/join-requests/${requestId}`,
                { status },
                { headers: { Authorization: token } }
            );
            setRequests((prev) =>
                prev.filter((request) => request.id !== requestId)
            );
        } catch (error) {
            console.error('Error updating join request:', error);
        }
    };

    return (
        <div className="join-requests">
            <h2>Join Requests</h2>
            <ul>
                {requests.map((request) => (
                    <li key={request.id}>
                        <span>User ID: {request.user_id}</span>
                        <button onClick={() => handleRequestUpdate(request.id, 'approved')}>Approve</button>
                        <button onClick={() => handleRequestUpdate(request.id, 'declined')}>Decline</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JoinRequests;
