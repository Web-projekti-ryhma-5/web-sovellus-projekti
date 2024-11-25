import {loginUser, registerUser, logout} from '../controllers/userController.js';
import {auth} from '../util/auth.js';
import {Router} from "express";

const userRouter = Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/logout', auth, logout);
// userRouter.post('/invalidate', registerUser);

export {userRouter};