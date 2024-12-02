import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroups } from '../context/GroupContext';

export default function GroupPage () {
    const { id } = useParams();
    const { groups, deleteGroup, joinGroup } = useGroups();
    const navigate = useNavigate();
    const user = "currentUser";

    const group = groups.find((group) => group.id === parseInt(id));

    if (!group) {
        return <div>Group not found</div>;
    }

    const isMember = group.members.includes(user);
    const isOwner = group.owner === user;

    const handleDeleteGroup = () => {
        deleteGroup(group.id, user);
        navigate("/");
    };

    const handleJoinGroup = () => {
        if (!isMember) {
            joinGroup(group.id, user);
        }
    };

    return (
        <>
            <h1>{group.name}</h1>
            <p>Owner: {group.owner}</p>
            {isMember ? (
                <div>
                    <p>Welcome to the group!</p>
                    <p>Additional content for members only.</p>
                </div>
            ) : (
                <div>
                    <p>You are not a member of this group.</p>
                    <button onClick={handleJoinGroup}>Join Group</button>
                </div>
            )}
            {isOwner && <button onClick={handleDeleteGroup}>Delete Group</button>}
        </>
    );
};
