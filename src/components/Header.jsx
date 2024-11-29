import React from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext.jsx';
import LogoutButton from './LogoutButton.jsx';

export default function Header(){
    const { searchTerm, setSearchTerm } = useSearch();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <header style={{ display: 'flex', alignItems: 'center', padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
            <nav style={{ marginRight: '1rem' }}>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                    <li>
                        <Link to="/groups" style={{ color: '#fff', textDecoration: 'none' }}>
                            Groups
                        </Link>
                    </li>
                </ul>
            </nav>
            <div style={{ flex: 1 }}>
                <h1>Finnkino Movies</h1>
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ padding: '0.5rem', width: '200px' }}
                />
            </div>
            <LogoutButton/>
        </header>
    );
}