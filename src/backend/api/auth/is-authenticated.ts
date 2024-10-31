import Elysia from "elysia";

import prisma from "@backend/lib/prisma";
import { jwtSetup } from "./jwt";

export const isAuthenticated = new Elysia({ name: "jwt-auth" })
  .use(jwtSetup)
  .derive(async ({ error, cookie: { accessToken, ...cookie }, jwt }) => {
    console.log("🚀 ~ .derive ~ cookie:", cookie);
    console.log("🚀 ~ .derive ~ accessToke2n2:", accessToken.cookie.value);
    console.log("🚀 ~ .derive ~ accessToken:", accessToken);
    const token = await jwt.verify((accessToken.cookie.value as string) || "");
    console.log("🚀 ~ .derive ~ token:", token);

    if (!token) {
      accessToken.remove();
      return error(401, {
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: (token as any)?.sub },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    console.log("🚀 ~ .derive ~ user:", user);

    if (!user) {
      accessToken.remove();
      return error(401, {
        message: "Unauthorized",
      });
    }

    return { user };
  })
  .as("plugin");
