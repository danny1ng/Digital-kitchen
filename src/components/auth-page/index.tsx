"use client";
import { AuthPage as AuthPageBase } from "@refinedev/antd";
import type { AuthPageProps } from "@refinedev/core";

export const AuthPage = (props: AuthPageProps) => {
  console.log("API_URL", process.env.API_URL);
  console.log("VERCEL_ENV", process.env.VERCEL_ENV);
  console.log(
    "NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL",
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  );
  console.log(
    "NEXT_PUBLIC_VERCEL_BRANCH_URL",
    process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
  );
  console.log("NEXT_PUBLIC_VERCEL_URL", process.env.NEXT_PUBLIC_VERCEL_URL);
  console.log("NEXT_PUBLIC_VERCEL_URL", process.env.NEXT_PUBLIC_VERCEL_URL);
  return (
    <AuthPageBase
      {...props}
      formProps={{
        initialValues: {
          email: "admin@admin.io",
          password: "123123123",
        },
      }}
    />
  );
};
