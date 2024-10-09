import axios from "axios";
import { graphQlMenuGroupsQuery, graphQlMenuItemsQuery } from "./toast-queries";

const TOAST_URL = "https://www.toasttab.com/api/service/menus-bff/v1/graphql";
const TOAST_STATE_URL = "https://www.toasttab.com/account/session/state";

export abstract class ToastApi {
  public static fetchState = async (
    toastToken: string,
    restaurantGuid: string
  ) => {
    const headers = {
      accept: "*/*",
      "content-type": "application/json",
      authorization: `Bearer ${toastToken}`,
      "toast-restaurant-external-id": restaurantGuid,
    };

    try {
      console.log("Request to Toast API: fetch state");
      const response = await axios.get(TOAST_STATE_URL, { headers });
      return response?.data;
    } catch (err: any) {
      console.error(
        `Problem with fetching managementSetGuid and state from Toast: ${err.message}`
      );
      throw new Error(
        `Problem with fetching managementSetGuid and state from Toast: ${err.message}`
      );
    }
  };

  public static fetchMenuGroups = async (
    toastToken: string,
    restaurantGuid: string,
    managementSetGuid: string
  ) => {
    const body = {
      operationName: "GET_RESTAURANT",
      query: graphQlMenuGroupsQuery,
      variables: {},
    };

    try {
      console.log("Request to Toast API: fetch menus and menu groups");
      return ToastApi.exequteFetchRequest(
        toastToken,
        restaurantGuid,
        managementSetGuid,
        JSON.stringify(body)
      );
    } catch (err: any) {
      console.error(`Problem with getting Menu Groups: ${err.message}`);
      throw new Error(`Problem with getting Menu Groups: ${err.message}`);
    }
  };

  public static fetchMenuItems = async (
    toastToken: string,
    restaurantGuid: string,
    managementSetGuid: string,
    groupId: string
  ) => {
    const body = {
      operationName: "GET_MENU_ITEMS",
      query: graphQlMenuItemsQuery,
      variables: {
        menuGroupGuid: groupId,
      },
    };

    try {
      console.log("Request to Toast API: fetch menu items");
      return ToastApi.exequteFetchRequest(
        toastToken,
        restaurantGuid,
        managementSetGuid,
        JSON.stringify(body)
      );
    } catch (err: any) {
      console.error(`Problem with getting Menu Items: ${err.message}`);
      throw new Error(`Problem with getting Menu Items: ${err.message}`);
    }
  };

  private static exequteFetchRequest = async (
    toastToken: string,
    restaurantGuid: string,
    managementSetGuid: string,
    data: string
  ) => {
    const headers = {
      "content-type": "application/json",
      authorization: `Bearer ${toastToken}`,
      "restaurant-guid": restaurantGuid, //"47569b09-1bec-4907-8b03-bc30150e3b2e",
      "toast-management-set-guid": managementSetGuid, // "f449eb32-74c2-46ba-8c44-9504c2453f31",
      "toast-restaurant-external-id": restaurantGuid, // "47569b09-1bec-4907-8b03-bc30150e3b2e",
    };

    try {
      const response = await axios.post(TOAST_URL, data, { headers });
      return response.data.data;
    } catch (err: any) {
      throw new Error(`Problem fetch data from Toast: ${err.message}`);
    }
  };
}
