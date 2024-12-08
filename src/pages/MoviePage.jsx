import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import xml2js from 'xml2js';
import { useAuth } from '../context/AuthContext';
import './MoviePage.css'

export default function MoviePage() {
    const { token, user } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [searchParams] = useSearchParams();
    const title = searchParams.get('title');
    const eventID = searchParams.get('eventID');

    const [movieDetails, setMovieDetails] = useState(null);
    const [schedules, setSchedules] = useState([]);

    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(1);
    const [userReview, setUserReview] = useState(null);

    const tmdbToken = import.meta.env.VITE_TOKEN;

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setIsLoading(true);

                // get imdb movie data by movie title
                const tmdbResponse = await axios.get(
                    `https://api.themoviedb.org/3/search/movie`,
                    {
                        params: {
                            query: title,
                            include_adult: false,
                            language: 'en-US',
                        },
                        headers: {
                            Authorization: `Bearer ${tmdbToken}`,
                            accept: 'application/json',
                        },
                    }
                );

                const movieData = tmdbResponse.data.results[0];
                if (!movieData) {
                    throw new Error(`No movie found for title "${title}"`);
                }

                // if eventID url param is present parse movie schedule dates from finnkino
                if (eventID) {
                    const finnkinoResponse = await axios.get(
                        `https://www.finnkino.fi/xml/Schedule/?eventID=${eventID}`
                    );

                    const parser = new xml2js.Parser({ explicitArray: false });
                    const scheduleData = await parser.parseStringPromise(finnkinoResponse.data);
                    const shows = scheduleData.Schedule.Shows.Show;

                    setSchedules(Array.isArray(shows) ? shows : [shows]);
                }

                setMovieDetails({
                    title: movieData.title,
                    overview: movieData.overview,
                    rating: movieData.vote_average,
                    image: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                });

                // get reviews from api
                const reviewResponse = await axios.get(`http://localhost:3001/api/reviews/${movieData.title}`);
                setReviews(reviewResponse.data.reviews);

                if (user?.email) {
                    // Find if the logged-in user has already reviewed the movie
                    const existingReview = reviewResponse.data.reviews.find(
                        (review) => review.email === user.email
                    );
                    setUserReview(existingReview);
                    if (existingReview) {
                        setReviewText(existingReview.info);
                        setReviewRating(Number(existingReview.rating));
                    }
                }
            } catch (error) {
                console.error("Error fetching movie details or schedules:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieData();
    }, [title, eventID, user]);

    useEffect(() => {
        console.log("User:", user);
        console.log("User Review:", userReview);
    }, [user, userReview]);

    const handleAddOrUpdateReview = async (e) => {
        e.preventDefault();
        try {
            const endpoint = userReview
                ? `http://localhost:3001/api/reviews/${movieDetails.title}`
                : `http://localhost:3001/api/reviews/new`;

            const method = userReview ? 'put' : 'post';

            const response = await axios[method](
                endpoint,
                {
                    title: movieDetails.title,
                    rating: reviewRating.toString(),
                    info: reviewText,
                },
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setUserReview(response.data.review);
            if (!userReview) setReviews([...reviews, response.data.review]);
            else {
                setReviews(
                    reviews.map((review) =>
                        review.email === response.data.review.email ? response.data.review : review
                    )
                );
            }
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleDeleteReview = async () => {
        try {
            await axios.delete(`http://localhost:3001/api/reviews/${movieDetails.title}`, {
                data: { title: movieDetails.title },
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });

            setReviews(reviews.filter((review) => review.id !== userReview.id));
            setUserReview(null);
            setReviewText('');
            setReviewRating(1);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading movie details.</div>;

    return (
        <div className="movie-page">
            <div className="movie-details">
                <img
                    src={movieDetails.image}
                    alt={`Poster for ${movieDetails.title}`}
                    className="movie-poster"
                />
                <h1>{movieDetails.title}</h1>
                <p><strong>Rating:</strong> {movieDetails.rating}/10</p>
                <p>{movieDetails.overview}</p>
            </div>

            <div className="schedule-details">
                <h2>Showtimes</h2>
                {schedules.map((schedule, index) => (
                    <div key={index} className="schedule-item">
                        <p><strong>Theater:</strong> {schedule.Theatre}</p>
                        <p><strong>Show Start:</strong> {new Date(schedule.dttmShowStart).toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <div className="reviews-section">
                <h2>Reviews</h2>
                {reviews.map((review, index) => (
                    <div key={index} className="review-item">
                        <p><strong>{review.email}</strong> - {new Date(review.created).toLocaleString()}</p>
                        <p><strong>Rating:</strong> {review.rating}/5</p>
                        <p>{review.info}</p>
                    </div>
                ))}

                {token && (
                    <form onSubmit={handleAddOrUpdateReview} className="review-form">
                        <h3>{userReview ? 'Edit Your Review' : 'Add Your Review'}</h3>
                        <div>
                            <label htmlFor="rating">Rating:</label>
                            <select
                                id="rating"
                                value={reviewRating}
                                onChange={(e) => setReviewRating(e.target.value)}
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <option key={star} value={star}>{star}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="review">Review:</label>
                            <textarea
                                id="review"
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Write your review here..."
                            />
                        </div>
                        <button type="submit">{userReview ? 'Update Review' : 'Submit Review'}</button>
                        {userReview && (
                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDeleteReview}
                            >
                                Delete Review
                            </button>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}

