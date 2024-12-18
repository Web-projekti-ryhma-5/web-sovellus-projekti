import React, { useEffect, useState } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

import AddMovieCard from './AddMovieCard.jsx';
import SearchBar from '../../SearchBar.jsx';
import { useSearch } from '../../../context/SearchContext.jsx';
import { useNotification } from '../../../context/NotificationContext';

export default function AddMovieList({ groupId }) {
    const { showNotification } = useNotification();
    const { searchTerm } = useSearch();

    const [scheduleDates, setScheduleDates] = useState([]);
    const [visibleDates, setVisibleDates] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [movies, setMovies] = useState([]);
    const [isLoadingDates, setIsLoadingDates] = useState(false);
    const [isErrorDates, setIsErrorDates] = useState(false);
    const [isLoadingMovies, setIsLoadingMovies] = useState(false);
    const [isErrorMovies, setIsErrorMovies] = useState(false);

    // Fetch schedule dates
    useEffect(() => {
        const fetchScheduleDates = async () => {
            try {
                setIsLoadingDates(true);
                const response = await axios.get('https://www.finnkino.fi/xml/ScheduleDates/');
                const parser = new xml2js.Parser({ explicitArray: false });

                const result = await parser.parseStringPromise(response.data);
                let dates = result.Dates.dateTime;

                if (!Array.isArray(dates)) {
                    dates = [dates];
                }

                setScheduleDates(dates);
                setVisibleDates(dates.slice(0, 7));
                setSelectedDate(dates[0]);
            } catch (error) {
                console.error('Error fetching schedule dates:', error);
                setIsErrorDates(true);
            } finally {
                setIsLoadingDates(false);
            }
        };

        fetchScheduleDates();
    }, []);

    // Fetch movies for the selected date
    useEffect(() => {
        const fetchMovies = async () => {
            if (!selectedDate) return;

            try {
                setIsLoadingMovies(true);
                const response = await axios.get(`https://www.finnkino.fi/xml/Schedule/?dt=${formatDate(selectedDate)}`);
                const parser = new xml2js.Parser({ explicitArray: false });

                const result = await parser.parseStringPromise(response.data);

                let shows = result.Schedule.Shows.Show;

                if (!Array.isArray(shows)) {
                    shows = [shows];
                }

                const uniqueShows = Array.from(
                    new Map(shows.map((show) => [show.EventID, show])).values()
                );

                const parsedMovies = uniqueShows.map((show) => ({
                    title: show.Title,
                    eventID: show.EventID,
                    theater: show.Theatre,
                    showStart: new Date(show.dttmShowStart).toLocaleString('fi-FI', { timeZone: 'UTC' }),
                    lengthInMinutes: show.LengthInMinutes,
                    imageUrl: show.Images.EventSmallImagePortrait,
                }));

                setMovies(parsedMovies);
            } catch (error) {
                console.error('Error fetching movies:', error);
                showNotification(error.response?.data?.message || 'An error occurred', 'error');
                setIsErrorMovies(true);
            } finally {
                setIsLoadingMovies(false);
            }
        };

        fetchMovies();
    }, [selectedDate]);

    const handleNext = () => {
        const newIndex = currentIndex + 7;
        if (newIndex < scheduleDates.length) {
            setCurrentIndex(newIndex);
            setVisibleDates(scheduleDates.slice(newIndex, newIndex + 7));
        }
    };

    const handlePrev = () => {
        const newIndex = currentIndex - 7;
        if (newIndex >= 0) {
            setCurrentIndex(newIndex);
            setVisibleDates(scheduleDates.slice(newIndex, newIndex + 7));
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const formatDate = (unformattedDate) => {
        const date = new Date(unformattedDate);
        return `${
            String(date.getDate()).padStart(2, '0')
        }.${
            String(date.getMonth() + 1).padStart(2, '0')
        }.${
            date.getFullYear()
        }`;
    };

    const filteredMovies = movies?.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.theater.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (movie.lengthInMinutes && movie.lengthInMinutes.toString().includes(searchTerm.toLowerCase()))
    );

    if (isLoadingDates) return <div>Loading schedule dates...</div>;
    if (isErrorDates) return <div>Error fetching schedule dates.</div>;

    return (
        <>
            <div className="schedule-dates-navigation">
                <button 
                    onClick={handlePrev} 
                    disabled={currentIndex === 0}
                    className="nav-button"
                >
                    Previous
                </button>
                <div className="schedule-dates-row">
                    {visibleDates.map((date, index) => (
                        <span 
                            key={index} 
                            className={`schedule-date ${selectedDate === date ? 'selected' : ''}`}
                            onClick={() => handleDateSelect(date)}
                        >
                            {formatDate(date)}
                        </span>
                    ))}
                </div>
                <button 
                    onClick={handleNext} 
                    disabled={currentIndex + 7 >= scheduleDates.length}
                    className="nav-button"
                >
                    Next
                </button>
            </div>
            <SearchBar/>
            {isLoadingMovies ? (
                <div>Loading movies...</div>
            ) : isErrorMovies ? (
                <div>Error fetching movies.</div>
            ) : (
                <div className="movie-list">
                    {filteredMovies?.map((movie, index) => (
                        <AddMovieCard key={index} movie={movie} groupId={groupId} />
                    ))}
                </div>
            )}
        </>
    );
};