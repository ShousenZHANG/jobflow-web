import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouteTransition } from "./RouteTransition";

vi.mock("next/navigation", () => ({
  usePathname: () => "/jobs",
}));

describe("RouteTransition", () => {
  it("uses the fade-scale transition marker", () => {
    if (!window.matchMedia) {
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
      });
    }

    render(
      <RouteTransition>
        <div>Content</div>
      </RouteTransition>,
    );

    const main = screen.getAllByRole("main")[0];
    expect(main).toHaveAttribute("data-route-transition", "fade-scale");
  });
});
