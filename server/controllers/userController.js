import { ApiError } from "../util/ApiError.js";
import {pool} from "../db.js";
import { postUser, getByEmail, deleteUser } from '../models/userModel.js';
import {hash, compare} from 'bcrypt';
import pkg from 'jsonwebtoken';
const {sign} = pkg;

const loginUser = async (req, res, next) => {
    const invalid_message = 'Invalid credentials';
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const result = await getByEmail(req.body.email);
        if (result.rowCount === 0) return next(new ApiError(invalid_message, 401));

        const match = await compare(req.body.password, result.rows[0].user_password);
        if (!match) return next(new ApiError(invalid_message, 401));

        const token = sign({email: result.rows[0].email, id: result.rows[0].id}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({token});
    } catch (err) {
        return next(err);
    }
}

const registerUser = async (req, res, next) => {
    try {
        if(!req.body.email || req.body.email.length === 0) return next(new ApiError('Invalid email for user', 400));
        if(!req.body.password || req.body.password.length < 8) return next(new ApiError('Invalid password for user', 400));

        const hashedPassword = await hash(req.body.password, 10);
        await postUser(req.body.email, hashedPassword);

        res.status(201).json({ message: 'Registration success' });
    } catch (err) {
        // Database unique constraint error
        if (err.code === '23505') {
            return res.status(409).json({ message: 'Email already exists' });
        }
        return next(err);
    }
}

const logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        await pool.query('INSERT INTO revoked_tokens (token) VALUES ($1)', [token]);
        return res.status(200).json({ message: 'Successfully logged out' });
    } catch (err) {
        return next(err);
    }
}

const invalidateAccount = async (req, res, next) => {
    try {
        const email = req.user.email;

        if (!email) {
            return res.status(400).json({ message: 'Invalid request: User email not found' });
        }

        const result = await deleteUser(email);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.status(200).json({ message: 'Account invalidated successfully' });
    } catch (err) {
        return next(err);
    }
};


export {loginUser, registerUser, logout, invalidateAccount};