import { authRoute } from "@backend/api/auth";
import { createElysia } from "@backend/api/elysia";
import { eventsRoute } from "@backend/api/events";
import { userRoute } from "@backend/api/user";
import { cron } from "@elysiajs/cron";
import { logger } from "@bogeychan/elysia-logger";

/**
 * Main API router
 * Combines auth and user routes under the '/api' prefix
 */
const app = createElysia({ prefix: "/api" })
  .use(
    logger({
      autoLogging: true,
    })
  )
  .use(authRoute)
  .use(userRoute)
  .use(eventsRoute);

/**
 * Export the app type for use with RPC clients (e.g., edenTreaty)
 */
export type App = typeof app;

/**
 * Export handlers for different HTTP methods
 * These are used by Next.js API routes [[...route]].ts
 */
export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;
