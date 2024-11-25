import { verify } from 'jsonwebtoken';

const auth_msg = 'Authorization required.';
const invalid_msg = 'Invalid credentials.';

const auth = (req, res, next) => {
    if (!req.headers.authorization){
        res.statusMessage = auth_msg;
        res.status(401).json({ message: auth_msg });
    } else{
        try {
            const token = req.headers.authorization;
            verify(token, process.env.JWT_SECRET_KEY);
            next();
        } catch (err) {
            res.statusMessage = invalid_msg;
            res.status(403).json({ message: invalid_msg });
        }
    }
}

export {auth};