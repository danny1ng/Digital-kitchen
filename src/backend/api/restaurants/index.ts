import Elysia, { t } from "elysia";

import prisma from "@backend/lib/prisma";
import { isAuthenticated } from "../auth/is-authenticated";

export const restaurantsRoute = new Elysia({ prefix: "/restaurants" })
  .use(isAuthenticated)
  .get(
    "/",
    async ({ query: { name_like, id } }) => {
      const restaurants = await prisma.restaurant.findMany({
        where: { id, name: { contains: name_like, mode: "insensitive" } },
      });

      return restaurants;
    },
    {
      query: t.Object({
        id: t.Optional(t.String()),
        name_like: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const restaurant = await prisma.restaurant.findUnique({
        where: { id },
      });

      return restaurant;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      const restaurant = await prisma.restaurant.delete({
        where: { id },
      });

      return restaurant;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    "/",
    async ({ body: { ...data } }) => {
      return await prisma.restaurant.create({
        data: {
          ...data,
        },
      });
    },
    {
      body: t.Object({
        name: t.String(),
        toastToken: t.Optional(t.String()),
        toastManagementSetGuid: t.Optional(t.String()),
        toastGuid: t.Optional(t.String()),
      }),
    }
  )
  .patch(
    "/:id",
    async ({ body: { ...data }, params: { id } }) => {
      return await prisma.restaurant.update({
        data: {
          ...data,
        },
        where: { id },
      });
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.String(),
        toastToken: t.Optional(t.String()),
        toastManagementSetGuid: t.Optional(t.String()),
        toastGuid: t.Optional(t.String()),
      }),
    }
  );
