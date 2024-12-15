import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ message: '', type: '' });

    const showNotification = (message, type = 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification.message && <Notification message={notification.message} type={notification.type} />}
        </NotificationContext.Provider>
    );
};

const Notification = ({ message, type }) => {
    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    );
};
