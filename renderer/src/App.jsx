import { useState, useEffect } from 'react';
import Markdown from 'marked-react';

function App() {
  const [chatInput, setChatInput] = useState('');
  const [chatOutput, setChatOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [ocrData, setOcrData] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);

  const doOnOCR = async (data) => {
    console.log('Received OCR data:', data);

    if (ocrLoading) return;

    setOcrLoading(true);

    // make a fetch request to ai api.
    try {
      const response = await doFetch(data);
      if (!response) throw new Error('error message');
      setOcrData(data);
    } catch (error) { } finally {
      setOcrLoading(false);
    }

    // receive response with useful links and etc.

    // format for display on tab on left side of screen.

    // It is a live task tracker that can provide you with extra insights into what you are currently doing.
  }

  useEffect(() => {
    window.electronAPI.onOCR(doOnOCR);
  }, []);

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
    setChatOutput('');

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

  return <div className="flex flex-col">
    <form 
      onSubmit={submitChat} 
      className="font-large flex flex-row justify-center fixed bottom-0 left-0 w-full z-[9999] bg-white"
    >
      <textarea
        type="text"
        name="chat"
        value={chatInput}
        className="p-2 border-blue-600 border-[2px] border-solid text-blue-600 resize-none w-full"
        onChange={event => setChatInput(prev => event.target.value)}
      />

      <button 
        type="submit"
        className="py-2 px-3 bg-blue-600 text-white cursor-pointer border-blue-600 border-solid border-[2px]"
      >Send</button>
    </form>

    <div className="relative p-4 pt-8 pb-24">
      { chatOutput ? <button 
        className="absolute top-0 right-0 cursor-pointer bg-gray-500 text-white" 
        onClick={ copyToClipboard }
      >Copy</button> : ''}
      <Markdown className="w-full">
        {chatOutput}
      </Markdown>
    </div>
  </div>;
}

export default App;