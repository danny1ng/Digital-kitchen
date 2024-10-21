import { ToastApi } from "./toast-api";

export interface MenusToast {
  guid: string;
  name: string;
  groups: GroupMenuToast[];
}

interface CategoryMenuToast {
  guid: string;
  name: string;
  groups: Map<string, GroupMenuToast>;
}

export interface GroupMenuToast {
  guid: string;
  name: string;
  items: ItemMenuToast[];
}

export interface ItemMenuToast {
  guid: string;
  name: string;
  description: string;
  calories: number;
  imagePath: string; // image.imagePath
  pricing: {
    pricingStrategy: string;
    basePrice: number;
    inheritPricing: boolean;
    minPrice: number;
    maxPrice: number;
  };
}

export class ToastService {
  private readonly toastToken: string;
  private readonly restaurantGuid: string;
  private readonly managementSetGuid: string;

  constructor(
    toastToken: string,
    restaurantGuid: string,
    managementSetGuid: string
  ) {
    this.toastToken = toastToken;
    this.restaurantGuid = restaurantGuid;
    this.managementSetGuid = managementSetGuid;
  }

  public static FetchManagementSetGuid = async (
    toastToken: string,
    restaurantGuid: string
  ): Promise<string> => {
    const state = await ToastApi.fetchState(toastToken, restaurantGuid);
    if (!state?.managementSet?.guid) {
      console.error("No managementSetGuid in response from Toast.");
      throw new Error("No managementSetGuid in response from Toast.");
    }

    console.log("Fetched managementSetId.");
    return state.managementSet.guid;
  };

  public fetchAllMenuFromToast = async () => {
    console.log("Start fetching menu.");
    const categories = await this.fetchMenuGroups();

    const menu: MenusToast[] = [];
    for (const category of categories) {
      const groupsWithItems = await this.fetchMenuItemsForCategory(category);

      menu.push({
        guid: category.guid,
        name: category.name,
        groups: groupsWithItems,
      });
    }

    console.log("End fetching menu.");
    return menu;
  };

  private fetchMenuGroups = async (): Promise<CategoryMenuToast[]> => {
    const { restaurant } = await ToastApi.fetchMenuGroups(
      this.toastToken,
      this.restaurantGuid,
      this.managementSetGuid
    );

    console.log(
      "Fetched restaurant: ",
      restaurant?.guid,
      restaurant?.menus?.length
    );
    if (!restaurant?.menus?.length) {
      console.warn(`For restaurant ${this.restaurantGuid} menu is empty.`);
    }

    return restaurant["menus"].map((menu: any) => {
      const groups = new Map<string, GroupMenuToast>();
      menu.menuGroups.forEach((group: any) => {
        groups.set(group.guid, {
          guid: group.guid,
          name: group.name,
          items: [], //TODO refactor
        });
      });

      const newMenu: CategoryMenuToast = {
        guid: menu.guid,
        name: menu.name,
        groups,
      };

      return newMenu;
    });
  };

  private fetchMenuItemsForCategory = async (category: CategoryMenuToast) => {
    const groupIds = [...category.groups.keys()];

    const tasks = groupIds.map((groupId) =>
      ToastApi.fetchMenuItems(
        this.toastToken,
        this.restaurantGuid,
        this.managementSetGuid,
        groupId
      )
    );

    console.log(
      `Start fetch items for ${category.name} category: ${tasks.length}`
    );

    // TODO Split by 10 chunks ?
    const menuGroupsFromToast: any[] = await Promise.all(tasks);

    const groupsWithItems: GroupMenuToast[] = [];
    menuGroupsFromToast.forEach((elem) => {
      const group = category.groups.get(elem.menuGroup.guid);
      if (!group) {
        throw new Error("No group for items.");
      }

      group.items = elem.menuGroup.menuItems.map((item: any) => ({
        guid: item.guid,
        name: item.name,
        description: item.description,
        calories: item.calories,
        imagePath: item?.image?.imagePath,
        pricing: {
          basePrice: item.pricing.basePrice,
          inheritPricing: item.pricing.inheritPricing,
          minPrice: item.pricing.minPrice,
          maxPrice: item.pricing.maxPrice,
          pricingStrategy: item.pricing.pricingStrategy,
        },
      }));
      groupsWithItems.push(group);
    });

    return groupsWithItems;
  };
}
