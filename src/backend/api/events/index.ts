import Elysia, { t } from "elysia";

import prisma from "@backend/lib/prisma";
import { isAuthenticated } from "../auth/is-authenticated";
import { Event, Prisma } from "@prisma/client";

export const eventsRoute = new Elysia({ prefix: "/events" })
  .use(isAuthenticated)
  .get(
    "/",
    async ({ query: { name_like } }) => {
      const events = await prisma.event.findMany({
        include: { restaurants: true },
        where: { title: { contains: name_like } },
      });

      return events;
    },
    {
      query: t.Object({
        name_like: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/:id",
    async ({ params: { id, name_like } }) => {
      const event = await prisma.event.findUnique({
        where: { id },
        include: { restaurants: true },
      });

      return event;
    },
    {
      params: t.Object({
        id: t.String(),
        name_like: t.Optional(t.String()),
      }),
    }
  )
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
  )
  .patch(
    "/:id",
    async ({ body: { restaurantIds, ...data }, params: { id } }) => {
      return await prisma.event.update({
        data: {
          ...data,
          restaurants:
            (restaurantIds || []).length > 0
              ? {
                  connect: (restaurantIds || []).map((item) => ({ id: item })),
                }
              : { set: [] },
        },
        where: { id },
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
