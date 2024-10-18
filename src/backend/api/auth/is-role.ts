import Elysia from "elysia";

import { isAuthenticated } from "./is-authenticated";
import { Role } from "@prisma/client";

export const isRoles = (userRoles: Role[]) =>
  new Elysia({ name: "role-auth" })
    .use(isAuthenticated)
    .derive(async ({ error, user }) => {
      if (userRoles.some((role) => user.role != role)) {
        return error(403, {
          message: "Forbidden",
        });
      }

      return { user };
    })
    .as("plugin");
