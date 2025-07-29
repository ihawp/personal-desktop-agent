import { useState } from 'react';
import Markdown from 'marked-react';

function App() {
  const [chatInput, setChatInput] = useState('');
  const [chatOutput, setChatOutput] = useState('');
  const [loading, setLoading] = useState(true);

  const submitChat = event => {
    event.preventDefault();

    setLoading(true);

    if (!chatInput) return;
    doFetch(chatInput);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(chatOutput);
      alert('Copied to clipboard.');
    } catch (error) {
      alert('Not copied to clipboard.');
      console.error(error);
    }
  }

  function cleanChunk(text) {
    return text
      // Normalize curly apostrophes and quotes to straight.
      .replace(/[‘’]/g, "'")
      .replace(/[“”]/g, '"')

      // Remove all newline characters (you can replace with space if you want).
      .replace(/\n+/g, ' ')

      // Fix spacing around punctuation (no space before, one space after).
      .replace(/\s*([.,:;!?()\[\]{}-])\s*/g, (m, p) => p + ' ')

      // Fix spacing around markdown bold/italic (don't break formatting).
      .replace(/\s*\*\*(.*?)\*\*\s*/g, '**$1**')
      .replace(/\s*\*(.*?)\*\s*/g, '*$1*')

      // Collapse multiple spaces to single space.
      .replace(/ {2,}/g, ' ')

      // Trim leading/trailing spaces.
      .trim();
  }

  const doFetch = async (chat) => {
    setChatOutput(''); // clear old output

    try {
      const response = await fetch(import.meta.env.VITE_SERVER_URL + 'api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat }),
      });

      if (!response.ok) throw new Error('Server error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          let chunk = decoder.decode(value);
          chunk = cleanChunk(chunk);

          if (chunk.done_reason) {
            console.log('done reason', chunk.done_reason);
            return;
          }

          setChatOutput(prev => prev + chunk + ' ');
        }
      }

    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return <>
    <h1>Make an AI request</h1>

    { chatOutput ? <button onClick={ copyToClipboard }>Copy</button> : ''}

    <button onClick={ console.log(chatOutput) }>Log Output</button>

    <form onSubmit={submitChat}>
      <input
        type="text"
        name="chat"
        value={chatInput}
        onChange={e => setChatInput(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>

    <Markdown className={"flex flex-col w-full"}>
      {chatOutput}
    </Markdown>
  </>;
}

export default App;