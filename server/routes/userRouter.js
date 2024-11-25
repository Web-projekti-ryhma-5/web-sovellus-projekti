import {loginUser, registerUser} from '../controllers/userController.js';
import {Router} from "express";

const userRouter = Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
// userRouter.post('/logout', registerUser);
// userRouter.post('/invalidate', registerUser);

export {userRouter};