import Elysia, { t } from "elysia";

import prisma from "@backend/lib/prisma";
import { isAuthenticated } from "../auth/is-authenticated";

export const menusRoute = new Elysia({ prefix: "/menus" })
  .use(isAuthenticated)
  .get(
    "/",
    async ({ query: { name_like, id } }) => {
      const menus = await prisma.menu.findMany({
        orderBy: { createdAt: "asc" },
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
        const [menu] = await prisma.$transaction([
          prisma.menu.update({
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
                  NOT: body.items?.map((group) => ({ id: group.id })),
                },
                update: (body.items || [])
                  .filter((group) => group.id)
                  .map((group) => ({
                    data: {
                      name: group.name,
                      items: {
                        deleteMany: {
                          NOT: group.items?.map((group) => ({ id: group.id })),
                        },
                        update: (group.items || [])
                          .filter((item) => item.id)
                          .map((item) => ({
                            data: {
                              name: item.name,
                              description: item.description,
                              basePrice: item.basePrice,
                              calories: item.calories,
                              imageToast: item.imageToast,
                            },
                            where: {
                              id: item.id,
                            },
                          })),
                        create: (group.items || [])
                          .filter((item) => !item.id)
                          .map((item) => ({
                            name: item.name,
                            description: item.description,
                            basePrice: item.basePrice,
                            calories: item.calories,
                            imageToast: item.imageToast,
                          })),
                      },
                    },
                    where: {
                      id: group.id,
                    },
                  })),
                create: (body.items || [])
                  .filter((group) => !group.id)
                  .map((group) => ({
                    name: group.name,
                    items: {
                      create: (group.items || []).map((item) => ({
                        name: item.name,
                        description: item.description,
                        basePrice: item.basePrice,
                        calories: item.calories,
                        imageToast: item.imageToast,
                      })),
                    },
                  })),
              },
            },
            where: { id },
          }),
          prisma.menuItem.deleteMany({
            where: {
              menuGroupId: null,
            },
          }),
        ]);
        return menu;
      } catch (error) {
        console.log("🚀 ~ error:", error);
        return error;
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        name: t.String(),
        position: t.Optional(t.Nullable(t.Number())),
        restaurantId: t.String(),
        items: t.Optional(
          t.Array(
            t.Object({
              id: t.Optional(t.String()),
              guid: t.Optional(t.Nullable(t.String())),
              name: t.String(),
              menuId: t.Optional(t.String()),
              items: t.Optional(
                t.Array(
                  t.Object({
                    id: t.Optional(t.String()),
                    guid: t.Optional(t.Nullable(t.String())),
                    name: t.String(),
                    description: t.Optional(t.Nullable(t.String())),
                    imageToast: t.Optional(t.Nullable(t.String())),
                    basePrice: t.Optional(t.Nullable(t.Number())),
                    calories: t.Optional(t.Nullable(t.Number())),
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
