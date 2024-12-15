import { addFavouriteMovie, removeFavouriteMovie, getFavouriteMoviesByUserId } from '../models/favouriteMoviesModel.js';
import { getMovieByTitle, postMovie } from '../models/movieModel.js';

export const addFavourite = async (req, res, next) => {
    try {
        const { title, finnkino_event } = req.body;
        const userId = req.user.id;

        if (!title || finnkino_event) {
            return res.status(400).json({ message: 'Movie title is required' });
        }

        let movie = await getMovieByTitle(title);

        if (!movie.rows[0]) {
            movie = await postMovie(title, finnkino_event);
        }

        const favourite = await addFavouriteMovie(userId, movie.rows[0].id);

        return res.status(201).json({
            message: 'Movie added to favourites successfully',
            favourite: favourite.rows[0],
        });
    } catch (err) {
        return next(err);
    }
};

export const removeFavourite = async (req, res, next) => {
    try {
        const { title } = req.params;
        const userId = req.user.id;

        let movie = await getMovieByTitle(title);

        if (!movie.rows[0]) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const removedFavourite = await removeFavouriteMovie(userId, movie.rows[0].id);
        if (removedFavourite.rowCount === 0) {
            return res.status(404).json({ message: 'Favourite movie not found' });
        }

        return res.status(200).json({ message: 'Movie removed from favourites successfully' });
    } catch (err) {
        return next(err);
    }
};

export const getFavourites = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const favourites = await getFavouriteMoviesByUserId(userId);

        return res.status(200).json({ favourites: favourites.rows });
    } catch (err) {
        return next(err);
    }
};