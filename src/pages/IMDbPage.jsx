import React from 'react';
import IMDbMovieList from '../components/IMDbMovieList';
import './IMDbPage.css';

export default function IMDbPage() {
    return (
        <>
            <h1>Popular Movies</h1>
            <IMDbMovieList />
        </>
    );
}
