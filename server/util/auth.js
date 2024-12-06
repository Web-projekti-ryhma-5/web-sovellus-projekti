import pkg from 'jsonwebtoken';
import {pool} from '../db.js';
const { verify } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const auth_msg = 'Authorization required.';
const invalid_msg = 'Invalid credentials.';

const auth = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token){
        return res.status(401).json({ message: auth_msg });
    }
    try {
        const result = await pool.query('SELECT 1 FROM revoked_tokens WHERE token = $1', [token]);
        if (result.rows.length > 0) {
            return res.status(401).json({ message: 'Token has been revoked' });
        }
        const decoded = verify(token, process.env.JWT_SECRET_KEY);
        const user = { email: decoded.email, id: decoded.id };
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: invalid_msg });
    }
}

export {auth};