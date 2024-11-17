import React, { createContext, useContext, useState } from 'react';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
    const [groups, setGroups] = useState([]);

    const addGroup = (name, owner) => {
        const newGroup = {
            id: Date.now(),
            name,
            owner,
            members: [owner],
        };
        setGroups([...groups, newGroup]);
    };

    const deleteGroup = (id, owner) => {
        setGroups(groups.filter((group) => group.id !== id || group.owner !== owner));
    };

    const joinGroup = (id, user) => {
        setGroups(groups.map((group) =>
            group.id === id ? { ...group, members: [...group.members, user] } : group
        ));
    };

    return (
        <GroupContext.Provider value={{ groups, addGroup, deleteGroup, joinGroup }}>
            {children}
        </GroupContext.Provider>
    );
};

export const useGroups = () => useContext(GroupContext);