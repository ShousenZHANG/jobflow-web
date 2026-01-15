"use client";

import { RouteTransition } from "../RouteTransition";

export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}

