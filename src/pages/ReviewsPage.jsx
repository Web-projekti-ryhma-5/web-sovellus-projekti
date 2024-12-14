import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import './ReviewsPage.css';

export default function ReviewsPage(){
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const handleClick = (movie) => {
        const queryParams = new URLSearchParams();
        queryParams.append('title', movie.title);
        if (movie.finnkino_event) {
            queryParams.append('eventID', movie.finnkino_event);
        }
        navigate(`/movie?${queryParams.toString()}`);
    };

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setIsLoading(true);

                const response = await axios.get('http://localhost:3001/api/reviews/all');
                setReviews(response.data.reviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (isLoading) return <div>Loading schedule dates...</div>;
    if (isError) return <div>Error fetching schedule dates.</div>;

    return (
        <>
            <h1>Reviews</h1>
            <div className="reviews-list">
                {reviews.map((review, index) => (
                    <div 
                        className="review-card" 
                        key={index} 
                        onClick={() => handleClick(review)}
                    >
                        <div className="review-header">
                            <h2 className="movie-title">{review.title}</h2>
                            <p className="review-rating">Rating: {review.rating}/5</p>
                        </div>
                        <p className="review-info">{review.info}</p>
                        <div className="review-footer">
                            <p className="review-author">By: {review.email}</p>
                            <p className="review-date">
                                {new Date(review.created).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
