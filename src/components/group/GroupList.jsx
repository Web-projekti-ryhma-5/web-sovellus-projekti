import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import './GroupList.css';

const GroupList = () => {
    const { token } = useAuth();
    const { showNotification } = useNotification();

    const [groups, setGroups] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/groups');
                setGroups(response.data.groups);
            } catch (error) {
                console.error('Error fetching groups:', error);
                showNotification(error.response?.data?.message || 'An error occurred', 'error');
            }
        };

        fetchGroups();
    }, []);

    const handleJoinGroup = async (groupId) => {
        try {
            await axios.post(
                `http://localhost:3001/api/groups/${groupId}/join-requests`,
                {},
                {
                    headers: { Authorization: token },
                }
            );
            setMessage('Request sent');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error sending join request:', error);
            showNotification(error.response?.data?.message || 'An error occurred', 'error');
        }
    };

    const handleRowClick = (groupId) => {
        try {
            navigate(`/groups/${groupId}`);
        } catch (error) {
            showNotification(error.response?.data?.message || 'An error occurred', 'error');
        }
    };

    return (
        <div className="group-list">
            <h1>Groups</h1>
            <Link to="/groups/new" className="create-group-link">
                Create New Group
            </Link>
            {message && <div className="success-message">{message}</div>}
            <div className="group-list-table">
                {groups.map((group) => (
                    <div
                        key={group.id}
                        className="group-row"
                        onClick={() => handleRowClick(group.id)}
                    >
                        <div className="group-title">{group.title}</div>
                        <div className="group-created">
                            Created: {new Date(group.created).toLocaleDateString()}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleJoinGroup(group.id);
                            }}
                            className="join-button"
                        >
                            Join
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// const GroupList = () => {
//     const { token } = useAuth();
//     const [groups, setGroups] = useState([]);
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         const fetchGroups = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3001/api/groups');
//                 setGroups(response.data.groups);
//             } catch (error) {
//                 console.error('Error fetching groups:', error);
//             }
//         };

//         fetchGroups();
//     }, []);

//     const handleJoinGroup = async (groupId) => {
//         try {
//             await axios.post(
//                 `http://localhost:3001/api/groups/${groupId}/join-requests`,
//                 {},
//                 {
//                     headers: { Authorization: token },
//                 }
//             );
//             setMessage('Request sent');
//             setTimeout(() => setMessage(''), 3000);
//         } catch (error) {
//             console.error('Error sending join request:', error);
//         }
//     };

//     return (
//         <div className="group-list">
//             <h1>Groups</h1>
//             <Link to="/groups/new" className="create-group-link">
//                 Create New Group
//             </Link>
//             {message && <div className="success-message">{message}</div>}
//             <div className="group-list-table">
//                 {groups.map((group) => (
//                     <div key={group.id} className="group-row">
//                         <div className="group-title">
//                             <Link to={`/groups/${group.id}`}>{group.title}</Link>
//                         </div>
//                         <div className="group-created">
//                             Created: {new Date(group.created).toLocaleDateString()}
//                         </div>
//                         <button
//                             onClick={() => handleJoinGroup(group.id)}
//                             className="join-button"
//                         >
//                             Join
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

export default GroupList;