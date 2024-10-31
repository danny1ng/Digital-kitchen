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
    const res = await fetch(API_URL + "/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

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
