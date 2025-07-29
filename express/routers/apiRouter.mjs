import express from 'express';
import chat from '../controllers/api/chat.mjs';

const apiRouter = express.Router();

apiRouter.post('/chat', chat);

export default apiRouter;