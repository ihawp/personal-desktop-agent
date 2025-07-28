import express from 'express';
import ollama from 'ollama';
import { configDotenv } from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'node:path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

configDotenv({ debug: true });

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const userPrompt = req.body.chat;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        // ollama.chat returns async iterator when stream: true
        const stream = await ollama.chat({
            model: 'gemma3:latest',
            messages: [{ role: 'user', content: userPrompt }],
            stream: true,
        });

        for await (const chunk of stream) {
        // chunk might be like: { message: { content: 'partial text' } }
        if (chunk.message?.content) {
            // Send SSE formatted message
            res.write(`${chunk.message.content.replace(/\n/g, '\\n')}\n\n`);
        }
        }
    } catch (err) {
        console.error('Ollama stream error:', err);
        res.write(`event: error\ndata: ${JSON.stringify(err.message)}\n\n`);
    } finally {
        res.write('event: end\ndata: [DONE]\n\n');
        res.end();
    }
});

app.use(express.static(path.join(__dirname, '../', 'website', 'dist')))
app.get('/', (req, res) => {

    // serve some static files
    res.sendFile(path.join(__dirname, '../', 'website', 'dist', 'index.html'));

});

app.listen(3000);