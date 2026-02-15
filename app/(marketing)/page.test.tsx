import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import HomePage from "./page";

afterEach(cleanup);

describe("HomePage", () => {
  it("pre-fills the demo fields to avoid an empty flash", () => {
    render(<HomePage />);

    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("Mid-level")).toBeInTheDocument();
  });

  it("uses correct semantic structure with a single main landmark", () => {
    render(<HomePage />);

    const mains = screen.getAllByRole("main");
    expect(mains).toHaveLength(1);
  });

  it("renders all page sections", () => {
    render(<HomePage />);

    expect(
      screen.getByText("Everything you need to land the right role"),
    ).toBeInTheDocument();
    expect(screen.getByText("How it works")).toBeInTheDocument();
    expect(
      screen.getByText("Ready to find your next role?"),
    ).toBeInTheDocument();
  });

  it("includes a skip-to-content link for accessibility", () => {
    render(<HomePage />);

    const skipLink = screen.getByText("Skip to content");
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });
});
