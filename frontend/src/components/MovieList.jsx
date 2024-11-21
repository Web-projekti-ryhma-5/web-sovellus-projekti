import React, { useEffect, useState } from 'react';
import axios from 'axios';
import xml2js from 'xml2js';

import MovieCard from './MovieCard.jsx';
import { useSearch } from '../context/SearchContext.jsx';

export default function MovieList({ selectedDate }) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const { searchTerm } = useSearch();

    const filteredMovies = movies?.filter((movie) =>
        movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.theater && movie.theater.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.lengthInMinutes && movie.lengthInMinutes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchMovies = async () => {
            if (!selectedDate) return;

            try {
                setIsLoading(true);
                const response = await axios.get(`https://www.finnkino.fi/xml/Schedule/?dt=${selectedDate}`);
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
                    theater: show.Theatre,
                    showStart: new Date(show.dttmShowStart).toLocaleString('fi-FI', { timeZone: 'UTC' }),
                    lengthInMinutes: show.LengthInMinutes,
                    imageUrl: show.Images.EventSmallImagePortrait,
                }));

                setMovies(parsedMovies);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [selectedDate]);

    if (isLoading) return <div>Loading movies...</div>;
    if (isError) return <div>Error fetching movies.</div>;

    return (
        <div className='movie-list'>
            {filteredMovies?.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
            ))}
        </div>
    );
}

// export default function MovieList(){
    
//     const [movies, setMovies] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isError, setIsError] = useState(false);

//     const { searchTerm } = useSearch();

//     const filteredMovies = movies?.filter((movie) =>
//         movie.title && movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         movie.theater && movie.theater.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         movie.lengthInMinutes && movie.lengthInMinutes.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const formatDate = (unformattedDate) => {
//         const date = new Date(unformattedDate);
//         return`${
//             String(date.getHours()).padStart(2, '0')
//         }:${String(date.getMinutes()).padStart(2, '0')} ${
//             String(date.getDate()).padStart(2, '0')
//         }.${
//             String(date.getMonth() + 1).padStart(2, '0')
//         }.${date.getFullYear()}`;
//     }

//     useEffect(() => {
//         const fetchMovies = async () => {
//             try {
//                 setIsLoading(true);
//                 const response = await axios.get('https://www.finnkino.fi/xml/Schedule/');
//                 const parser = new xml2js.Parser({ explicitArray: false });

//                 const result = await parser.parseStringPromise(response.data);

//                 let shows = result.Schedule.Shows.Show;

//                 if (!Array.isArray(shows)) {
//                     shows = [shows];
//                 }

//                 const parsedMovies = shows.map((show) => ({
//                     title: show.Title,
//                     theater: show.Theatre,
//                     showStart: formatDate(show.dttmShowStart),
//                     lengthInMinutes: show.LengthInMinutes,
//                 }));

//                 setMovies(parsedMovies);
//             } catch (error) {
//                 console.error('Error fetching movies:', error);
//                 setIsError(true);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchMovies();
//     }, []);

//     if (isLoading) return (<div>Loading ...</div>);
//     if (isError) return (<div>Error</div>);

//     return (
//         <div className='movie-list'>
//             {filteredMovies?.map((movie, index) => (
//                 <MovieCard key={index} movie={movie} />
//             ))}
//         </div>
//     );
// }