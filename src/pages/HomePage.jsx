import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';
import MovieList from '../components/MovieList';
import { useNotification } from '../context/NotificationContext';
import './HomePage.css';

export default function HomePage() {
    const { showNotification } = useNotification();

    const [scheduleDates, setScheduleDates] = useState([]);
    const [visibleDates, setVisibleDates] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchScheduleDates = async () => {
            try {
                setIsLoading(true);
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
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScheduleDates();
    }, []);

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

    if (isLoading) return <div>Loading schedule dates...</div>;
    if (isError) return <div>Error fetching schedule dates.</div>;

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
            <MovieList selectedDate={formatDate(selectedDate)} />
        </>
    );
}

