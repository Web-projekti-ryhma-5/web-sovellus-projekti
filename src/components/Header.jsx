import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearch } from '../context/SearchContext.jsx';
import LogoutButton from './LogoutButton.jsx';
import './Header.css';

export default function Header() {
    const { searchTerm, setSearchTerm } = useSearch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>
            <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/imdb">TMDB Movies</Link>
                    </li>
                    <li>
                        <Link to="/groups">Groups</Link>
                    </li>
                    <li>
                        <Link to="/reviews">Reviews</Link>
                    </li>
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                </ul>
            </nav>
            {/* <div className="search-container">
                <h1>Finnkino Movies</h1>
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div> */}
            <LogoutButton />
        </header>
    );
}
