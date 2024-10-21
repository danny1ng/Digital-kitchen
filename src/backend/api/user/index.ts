import Elysia from "elysia";

import { isAuthenticated } from "../auth/is-authenticated";

export const userRoute = new Elysia({ prefix: "/user" })
  .use(isAuthenticated)
  .get("/me", async ({ user }) => {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  });
