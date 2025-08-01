import { Router } from 'express';

const userRouter = Router();
import { getUsers } from '../controllers/user.controller.js';
userRouter.get('/', getUsers);

userRouter.get('/:id', (req, res) => res.send({ title: 'GET user details' }));

userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE a user' }));

export default userRouter; 