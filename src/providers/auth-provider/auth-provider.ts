"use client";

import type { AuthProvider } from "@refinedev/core";

export const authProvider: AuthProvider = {
  login: async ({ email, username, password, remember }) => {
    // Suppose we actually send a request to the back end here.
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/sign-in",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    const user = await res.json();

    if (res.ok && user) {
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  // forgotPassword: async (params) => {
  //   // Suppose we actually send a request to the back end here.
  //   const user = mockUsers.find((item) => item.email === params.email);

  //   if (user) {
  //     //we can send email with reset password link here
  //     return {
  //       success: true,
  //     };
  //   }
  //   return {
  //     success: false,
  //     error: {
  //       message: "Forgot password failed",
  //       name: "Invalid email",
  //     },
  //   };
  // },
  // updatePassword: async (params) => {
  //   // Suppose we actually send a request to the back end here.
  //   const isPasswordInvalid = params.password === "123456" || !params.password;

  //   if (isPasswordInvalid) {
  //     return {
  //       success: false,
  //       error: {
  //         message: "Update password failed",
  //         name: "Invalid password",
  //       },
  //     };
  //   }

  //   return {
  //     success: true,
  //   };
  // },
  logout: async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user = await res.json();

    if (res.ok && user) {
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
  getPermissions: async () => {
    // const auth = Cookies.get("auth");
    // if (auth) {
    //   const parsedUser = JSON.parse(auth);
    //   return parsedUser.roles;
    // }
    return null;
  },
  getIdentity: async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const user = await res.json();

    if (res.ok && user) {
      return user;
    }

    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
