import { ApiError } from "../util/ApiError.js";
import {pool} from "../db.js";
import { postUser, getByEmail, deleteUser } from '../models/userModel.js';
import {hash, compare} from 'bcrypt';
import pkg from 'jsonwebtoken';
const {sign} = pkg;

const loginUser = async (req, res, next) => {
    const invalid_message = 'Invalid credentials.';
    try {
        const result = await getByEmail(req.body.email);
        if (result.rowCount === 0) return next(new ApiError(invalid_message));

        const match = await compare(req.body.password, result.rows[0].user_password);
        if (!match) return next(new ApiError(invalid_message, 401));

        const token = sign({user: req.body.email}, process.env.JWT_SECRET_KEY);
        const user = result.rows[0];
        return res.status(200).json(createUserObject(user.id, user.email, token));
    } catch (err) {
        return next(err);
    }
}

const registerUser = async (req, res, next) => {
    try {
        if(!req.body.email || req.body.email.length === 0) return next(new ApiError('Invalid email for user', 400));
        if(!req.body.password || req.body.password.length < 8) return next(new ApiError('Invalid password for user', 400));

        const hashedPassword = await hash(req.body.password, 10);
        const result = await postUser(req.body.email, hashedPassword);

        res.status(201).json(createUserObject(result.rows[0].id, result.rows[0].email));
    } catch (err) {
        return next(err);
    }
}

const logout = async (req, res, next) => {
    try {
        await pool.query('INSERT INTO token_blacklist (token) VALUES ($1)', [token]);
        return res.status(200).json({ message: 'Successfully logged out' });
    } catch (err) {
        return next(err);
    }
}

const createUserObject = (id, email, token=undefined) => {
    return {
        id: id,
        email: email,
        ...(token !== undefined) && {token: token}
    }
}

export {loginUser, registerUser, logout};