import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

vi.mock("next/font/google", () => ({
  Fredoka: () => ({ variable: "--font-edu-display" }),
  Nunito: () => ({ variable: "--font-edu-body" }),
}));

describe("HomePage", () => {
  it("pre-fills the demo fields to avoid an empty flash", () => {
    render(<HomePage />);

    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("Mid-level")).toBeInTheDocument();
  });
});
