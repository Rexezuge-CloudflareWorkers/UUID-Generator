import { useState, useEffect } from 'react';

function App() {
	const [uuid1, setUuid1] = useState('Loading...');
	const [uuid2, setUuid2] = useState('Loading...');
	const [uuid3, setUuid3] = useState('Loading...');
	const [copyIcon1, setCopyIcon1] = useState('📋');
	const [copyIcon2, setCopyIcon2] = useState('📋');
	const [copyIcon3, setCopyIcon3] = useState('📋');

	const fetchUUIDs = async () => {
		try {
			const requests = [
				fetch('/api/uuid'),
				fetch('/api/uuid?startWithLetter=true'),
				fetch('/api/uuid?startWithNumber=true'),
			];

			const responses = await Promise.all(requests);
			const dataPromises = responses.map((response) => response.json());
			const data = await Promise.all(dataPromises);

			setUuid1((data[0].uuids && data[0].uuids[0]) || 'Error fetching UUID');
			setUuid2((data[1].uuids && data[1].uuids[0]) || 'Error fetching UUID');
			setUuid3((data[2].uuids && data[2].uuids[0]) || 'Error fetching UUID');
		} catch (error) {
			console.error('Error fetching UUIDs:', error);
			setUuid1('Error fetching UUID');
			setUuid2('Error fetching UUID');
			setUuid3('Error fetching UUID');
		}
	};

	useEffect(() => {
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
					<label className="block mb-2 font-semibold text-gray-700">
						Random UUID:
					</label>
					<div className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 font-mono text-sm break-all flex items-center justify-between">
						<span className="flex-grow">{uuid1}</span>
						<button
							onClick={() => copyToClipboard(uuid1, setCopyIcon1)}
							className="ml-3 text-2xl hover:bg-gray-200 p-1 rounded"
						>
							{copyIcon1}
						</button>
					</div>
				</div>

				<div className="mb-4">
					<label className="block mb-2 font-semibold text-gray-700">
						UUID starting with a letter:
					</label>
					<div className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 font-mono text-sm break-all flex items-center justify-between">
						<span className="flex-grow">{uuid2}</span>
						<button
							onClick={() => copyToClipboard(uuid2, setCopyIcon2)}
							className="ml-3 text-2xl hover:bg-gray-200 p-1 rounded"
						>
							{copyIcon2}
						</button>
					</div>
				</div>

				<div className="mb-4">
					<label className="block mb-2 font-semibold text-gray-700">
						UUID starting with a number:
					</label>
					<div className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 font-mono text-sm break-all flex items-center justify-between">
						<span className="flex-grow">{uuid3}</span>
						<button
							onClick={() => copyToClipboard(uuid3, setCopyIcon3)}
							className="ml-3 text-2xl hover:bg-gray-200 p-1 rounded"
						>
							{copyIcon3}
						</button>
					</div>
				</div>
			</div>

			<div className="mt-8 text-center">
				<p className="text-gray-600">
					For more details on the API, please visit the{' '}
					<a
						href="/docs"
						target="_blank"
						className="text-blue-600 hover:underline"
					>
						OpenAPI documentation
					</a>
					.
				</p>
			</div>
		</div>
	);
}

export default App;
