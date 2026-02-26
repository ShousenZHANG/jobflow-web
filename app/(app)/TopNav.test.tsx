import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TopNav } from "./TopNav";

const openGuideMock = vi.fn();
const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/jobs",
  useRouter: () => ({ push: pushMock }),
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
    expect(screen.getAllByRole("link", { name: "Automation" }).length).toBeGreaterThan(0);
    expect(container.querySelector(".edu-route-progress")).toBeNull();
  });

  it("renders a dedicated mobile route dropdown", () => {
    render(<TopNav />);

    expect(screen.getAllByTestId("mobile-route-select-wrap")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("mobile-route-select")[0]).toBeInTheDocument();
    expect(screen.queryByTestId("mobile-tab-nav")).not.toBeInTheDocument();
  });
});
