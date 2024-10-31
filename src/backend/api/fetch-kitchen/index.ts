import Elysia, { t } from "elysia";

import prisma from "@backend/lib/prisma";
import {
  MenusToast,
  ToastService,
} from "@backend/services/fetch-toast-tab-kitchen/toast-service";
import { menus } from "./mock";
import { isRoles } from "../auth/is-role";

const getFilteredItem = ({
  fields,
  item,
}: {
  fields: string[] | null;
  item: any;
}) =>
  fields?.length === 0
    ? item // Include all fields if supportedFields is empty
    : Object.fromEntries(
        Object.entries(item).filter(([key]) => fields?.includes(key as any))
      );

const fetchKitchen = async ({
  toastToken,
  restaurantGuid,
  restaurantName,
  fields = [],
  menus,
}: {
  menus: MenusToast[];
  fields?:
    | ("name" | "description" | "imageToast" | "calories" | "basePrice")[]
    | null;
  restaurantName?: string | null | undefined;
  restaurantGuid: string;
  toastToken: string;
}) => {
  await prisma.$transaction(
    async (tx) => {
      // Упрощенный upsert для ресторана
      const restaurant = await tx.restaurant.upsert({
        where: { toastGuid: restaurantGuid },
        include: { menu: true },
        update: { toastToken: toastToken },
        create: {
          name: restaurantName || "",
          toastGuid: restaurantGuid,
        },
      });

      for (const menu of menus) {
        const menuPrisma = await tx.menu.upsert({
          where: { guid: menu.guid },
          create: {
            name: menu.name,
            guid: menu.guid,
            restaurantId: restaurant.id,
          },
          update: { name: menu.name },
        });

        // Обработка групп меню
        const groupPromises = menu.groups.map(async (group) => {
          const menuGroupPrisma = await tx.menuGroup.upsert({
            where: { guid: group.guid },
            create: {
              name: group.name,
              guid: group.guid,
              menuId: menuPrisma.id,
            },
            update: { name: group.name },
          });

          // Собираем операции создания элементов меню
          const itemPromises = group.items.map(async (item) => {
            const existingItem = await tx.menuItem.findFirst({
              where: { guid: item.guid, menuGroupId: menuGroupPrisma.id },
            });

            if (existingItem) {
              const filteredItem = getFilteredItem({
                item: {
                  name: item.name,
                  description: item.description,
                  calories: item.calories,
                  basePrice: item.pricing.basePrice,
                  imageToast: item.imagePath,
                },
                fields,
              });
              return tx.menuItem.update({
                where: { id: existingItem.id },
                data: filteredItem,
              });
            } else {
              return tx.menuItem.create({
                data: {
                  name: item.name,
                  guid: item.guid,
                  description: item.description,
                  calories: item.calories,
                  basePrice: item.pricing.basePrice,
                  imageToast: item.imagePath,
                  menuGroupId: menuGroupPrisma.id,
                },
              });
            }
          });

          await Promise.all(itemPromises);
        });

        await Promise.all(groupPromises);
      }
    },
    { timeout: 30000 }
  );
};

export const fetchKitchenRoute = new Elysia({ prefix: "/fetch" })
  .use(isRoles(["ADMIN"]))
  .post(
    "/toasttab",
    async ({
      body: { toastToken, restaurantGuid, restaurantName, fields = [] },
    }) => {
      const managementSetGuid = await ToastService.FetchManagementSetGuid(
        toastToken,
        restaurantGuid
      );

      const toastService = new ToastService(
        toastToken,
        restaurantGuid,
        managementSetGuid as string
      );
      const menus = await toastService.fetchAllMenuFromToast();

      await fetchKitchen({
        menus: menus as any,
        toastToken,
        restaurantGuid,
        restaurantName,
        fields,
      });

      return { message: "success" };
    },
    {
      body: t.Object({
        restaurantName: t.Optional(t.MaybeEmpty(t.String())),
        toastToken: t.String(),
        restaurantGuid: t.String(),
        fields: t.Optional(
          t.MaybeEmpty(
            t.Array(
              t.Union([
                t.Literal("name"),
                t.Literal("description"),
                t.Literal("imageToast"),
                t.Literal("calories"),
                t.Literal("basePrice"),
              ])
            )
          )
        ),
      }),
    }
  );
