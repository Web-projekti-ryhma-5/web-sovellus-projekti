import React, { useState } from 'react';
import AddMovieList from './AddMovieList.jsx';
import AddTMDbMovieList from './AddTMDbMovieList.jsx';
import './AddMovieMenu.css';

export default function AddMovieMenu({ groupId }) {
    const [fetchMode, setFetchMode] = useState('movies');

    return (
        <>
            <div className="radio-buttons-container">
                <label className="radio-label">
                    <input
                        type="radio"
                        value="movies"
                        checked={fetchMode === 'movies'}
                        onChange={() => setFetchMode('movies')}
                    />
                    Movies
                </label>
                <label className="radio-label">
                    <input
                        type="radio"
                        value="moviesWithSchedules"
                        checked={fetchMode === 'moviesWithSchedules'}
                        onChange={() => setFetchMode('moviesWithSchedules')}
                    />
                    Movies with Schedules
                </label>
            </div>
            <div>
                {fetchMode === 'movies' && <AddTMDbMovieList groupId={groupId} />}
                {fetchMode === 'moviesWithSchedules' && <AddMovieList groupId={groupId} />}
            </div>
        </>
    );
}
