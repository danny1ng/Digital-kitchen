"use client";

import { dataProviderSimple } from "./data-provider-simple";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const dataProvider = dataProviderSimple(API_URL);
