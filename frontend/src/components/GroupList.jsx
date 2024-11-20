import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGroups } from '../context/GroupContext';

export default function GroupList() {
    const { groups, addGroup } = useGroups();
    const [groupName, setGroupName] = useState("");
    const user = "currentUser";

    const handleCreateGroup = () => {
        if (groupName.trim()) {
            addGroup(groupName, user);
            setGroupName("");
        }
    };

    return (
        <>
            <h1>Groups</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <button onClick={handleCreateGroup}>Create Group</button>
            </div>
            <ul>
                {groups.map((group) => (
                    <li key={group.id}>
                        <Link to={`/groups/${group.id}`}>{group.name}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
};