"use client";

import { API_URL } from "@constants";
import { dataProviderSimple } from "./data-provider-simple";

export const dataProvider = dataProviderSimple(API_URL);
