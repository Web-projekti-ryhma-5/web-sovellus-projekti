import React from 'react';
import IMDbMovieList from '../components/IMDbMovieList'; // Import the new IMDb-specific component
import './HomePage.css'; // Reuse existing styles

export default function IMDbPage() {
    return (
        <div>
            <h1>Popular Movies</h1>
            <IMDbMovieList />
        </div>
    );
}
