import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouteTransition } from "./RouteTransition";

const capturedMainProps: Record<string, unknown>[] = [];

vi.mock("next/navigation", () => ({
  usePathname: () => "/jobs",
}));

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    main: ({ children, ...props }: React.ComponentProps<"main">) => {
      capturedMainProps.push(props as Record<string, unknown>);
      return <main {...props}>{children}</main>;
    },
  },
  useReducedMotion: () => false,
}));

describe("RouteTransition", () => {
  it("uses fade-only motion without vertical shift", () => {
    capturedMainProps.length = 0;

    render(
      <RouteTransition>
        <div>Content</div>
      </RouteTransition>,
    );

    const main = screen.getAllByRole("main")[0];
    expect(main).toHaveAttribute("data-route-transition", "fade");

    const mainProps = capturedMainProps[0] ?? {};
    expect(mainProps.initial).toEqual({ opacity: 0 });
    expect(mainProps.animate).toEqual({ opacity: 1 });
    expect(mainProps.exit).toEqual({ opacity: 0 });
  });
});
