import Elysia, { t } from "elysia";

import prisma from "@backend/lib/prisma";
import { ToastService } from "@backend/services/fetch-toast-tab-kitchen/toast-service";
import { menus } from "./mock";
import { isRoles } from "../auth/is-role";

export const fetchKitchenRoute = new Elysia({ prefix: "/fetch" })
  .use(isRoles(["ADMIN"]))
  .post(
    "/toasttab",
    async ({ body: { toastToken, restaurantGuid, restaurantName } }) => {
      // const managementSetGuid = await ToastService.FetchManagementSetGuid(
      //   toastToken,
      //   restaurantGuid
      // );
      // FIXME: remove mock
      // const toastService = new ToastService(
      //   toastToken,
      //   restaurantGuid,
      //   managementSetGuid as string
      // );
      // const menus = await toastService.fetchAllMenuFromToast();

      await prisma.restaurant.upsert({
        where: { toastGuid: restaurantGuid },
        include: {
          menu: {
            include: {
              items: {
                include: {
                  items: true,
                },
              },
            },
          },
        },
        update: {
          toastToken: toastToken,
          menu: {
            upsert: menus.map((menu) => ({
              update: {
                items: {
                  upsert: menu.groups.map((group) => ({
                    update: {
                      items: {
                        connectOrCreate: group.items.map((item) => ({
                          create: {
                            name: item.name,
                            guid: item.guid,
                            description: item.description,
                            calories: item.calories,
                            basePrice: item.pricing.basePrice,
                            imageToast: item.imagePath,
                          },
                          where: {
                            guid: item.guid,
                          },
                        })),
                      },
                    },
                    create: {
                      name: group.name,
                      guid: group.guid,
                      items: {
                        connectOrCreate: group.items.map((item) => ({
                          create: {
                            name: item.name,
                            guid: item.guid,
                            description: item.description,
                            calories: item.calories,
                            basePrice: item.pricing.basePrice,
                            imageToast: item.imagePath,
                          },
                          where: {
                            guid: item.guid,
                          },
                        })),
                      },
                    },
                    where: {
                      guid: group.guid,
                    },
                  })),
                },
              },
              where: { guid: menu.guid },
              create: {
                name: menu.name,
                guid: menu.guid,
                items: {
                  connectOrCreate: menu.groups.map((group) => ({
                    create: {
                      name: group.name,
                      guid: group.guid,
                      items: {
                        connectOrCreate: group.items.map((item) => ({
                          create: {
                            name: item.name,
                            guid: item.guid,
                            description: item.description,
                            calories: item.calories,
                            basePrice: item.pricing.basePrice,
                            imageToast: item.imagePath,
                          },
                          where: {
                            guid: item.guid,
                          },
                        })),
                      },
                    },
                    where: {
                      guid: group.guid,
                    },
                  })),
                },
              },
            })),
          },
        },
        create: {
          name: restaurantName,
          // toastToken,
          // toastManagementSetGuid: managementSetGuid,
          toastGuid: restaurantGuid,
          menu: {
            connectOrCreate: menus.map((menu) => ({
              create: {
                name: menu.name,
                guid: menu.guid,
                items: {
                  connectOrCreate: menu.groups.map((group) => ({
                    create: {
                      name: group.name,
                      guid: group.guid,
                      items: {
                        connectOrCreate: group.items
                          .map((item) => ({
                            create: {
                              name: item.name,
                              guid: item.guid,
                            },
                            where: {
                              guid: item.guid,
                            },
                          }))
                          .slice(0, 30),
                      },
                    },
                    where: {
                      guid: group.guid,
                    },
                  })),
                },
              },
              where: {
                guid: menu.guid,
              },
            })),
          },
        },
      });

      // const restaurantFound = await prisma.restaurant
      //   .findUnique({
      //     where: { toastGuid: restaurantGuid },
      //   })
      //   .catch(() => null);

      // if (restaurantFound) {
      //   restaurant = await prisma.restaurant.update({
      //     where: { toastGuid: restaurantGuid },
      //     data: {
      //       name: restaurantName,
      //       toastToken: toastToken,
      //       toastManagementSetGuid: managementSetGuid,
      //       toastGuid: restaurantGuid,
      //     },
      //   });
      // } else {
      //   restaurant = await prisma.restaurant.create({
      //     data: {
      //       name: restaurantName,
      //       toastToken: toastToken,
      //       toastManagementSetGuid: managementSetGuid,
      //       toastGuid: restaurantGuid,
      //     },
      //   });
      // }
      // restaurant = await DbHelper.CreateRestaurant(roleId, restaurantName, restaurantGuid, toastToken, managementSetGuid);
      // } else {
      // if (toastToken) {
      // await DbHelper.SaveToastToken(roleId, restaurantGuid, toastToken);
      // }
      // restaurant = await DbHelper.GetRestaurantByGuid(roleId, restaurantGuid);
      // }

      // const formattedMenu = menus.map((menu) => {
      //   return {
      //     name: menu.name,
      //     guid: menu.guid,
      //   };
      // });

      // const menusData = prisma.menu.upse({
      //   data: formattedMenu,
      // });

      // await prisma.$transaction([menusData]);

      // await prisma.$disconnect();

      // if (type === OperationType.Create) {
      // return DbHelper.SaveAllMenu(roleId, fields, restaurant.restaurantId, menus);
      // } else {
      // return DbHelper.UpdateMenu(roleId, fields, restaurant.restaurantId, menus);
      // }
      return { message: "success" };
    },
    {
      body: t.Object({
        restaurantName: t.String(),
        toastToken: t.String(),
        restaurantGuid: t.String(),
      }),
    }
  );
