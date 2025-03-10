import { HTML_TEMPLATE } from "./generated-src/generated";

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/api") {
			return handleApiRequest(url);
		}

		return handleHtmlRequest();
	},
};

// API Route: Returns JSON with x number of UUIDs
async function handleApiRequest(url: URL): Promise<Response> {
	const numberParam = url.searchParams.get("number");
	let count = Number(numberParam) || 1;

	// Enforce a limit to prevent excessive requests
	if (count < 1) count = 1;
	if (count > 100) count = 100;

	const uuids = Array.from({ length: count }, () => crypto.randomUUID());

	return new Response(JSON.stringify({ uuids }), {
		headers: { "Content-Type": "application/json" },
	});
}

// HTML Route: Serves the UUID generator page
async function handleHtmlRequest(): Promise<Response> {
	const uuid1 = crypto.randomUUID();
	const uuid2 = generateLetterStartingUUID();

	const html = HTML_TEMPLATE.replace("{{UUID1}}", uuid1).replace("{{UUID2}}", uuid2);

	return new Response(html, {
		headers: { "Content-Type": "text/html" },
	});
}

// Function to generate a UUID that starts with a letter
function generateLetterStartingUUID(): string {
	let uuid: string;
	do {
		uuid = crypto.randomUUID();
	} while (!/^[a-zA-Z]/.test(uuid));
	return uuid;
}
