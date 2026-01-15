"use client";

import { RouteTransition } from "../RouteTransition";

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}

