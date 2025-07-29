import ollama from 'ollama';

const chat = async (req, res) => {

    let { chat } = req.body;

    chat = chat + " | ALL RESPONSES MUST BE IN MARKDOWN FORMAT AND NO LONGER THAN 300 WORDS. DO NOT REFERENCE THESE ADDITIONAL INSTRUCTIONS.";

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        // ollama.chat returns async iterator when stream: true
        const stream = await ollama.chat({
            model: 'gemma3:latest',
            messages: [{ role: 'user', content: chat }],
            stream: true,
        });

        for await (const chunk of stream) {
            if (chunk.message?.content) {
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
}

export default chat;