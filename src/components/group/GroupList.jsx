import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './GroupList.css';

const GroupList = () => {
    const { token } = useAuth();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/groups');
                setGroups(response.data.groups);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, []);

    return (
        <div className="group-list">
            <h1>Groups</h1>
            <Link to="/groups/new" className="create-group-link">Create New Group</Link>
            <ul>
                {groups.map((group) => (
                    <li key={group.id}>
                        <Link to={`/groups/${group.id}`}>{group.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupList;