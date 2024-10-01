import type { AuthProvider } from "@refinedev/core";
import axios from "axios";
import cookie from "cookie";
import { cookies } from "next/headers";

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    const cookieStore = cookies();
    const cookieAccessToken = cookieStore.get("accessToken");

    if (!cookieAccessToken) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }

    const { data } = await axios(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/user/me",
      {
        headers: {
          "Content-Type": "application/json",
          cookie: cookie.serialize(
            cookieAccessToken?.name || "",
            cookieAccessToken?.value || ""
          ),
        },
        withCredentials: true,
      }
    );

    if (data) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
};
