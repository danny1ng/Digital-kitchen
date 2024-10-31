import { API_URL } from "@constants";
import { Role } from "@prisma/client";
import type { AuthProvider } from "@refinedev/core";
import axios from "axios";
import cookie from "cookie";
import { cookies } from "next/headers";

export const authProviderServer = {
  check: async ({ roles }: { roles: Role[] }) => {
    const cookieStore = cookies();
    const cookieAccessToken = cookieStore.get("accessToken");
    console.log("🚀 ~ check: ~ cookieAccessToken:", cookieAccessToken);

    if (!cookieAccessToken) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }
    console.log("axios start");
    const { data } = await axios
      .get(API_URL + "/user/me", {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieAccessToken
            ? `${cookieAccessToken.name}=${cookieAccessToken.value}`
            : "",
        },
      })
      .catch((e) => {
        console.log(e);
        return { data: null };
      });

    console.log("🚀 ~ check: ~ data:", data);
    if (data && roles.includes(data.role)) {
      return {
        authenticated: true,
      };
    }
    if (data && !roles.includes(data.role)) {
      return {
        authenticated: false,
        error: "Forbidden",
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: "Unauthorized",
    };
  },
};
