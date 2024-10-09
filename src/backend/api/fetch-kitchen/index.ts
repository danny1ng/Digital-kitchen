import Elysia, { t } from "elysia";

import prisma from "@backend/lib/prisma";
import { isAuthenticated } from "../auth/is-authenticated";
import { Event, Prisma, Restaurant } from "@prisma/client";
import { ToastService } from "@backend/services/fetch-toast-tab-kitchen/toast-service";
import { message } from "antd";

interface IRestaurantData {
  restaurantId: number;
  restaurantGuid: string;
  toastToken: string;
  toastManagementSetGuid: string;
}

export const fetchKitchenRoute = new Elysia({ prefix: "/fetch" })
  .use(isAuthenticated)
  .post(
    "/toasttab",
    async ({ body: { toastToken, restaurantGuid, restaurantName } }) => {
      const managementSetGuid = await ToastService.FetchManagementSetGuid(
        toastToken,
        restaurantGuid
      );
      const restaurant = await prisma.restaurant.create({
        data: {
          name: restaurantName,
          toastToken: toastToken,
          toastManagementSetGuid: managementSetGuid,
          toastGuid: restaurantGuid,
        },
      });
      // restaurant = await DbHelper.CreateRestaurant(roleId, restaurantName, restaurantGuid, toastToken, managementSetGuid);
      // } else {
      // if (toastToken) {
      // await DbHelper.SaveToastToken(roleId, restaurantGuid, toastToken);
      // }
      // restaurant = await DbHelper.GetRestaurantByGuid(roleId, restaurantGuid);
      // }

      const toastService = new ToastService(
        restaurant.toastToken as string,
        restaurant.toastGuid as string,
        restaurant.toastManagementSetGuid as string
      );
      const menus = await toastService.fetchAllMenuFromToast();

      // if (type === OperationType.Create) {
      // return DbHelper.SaveAllMenu(roleId, fields, restaurant.restaurantId, menus);
      // } else {
      // return DbHelper.UpdateMenu(roleId, fields, restaurant.restaurantId, menus);
      // }
      return { message: "success", menus };
    },
    {
      body: t.Object({
        restaurantName: t.String(),
        toastToken: t.String(),
        restaurantGuid: t.String(),
      }),
    }
  );
