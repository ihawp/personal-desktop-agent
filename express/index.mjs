import express from 'express';
import ollama from 'ollama';
import { configDotenv } from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

configDotenv({ debug: true });

const app = express();

app.get('/api/ai', async (req, res) => {

    // serve some ai response.

    const { content } = req.body ?? 'What is 9*10?';

    const response = await ollama.chat({
        model: 'gemma3:latest',
        messages: [{
            role: 'user',
            content: content + '. ENSURE ALL RESULTS ARE KEPT STRAIGHTFORWARD, ACADEMIC.',
        }],
        stream: true,
        keep_alive: "5m",
    });

    const thing = Array();

    for await (const part of response) {
        console.log(part);
        thing.push(part.message.content);
    }

    res.status(200).json({ success: true, thing });
});

app.use(express.static(path.join(__dirname, '../', 'website')))
app.get('/', (req, res) => {

    // serve some static files
    res.sendFile(path.join(__dirname, '../', 'website', 'index.html'));

});

app.listen(3000);