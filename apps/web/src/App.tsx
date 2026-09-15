import { useState, useEffect } from 'react';

function App() {
  const [uuid1, setUuid1] = useState('Loading...');
  const [uuid2, setUuid2] = useState('Loading...');
  const [uuid3, setUuid3] = useState('Loading...');
  const [copyIcon1, setCopyIcon1] = useState('📋');
  const [copyIcon2, setCopyIcon2] = useState('📋');
  const [copyIcon3, setCopyIcon3] = useState('📋');
  const [copyIcon1Plain, setCopyIcon1Plain] = useState('📋');
  const [copyIcon2Plain, setCopyIcon2Plain] = useState('📋');
  const [copyIcon3Plain, setCopyIcon3Plain] = useState('📋');

  useEffect(() => {
    const fetchUUIDs = async () => {
      try {
        const response = await fetch('/api/uuid/batch?randomCount=1&letterCount=1&numberCount=1');
        const data = await response.json();

        setUuid1((data.random && data.random[0]) || 'Error fetching UUID');
        setUuid2((data.startsWithLetter && data.startsWithLetter[0]) || 'Error fetching UUID');
        setUuid3((data.startsWithNumber && data.startsWithNumber[0]) || 'Error fetching UUID');
      } catch (error) {
        console.error('Error fetching UUIDs:', error);
        setUuid1('Error fetching UUID');
        setUuid2('Error fetching UUID');
        setUuid3('Error fetching UUID');
      }
    };
    fetchUUIDs();
  }, []);

  const copyToClipboard = (text: string, setIcon: (icon: string) => void) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIcon('✔');
        setTimeout(() => setIcon('📋'), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy UUID:', err);
      });
  };

  return (
    <div className="flex flex-col items-center p-5 min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-6">UUID Generator</h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">Random UUID:</label>
          <div className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 font-mono text-sm break-all flex items-center justify-between">
            <span className="flex-grow">{uuid1}</span>
            <button
              title="Copy with dashes"
              onClick={() => copyToClipboard(uuid1, setCopyIcon1)}
              className="ml-3 text-2xl hover:bg-gray-200 p-1 rounded"
            >
              {copyIcon1}
            </button>
            <button
              title="Copy without dashes"
              onClick={() => copyToClipboard(uuid1.replace(/-/g, ''), setCopyIcon1Plain)}
              className="ml-1 text-2xl hover:bg-gray-200 p-1 rounded"
            >
              {copyIcon1Plain}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">UUID starting with a letter:</label>
          <div className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 font-mono text-sm break-all flex items-center justify-between">
            <span className="flex-grow">{uuid2}</span>
            <button
              title="Copy with dashes"
              onClick={() => copyToClipboard(uuid2, setCopyIcon2)}
              className="ml-3 text-2xl hover:bg-gray-200 p-1 rounded"
            >
              {copyIcon2}
            </button>
            <button
              title="Copy without dashes"
              onClick={() => copyToClipboard(uuid2.replace(/-/g, ''), setCopyIcon2Plain)}
              className="ml-1 text-2xl hover:bg-gray-200 p-1 rounded"
            >
              {copyIcon2Plain}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">UUID starting with a number:</label>
          <div className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 font-mono text-sm break-all flex items-center justify-between">
            <span className="flex-grow">{uuid3}</span>
            <button
              title="Copy with dashes"
              onClick={() => copyToClipboard(uuid3, setCopyIcon3)}
              className="ml-3 text-2xl hover:bg-gray-200 p-1 rounded"
            >
              {copyIcon3}
            </button>
            <button
              title="Copy without dashes"
              onClick={() => copyToClipboard(uuid3.replace(/-/g, ''), setCopyIcon3Plain)}
              className="ml-1 text-2xl hover:bg-gray-200 p-1 rounded"
            >
              {copyIcon3Plain}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          For more details on the API, please visit the{' '}
          <a href="/docs" target="_blank" className="text-blue-600 hover:underline">
            OpenAPI documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default App;
