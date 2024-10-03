import Elysia, { t } from "elysia";

import prisma from "@backend/lib/prisma";
import { isAuthenticated } from "../auth/is-authenticated";

export const restaurantsRoute = new Elysia({ prefix: "/restaurants" })
  .use(isAuthenticated)
  .get("/", async ({ error }) => {
    const restaurants = await prisma.restaurant.findMany();

    return restaurants;
  })
  .post(
    "/",
    async ({ body: { ...data } }) => {
      return await prisma.restaurant.create({
        data: {
          ...data,
          // event: {
          //   connect: (restaurantIds || []).map((item) => ({ id: item })),
          // },
        },
      });
    },
    {
      body: t.Object({
        name: t.String(),
        // description: t.String(),
        // date: t.Date(),
        // time: t.Optional(t.String()),
        // restaurantIds: t.Optional(t.Array(t.String())),
      }),
    }
  );
