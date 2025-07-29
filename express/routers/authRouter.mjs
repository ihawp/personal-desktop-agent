import express from 'express';
import login from '../controllers/auth/login.mjs';
import register from '../controllers/auth/register.mjs';
import magic from '../controllers/auth/magic.mjs';
import verify from '../controllers/auth/verify.mjs';
import error from '../controllers/error.mjs';

const authRouter = express.Router();

/**
 * @route POST /login
 * @description Allow a user to login to their account.
 */
authRouter.post('/login', login);

/**
 * @route POST /login
 * @description Allow a user to register an account.
 */
authRouter.post('/register', register);

/**
 * @route POST /magic
 * @description Verify a magic key against the DB before providing an access token to a user.
 */
authRouter.post('/magic', magic);

/**
 * @route GET /verify
 * @description Check if a user currently has a session or not.
 */
authRouter.get('/verify', verify);

// Implement error routes.

export default authRouter;