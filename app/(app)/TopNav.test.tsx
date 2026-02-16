import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TopNav } from "./TopNav";

const openGuideMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/jobs",
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { email: "test@example.com" } } }),
  signOut: vi.fn(),
}));

vi.mock("../GuideContext", () => ({
  useGuide: () => ({
    openGuide: openGuideMock,
    state: { completedCount: 2, totalCount: 5 },
  }),
}));

describe("TopNav", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not render duplicate route progress element", () => {
    const { container } = render(<TopNav />);
    expect(screen.getAllByRole("link", { name: "Jobs" }).length).toBeGreaterThan(0);
    expect(container.querySelector(".edu-route-progress")).toBeNull();
  });

  it("renders a dedicated mobile tab navigation fallback", () => {
    render(<TopNav />);

    const mobileTabs = screen.getAllByTestId("mobile-tab-nav")[0];
    expect(mobileTabs).toBeInTheDocument();
    expect(screen.getAllByTestId("mobile-tab-jobs")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("mobile-tab-fetch")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("mobile-tab-resume")[0]).toBeInTheDocument();
  });
});
