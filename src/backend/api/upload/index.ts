import Elysia, { t } from "elysia";

import { isAuthenticated } from "../auth/is-authenticated";
import { put } from "@vercel/blob";

export const uploadRoute = new Elysia({ prefix: "/upload" })
  .use(isAuthenticated)
  .post(
    "/media",
    async ({ body: { file } }) => {
      console.log("🚀 ~ file:", file);
      try {
        const blob = await put(file.name, file, {
          access: "public",
        });

        return blob.url;
      } catch (error) {
        console.error("Error on upload to Cloudinary:", error);
        return { error: "Error on upload" };
      }
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    }
  );
