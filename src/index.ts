import { fromHono } from "chanfana";
import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { GenerateUUIDRoute } from "./endpoints";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/docs",
});

// Register OpenAPI endpoints
openapi.get('/api/uuid', GenerateUUIDRoute);

// Serve static files from app/dist
app.use('/*', serveStatic({ root: './app/dist/' }));

// Export the Hono app
export default app;
