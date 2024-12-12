import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import './MembersList.css';

const MembersList = ({ groupId }) => {
    const { token } = useAuth();
    const { showNotification } = useNotification();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/groups/${groupId}/members`, {
                    headers: { Authorization: token },
                });
                setMembers(response.data.members);
            } catch (error) {
                console.error('Error fetching members:', error);
                showNotification(error.response?.data?.message || 'An error occurred', 'error');
            }
        };

        fetchMembers();
    }, [groupId, token, showNotification]);

    const removeMember = async (userId) => {
        try {
            await axios.delete(`http://localhost:3001/api/groups/${groupId}/members/${userId}`, {
                headers: { Authorization: token },
            });
            setMembers((prev) => prev.filter((member) => member.id !== userId));
            showNotification('Member removed successfully', 'success');
        } catch (error) {
            console.error('Error removing member:', error);
            showNotification(error.response?.data?.message || 'An error occurred', 'error');
        }
    };

    return (
        <div className="members-list">
            <h2>Members</h2>
            <ul>
                {members.map((member) => (
                    <li key={member.id} className="member-item">
                        <span>{member.email}</span>
                        <button onClick={() => removeMember(member.user_id)} className="remove-member-button">
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MembersList;
