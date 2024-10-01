import Elysia from "elysia";

import prisma from "@backend/lib/prisma";

export const eventsRoute = new Elysia({ prefix: "/events" }).get(
  "/",
  async ({}) => {}
);
