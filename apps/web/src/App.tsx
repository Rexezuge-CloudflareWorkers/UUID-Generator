import { useState, useEffect } from 'react';

function formatUuid(uuid: string, includeDashes: boolean) {
  return includeDashes ? uuid : uuid.replace(/-/g, '');
}

function UuidRow({ label, uuid, includeDashes }: { label: string; uuid: string; includeDashes: boolean }) {
  const [copied, setCopied] = useState(false);
  const displayValue = formatUuid(uuid, includeDashes);
  const copyLabel = `Copy ${label} ${includeDashes ? 'with dashes' : 'without dashes'}`;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(displayValue)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy UUID:', err);
      });
  };

  return (
    <div className="mb-4">
      <span className="block mb-2 font-semibold text-gray-700">{label}:</span>
      <div className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 font-mono text-sm flex items-center justify-between gap-2 whitespace-nowrap overflow-hidden">
        <span className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap">{displayValue}</span>
        <button
          type="button"
          title={copied ? 'Copied!' : copyLabel}
          aria-label={copied ? `Copied ${label}` : copyLabel}
          onClick={copyToClipboard}
          className="ml-3 flex shrink-0 items-center gap-1.5 rounded px-2 py-1 hover:bg-gray-200"
        >
          <span aria-hidden="true" className="text-xl">
            {copied ? '✔' : '📋'}
          </span>
          <span className="font-sans text-sm font-medium">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}

function App() {
  const [uuid1, setUuid1] = useState('Loading...');
  const [uuid2, setUuid2] = useState('Loading...');
  const [uuid3, setUuid3] = useState('Loading...');
  const [includeDashes, setIncludeDashes] = useState(true);

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

  const toggleButtonClass = (active: boolean) =>
    `px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
      active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="flex flex-col items-center p-5 min-h-screen bg-gray-50">
      <div className="w-full max-w-xl p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-6">UUID Generator</h2>

        <div className="mb-6 flex items-center justify-center">
          <div role="group" aria-label="UUID format" className="inline-flex overflow-hidden rounded-md border border-gray-300">
            <button
              type="button"
              aria-pressed={includeDashes}
              onClick={() => setIncludeDashes(true)}
              className={toggleButtonClass(includeDashes)}
            >
              With dashes
            </button>
            <button
              type="button"
              aria-pressed={!includeDashes}
              onClick={() => setIncludeDashes(false)}
              className={`border-l border-gray-300 ${toggleButtonClass(!includeDashes)}`}
            >
              Without dashes
            </button>
          </div>
        </div>

        <div aria-live="polite">
          <UuidRow label="Random UUID" uuid={uuid1} includeDashes={includeDashes} />
          <UuidRow label="UUID starting with a letter" uuid={uuid2} includeDashes={includeDashes} />
          <UuidRow label="UUID starting with a number" uuid={uuid3} includeDashes={includeDashes} />
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
