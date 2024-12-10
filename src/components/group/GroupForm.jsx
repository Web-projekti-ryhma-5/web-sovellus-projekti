import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './GroupForm.css';

const GroupForm = () => {
    const [groupName, setGroupName] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                'http://localhost:3001/api/groups',
                { title: groupName },
                { headers: { Authorization: token } }
            );
            navigate('/');
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <div className="group-form">
            <h1>Create a New Group</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="groupName">Group Name:</label>
                <input
                    id="groupName"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    required
                />
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
};

export default GroupForm;
