import Elysia from "elysia";

import prisma from "@backend/lib/prisma";
import { isAuthenticated } from "../auth/is-authenticated";

export const eventsRoute = new Elysia({ prefix: "/events" })
  .use(isAuthenticated)
  .get("/", async ({}) => {
    const events = await prisma.event.findMany();

    return events;
  });
