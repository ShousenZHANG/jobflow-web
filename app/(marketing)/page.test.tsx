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

  it("keeps the page animation off the main element to avoid scroll flash", () => {
    render(<HomePage />);

    const main = screen.getAllByRole("main")[0];
    expect(main).not.toHaveClass("edu-page-enter");
    const shell = screen.getAllByTestId("marketing-shell")[0];
    expect(shell).toHaveClass("edu-page-enter");
  });
});
