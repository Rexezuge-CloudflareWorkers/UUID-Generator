import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class GenerateUUIDRoute extends OpenAPIRoute {
	schema = {
		tags: ["UUID"],
		summary: "Generate Random UUID(s)",
		description: "Generates one or more UUIDs with optional constraints on the starting character (letter or number).",
		parameters: [
			{
				name: "count",
				in: "query",
				description: "Number of UUIDs to generate (1 to 200). Defaults to 1.",
				required: false,
				schema: { type: "integer", minimum: 1, maximum: 200, default: 1 },
			},
			{
				name: "startWithLetter",
				in: "query",
				description: "Whether the UUID should start with a letter (A-Z, a-z). Defaults to false.",
				required: false,
				schema: { type: "boolean", default: false },
			},
			{
				name: "startWithNumber",
				in: "query",
				description: "Whether the UUID should start with a number (0-9). Defaults to false.",
				required: false,
				schema: { type: "boolean", default: false },
			},
		],
		responses: {
			"200": {
				description: "Successfully generated UUID(s)",
				content: {
					"application/json": {
						schema: z.object({
							uuids: z.array(z.string())
						}),
					},
				},
			},
			"400": {
				description: "Invalid request parameters",
			},
			"500": {
				description: "Internal Server Error",
			},
		},
	};

	async handle(c: any) {
		try {
			const url = new URL(c.req.url);

			// Define and validate query parameters using zod
			const schema = z.object({
				count: z.string().regex(/^\d+$/).default("1"),
				startWithLetter: z.string().regex(/^(true|false)$/).default("false"),
				startWithNumber: z.string().regex(/^(true|false)$/).default("false"),
			});

			const parsedParams = schema.safeParse({
				count: url.searchParams.get("count") ?? "1",
				startWithLetter: url.searchParams.get("startWithLetter") ?? "false",
				startWithNumber: url.searchParams.get("startWithNumber") ?? "false",
			});

			if (!parsedParams.success) {
				return c.json({ error: "Invalid request parameters", details: parsedParams.error.format() }, 400);
			}

			const { count, startWithLetter, startWithNumber } = parsedParams.data;
			const countNum = parseInt(count, 10);
			const startsWithLetter = startWithLetter === "true";
			const startsWithNumber = startWithNumber === "true";

			// Conflict validation
			if (startsWithLetter && startsWithNumber) {
				return c.json({ error: "Cannot set both 'startWithLetter' and 'startWithNumber' to true." }, 400);
			}

			const uuids: string[] = [];

			// UUID generation with constraints
			while (uuids.length < countNum) {
				uuids.push(getRandomUUID(startsWithLetter, startsWithNumber, false));
			}

			return c.json({ uuids });
		} catch (error) {
			console.error("Error generating UUID(s):", error);
			return c.json({ error: "Internal Server Error" }, 500);
		}
	}
}

function getRandomUUID(
	startsWithLetter: boolean,
	startsWithNumber: boolean,
	removeDashes: boolean
): string {
	let uuid: string = crypto.randomUUID();

	while (startsWithLetter && !/^[A-Za-z]/.test(uuid)) {
		uuid = crypto.randomUUID();
	}

	while (startsWithNumber && !/^[0-9]/.test(uuid)) {
		uuid = crypto.randomUUID();
	}

	return removeDashes ? uuid.replace(/-/g, "") : uuid;
}
