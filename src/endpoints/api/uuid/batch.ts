import { OpenAPIRoute } from 'chanfana';
import { z } from 'zod';
import { generateUUIDs } from '../../../lib/uuid';

export const MAX_BATCH_TOTAL = 200;

export class GenerateUUIDBatchRoute extends OpenAPIRoute {
  schema = {
    tags: ['UUID'],
    summary: 'Generate UUIDs in batch by type',
    description:
      'Generates up to 200 UUIDs in a single call, split by starting-character type: random, starting with a letter, and starting with a number.',
    parameters: [
      {
        name: 'randomCount',
        in: 'query' as const,
        description: 'Number of random UUIDs to generate (0 to 200). Defaults to 1.',
        required: false,
        schema: { type: 'integer' as const, minimum: 0, maximum: 200, default: 1 },
      },
      {
        name: 'letterCount',
        in: 'query' as const,
        description: 'Number of UUIDs starting with a letter (A-Z, a-z) to generate (0 to 200). Defaults to 1.',
        required: false,
        schema: { type: 'integer' as const, minimum: 0, maximum: 200, default: 1 },
      },
      {
        name: 'numberCount',
        in: 'query' as const,
        description: 'Number of UUIDs starting with a number (0-9) to generate (0 to 200). Defaults to 1.',
        required: false,
        schema: { type: 'integer' as const, minimum: 0, maximum: 200, default: 1 },
      },
    ],
    responses: {
      '200': {
        description: 'Successfully generated batched UUID(s)',
        content: {
          'application/json': {
            schema: {
              type: 'object' as const,
              properties: {
                random: {
                  type: 'array' as const,
                  items: { type: 'string' as const },
                },
                startsWithLetter: {
                  type: 'array' as const,
                  items: { type: 'string' as const },
                },
                startsWithNumber: {
                  type: 'array' as const,
                  items: { type: 'string' as const },
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'Invalid request parameters',
      },
      '500': {
        description: 'Internal Server Error',
      },
    },
  };

  async handle(c: any) {
    try {
      const url = new URL(c.req.url);

      const schema = z.object({
        randomCount: z.string().regex(/^\d+$/).default('1'),
        letterCount: z.string().regex(/^\d+$/).default('1'),
        numberCount: z.string().regex(/^\d+$/).default('1'),
      });

      const parsedParams = schema.safeParse({
        randomCount: url.searchParams.get('randomCount') ?? '1',
        letterCount: url.searchParams.get('letterCount') ?? '1',
        numberCount: url.searchParams.get('numberCount') ?? '1',
      });

      if (!parsedParams.success) {
        return c.json({ error: 'Invalid request parameters', details: parsedParams.error.format() }, 400);
      }

      const randomCount = parseInt(parsedParams.data.randomCount, 10);
      const letterCount = parseInt(parsedParams.data.letterCount, 10);
      const numberCount = parseInt(parsedParams.data.numberCount, 10);

      for (const [name, value] of [
        ['randomCount', randomCount],
        ['letterCount', letterCount],
        ['numberCount', numberCount],
      ] as const) {
        if (value < 0 || value > MAX_BATCH_TOTAL) {
          return c.json({ error: `'${name}' must be between 0 and ${MAX_BATCH_TOTAL}.` }, 400);
        }
      }

      const total = randomCount + letterCount + numberCount;
      if (total === 0) {
        return c.json({ error: 'At least one of randomCount, letterCount, or numberCount must be greater than 0.' }, 400);
      }
      if (total > MAX_BATCH_TOTAL) {
        return c.json({ error: `Total requested UUIDs (${total}) exceeds maximum of ${MAX_BATCH_TOTAL}.` }, 400);
      }

      return c.json({
        random: generateUUIDs(randomCount, false, false),
        startsWithLetter: generateUUIDs(letterCount, true, false),
        startsWithNumber: generateUUIDs(numberCount, false, true),
      });
    } catch (error) {
      console.error('Error generating batched UUID(s):', error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  }
}
