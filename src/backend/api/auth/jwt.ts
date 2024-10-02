import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

export const jwtSetup = new Elysia({ name: "jwtAccess" }).use(
  jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET as string,
  })
);
