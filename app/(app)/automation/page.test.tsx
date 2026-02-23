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
    expect(screen.getByText(/\/api\/application-batches\/\{batchId\}\/run-once/)).toBeInTheDocument();
    expect(screen.getByText(/do NOT use \/api\/application-batches\/\{batchId\}\/execute/i)).toBeInTheDocument();
    expect(screen.getByText(/Download and Import Skill Pack/i)).toBeInTheDocument();
    expect(screen.getByText(/\/api\/prompt-rules\/skill-pack/)).toBeInTheDocument();
    const downloadButton = screen.getByRole("button", { name: /download skill pack/i });
    expect(downloadButton).toBeInTheDocument();
    expect(screen.getByText(/\/jobflow-run/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy prompt a/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy prompt b/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy prompt c/i })).toBeInTheDocument();
  });
});
