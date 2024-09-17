import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";
import { jwt } from "@elysiajs/jwt";
import { getExpTimestamp } from "@lib/get-exp-timestamp";
import { ACCESS_TOKEN_EXP } from "@constants";

const prisma = new PrismaClient();

const app = new Elysia({ prefix: "/api/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "secret1234321222",
    })
  )
  .post(
    "/sign-in",
    async ({ body, jwt, cookie: { accessToken, refreshToken }, set }) => {
      const user = await prisma.user.findUnique({
        where: { email: body.email },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (!user) {
        set.status = "Bad Request";
        throw new Error(
          "The email address or password you entered is incorrect"
        );
      }
      const matchPassword = await Bun.password.verify(
        body.password,
        user.password,
        "bcrypt"
      );
      if (!matchPassword) {
        set.status = "Bad Request";
        throw new Error(
          "The email address or password you entered is incorrect"
        );
      }
      // create access token
      const accessJWTToken = await jwt.sign({
        sub: user.id,
        exp: getExpTimestamp(ACCESS_TOKEN_EXP),
      });
      accessToken.set({
        value: accessJWTToken,
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXP,
        path: "/",
      });

      return {
        message: "Sig-in successfully",
        data: {
          user: {
            id: user.id,
            email: user.email,
          },
        },
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )
  .post("/logout", async (c) => {
    return {
      message: "Logout successfully",
    };
  })
  .get("/me", (c) => {
    return {
      message: "Fetch current user",
    };
  });

export const GET = app.handle;
export const POST = app.handle;
