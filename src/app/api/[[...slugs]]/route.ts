import { Elysia, t } from "elysia";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const app = new Elysia({ prefix: "/api" })
  .get("/", () => "hello Next")
  .post("/", ({ body }) => body, {
    body: t.Object({
      name: t.String(),
    }),
  });

export const GET = app.handle;
export const POST = app.handle;
