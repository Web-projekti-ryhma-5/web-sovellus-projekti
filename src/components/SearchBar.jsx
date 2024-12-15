import React from 'react';
import { useSearch } from '../context/SearchContext.jsx';
import './SearchBar.css';


export default function SearchBar() {
    const { searchTerm, setSearchTerm } = useSearch();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="search-container">
            <input
                className="form-control search-input"
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>
    );
}