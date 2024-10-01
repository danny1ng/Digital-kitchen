import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";

import prisma from "@backend/lib/prisma";

export const userRoute = new Elysia({ prefix: "/user" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "secret1234321222",
    })
  )
  .get("/me", async ({ jwt, cookie: { accessToken }, set }) => {
    const token = await jwt.verify((accessToken.cookie.value as string) || "");

    if (!token) {
      set.status = "Unauthorized";
      return { message: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: (token as any)?.sub },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      set.status = "Unauthorized";
      return { message: "Unauthorized" };
    }

    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    };
  });
