import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'node:path';
import cors from 'cors';
import apiRouter from './routers/apiRouter.mjs';
import authRouter from './routers/authRouter.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.use(express.static(path.join(__dirname, '../', 'website', 'dist')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'website', 'dist', 'index.html'));
});

app.listen(3000);