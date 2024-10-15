import Elysia, { t } from "elysia";

import prisma from "@backend/lib/prisma";
import { isAuthenticated } from "../auth/is-authenticated";
import { Event, Prisma } from "@prisma/client";

export const menusRoute = new Elysia({ prefix: "/menus" })
  .use(isAuthenticated)
  .get(
    "/",
    async ({ query: { name_like, id } }) => {
      // const events = await prisma.event.findMany({
      //   include: { restaurant: true },
      //   where: { id, title: { contains: name_like } },
      // });

      return [];
    },
    {
      query: t.Object({
        id: t.Optional(t.String()),
        name_like: t.Optional(t.String()),
      }),
    }
  );
// .get(
//   "/:id",
//   async ({ params: { id } }) => {
//     const event = await prisma.event.findUnique({
//       where: { id },
//       include: { restaurant: true },
//     });

//     return event;
//   },
//   {
//     params: t.Object({
//       id: t.String(),
//     }),
//   }
// )
// .delete(
//   "/:id",
//   async ({ params: { id } }) => {
//     const event = await prisma.event.delete({
//       where: { id },
//     });

//     return event;
//   },
//   {
//     params: t.Object({
//       id: t.String(),
//     }),
//   }
// )
// .post(
//   "/",
//   async ({ body: { restaurantId, ...data } }) => {
//     return await prisma.event.create({
//       data: {
//         ...data,
//         restaurant: {
//           connect: { id: restaurantId },
//         },
//       },
//     });
//   },
//   {
//     body: t.Object({
//       title: t.String(),
//       description: t.String(),
//       date: t.Date(),
//       time: t.Optional(t.String()),
//       restaurantId: t.Optional(t.String()),
//     }),
//   }
// )
// .patch(
//   "/:id",
//   async ({ body: { restaurantId, ...data }, params: { id } }) => {
//     return await prisma.event.update({
//       data: {
//         ...data,
//         restaurantId: restaurantId || null,
//       },
//       where: { id },
//     });
//   },
//   {
//     body: t.Object({
//       title: t.String(),
//       description: t.String(),
//       date: t.Date(),
//       time: t.Optional(t.String()),
//       restaurantId: t.Optional(t.String()),
//     }),
//   }
// );
