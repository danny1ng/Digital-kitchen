export const graphQlMenuGroupsQuery = `
query GET_RESTAURANT {
    restaurant {
        guid
        menus {
            ...bffMenuFields
            menuGroups {
                ...bffMenuGroupFields
            }
        }
    }
}

fragment bffMenuFields on Menu {
    guid
    name
    ordinal
    archived
    availability {
        ...bffAvailabilityFields
    }
    menuGroupMasterIds
}

fragment bffMenuGroupFields on MenuGroup {
    name
    guid
    menuItemMasterIds
    archived
    masterId
    modifiers {
        modifierGroups
    }
}

fragment bffAvailabilityFields on MenuAvailability {
    schedules {
        availableAllDays
        availableAllTimes
    }
}
`;

export const graphQlMenuItemsQuery = `
query GET_MENU_ITEMS($menuGroupGuid: String!) {
    menuGroup(menuGroupGuid: $menuGroupGuid) {
        ...bffMenuGroupFields
        menuItems {
            ...bffMenuItemFields
            pointOfSale {
                color
                __typename
            }
            __typename
        }
        menuGroupMasterIds
        __typename
    }
}

fragment bffMenuGroupFields on MenuGroup {
    name
    guid
    menuItemMasterIds
    archived
    masterId
    modifiers {
        modifierGroups
        __typename
    }
    __typename
}

fragment bffMenuItemFields on MenuItem {
    guid
    calories
    description
    name
    masterId
    multiLocationId
    pricing {
        pricingStrategy
        basePrice
        inheritPricing
        minPrice
        maxPrice
        __typename
    }
    visibility {
        visibility
        orderableOnline
        __typename
    }
    image {
        imagePath
        __typename
    }
    modifiers {
        inheritModifierGroups
        modifierGroups
        inheritableModifierGroups {
            multiLocationId
            source {
                versionId
                entityType
                name
                __typename
            }
            __typename
        }
        __typename
    }
    __typename
}
`;
