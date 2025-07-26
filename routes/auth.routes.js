import { Router } from 'express';
const authRouter = Router();

authRouter.get('/sign-up', (req, res) => res.send({ body: 'Sign Up Page' }));
authRouter.get('/sign-in', (req, res) => res.send({ body: 'Sign In Page' }));
authRouter.get('/sign-out', (req, res) => res.send({ body: 'Sign Out Page' }));

export default authRouter;