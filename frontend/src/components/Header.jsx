import React, { useState } from 'react';

export default function Header({ onSearch }){
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <header style={{ padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
            <h1>Finnkino Movies</h1>
            <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ padding: '0.5rem', width: '200px' }}
            />
        </header>
    );
}