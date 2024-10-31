"use client";
import { AuthPage as AuthPageBase } from "@refinedev/antd";
import type { AuthPageProps } from "@refinedev/core";

export const AuthPage = (props: AuthPageProps) => {
  console.log("VERCEL_URL", process.env.VERCEL_URL);
  console.log("VERCEL_BRANCH_URL", process.env.VERCEL_BRANCH_URL);
  console.log(
    "VERCEL_PROJECT_PRODUCTION_URL",
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  );
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
