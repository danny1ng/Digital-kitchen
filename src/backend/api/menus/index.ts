import Elysia, { t } from "elysia";

import prisma from "@backend/lib/prisma";
import { isAuthenticated } from "../auth/is-authenticated";

export const menusRoute = new Elysia({ prefix: "/menus" })
  .use(isAuthenticated)
  .get(
    "/",
    async ({ query: { name_like, id } }) => {
      const menus = await prisma.menu.findMany({
        include: {
          restaurant: {
            select: { name: true, id: true },
          },
          items: true,
        },
        where: { id },
      });

      return menus;
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
      const menu = await prisma.menu.findUnique({
        where: { id },
        include: {
          restaurant: {
            select: { name: true, id: true },
          },
          items: {
            include: { items: true },
          },
        },
      });

      return menu;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .patch(
    "/:id",
    async ({ body, params: { id } }) => {
      try {
        return await prisma.menu.update({
          include: {
            items: {
              include: {
                items: true,
              },
            },
          },
          data: {
            name: body.name,
            position: body.position,
            restaurantId: body.restaurantId,
            items: {
              deleteMany: {
                NOT: (body.items || []).map((group) => ({
                  id: group.id,
                })),
              },
              upsert: (body.items || []).map((group) => ({
                update: {
                  // name: group.name,
                  // items: {},
                },
                create: {
                  name: group.name,
                  guid: "qweqe",
                  items: {
                    create: (group.items || []).map((item) => {
                      return {
                        name: item.name,
                        // description: item.description,
                        // basePrice: item.basePrice,
                        // menuGroupId: item.menuGroupId,
                        // calories: item.calories,
                      };
                    }),
                  },
                },
                where: {
                  id: group.id,
                },
              })),
            },
          },
          where: { id },
        });
      } catch (error) {
        console.log("🚀 ~ error:", error);
        return error;
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.String(),
        position: t.Optional(t.Number()),
        restaurantId: t.String(),
        items: t.Optional(
          t.Array(
            t.Object({
              id: t.Optional(t.String()),
              name: t.String(),
              menuId: t.Optional(t.String()),
              items: t.Optional(
                t.Array(
                  t.Object({
                    id: t.Optional(t.String()),
                    name: t.String(),
                    description: t.Optional(t.String()),
                    menuGroupId: t.Optional(t.String()),
                    basePrice: t.Optional(t.Number()),
                    calories: t.Optional(t.Number()),
                  })
                )
              ),
            })
          )
        ),
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
