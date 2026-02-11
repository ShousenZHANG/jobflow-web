import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  it("does not render duplicate route progress element", () => {
    const { container } = render(<TopNav />);
    expect(screen.getByRole("link", { name: "Jobs" })).toBeInTheDocument();
    expect(container.querySelector(".edu-route-progress")).toBeNull();
  });
});

