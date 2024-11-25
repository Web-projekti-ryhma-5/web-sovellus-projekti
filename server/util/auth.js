import pkg from 'jsonwebtoken';
const { verify } = pkg;

const auth_msg = 'Authorization required.';
const invalid_msg = 'Invalid credentials.';

const auth = async (req, res, next) => {
    if (!req.headers.authorization){
        res.statusMessage = auth_msg;
        return res.status(401).json({ message: auth_msg });
    }
    try {
        const token = req.headers.authorization;

        const result = await pool.query('SELECT 1 FROM revoked_tokens WHERE token = $1', [token]);
        if (result.rows.length > 0) {
            return res.status(401).json({ message: 'Token has been revoked' });
        }

        verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (err) {
        res.statusMessage = invalid_msg;
        return res.status(403).json({ message: invalid_msg });
    }
}

export {auth};