import Elysia, { t } from "elysia";

import prisma from "@backend/lib/prisma";
import { isAuthenticated } from "../auth/is-authenticated";
import { Event, Prisma } from "@prisma/client";

export const eventsRoute = new Elysia({ prefix: "/events" })
  .use(isAuthenticated)
  .get("/", async ({ error }) => {
    const events = await prisma.event.findMany();

    return events;
  })
  .post(
    "/",
    async ({ body: { restaurantIds, ...data } }) => {
      return await prisma.event.create({
        data: {
          ...data,
          restaurants: {
            connect: (restaurantIds || []).map((item) => ({ id: item })),
          },
        },
      });
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        date: t.Date(),
        time: t.Optional(t.String()),
        restaurantIds: t.Optional(t.Array(t.String())),
      }),
    }
  );
