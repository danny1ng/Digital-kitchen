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

    if (!cookieAccessToken) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }

    console.log("🚀 ~ check: ~ API_URL + /user/me:", API_URL + "/user/me");
    console.log(
      "coosk",
      cookie.serialize(
        cookieAccessToken?.name || "",
        cookieAccessToken?.value || ""
      )
    );

    const { data } = await axios(API_URL + "/user/me", {
      headers: {
        "Content-Type": "application/json",
        cookie: cookie.serialize(
          cookieAccessToken?.name || "",
          cookieAccessToken?.value || ""
        ),
      },
      withCredentials: true,
    });
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
