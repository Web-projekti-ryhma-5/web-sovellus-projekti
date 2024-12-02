import React, { createContext, useState, useContext } from 'react';

// Create Context
const SearchContext = createContext();

// Create a Provider component
export const SearchProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
            {children}
        </SearchContext.Provider>
    );
};

// Custom hook for easy access
export const useSearch = () => useContext(SearchContext);
