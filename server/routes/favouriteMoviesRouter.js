import express from 'express';
import { addFavourite, removeFavourite, getFavourites } from '../controllers/favouriteMoviesController.js';
import { auth } from '../util/auth.js';

const favouriteMoviesRouter = express.Router();

favouriteMoviesRouter.get('/', auth, getFavourites);
favouriteMoviesRouter.post('/new', auth, addFavourite);
favouriteMoviesRouter.delete('/:title', auth, removeFavourite);

export default favouriteMoviesRouter;