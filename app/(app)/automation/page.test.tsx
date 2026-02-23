import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AutomationPage from "./page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next-auth/next", () => ({
  getServerSession: vi.fn(async () => ({ user: { id: "user-1" } })),
}));

vi.mock("@/auth", () => ({
  authOptions: {},
}));

describe("AutomationPage", () => {
  it("renders enterprise runbook prompts in English", async () => {
    const ui = await AutomationPage();
    render(ui);

    expect(screen.getByText("Cursor + Codex Automation Setup")).toBeInTheDocument();
    expect(screen.getByText("Prompt A - Setup Verification")).toBeInTheDocument();
    expect(screen.getByText("Prompt B - Full Batch Execution")).toBeInTheDocument();
    expect(screen.getByText("Prompt C - Retry Failed")).toBeInTheDocument();
    expect(screen.getByText(/PLAYWRIGHT_MCP_EXTENSION_TOKEN/)).toBeInTheDocument();
  });
});
