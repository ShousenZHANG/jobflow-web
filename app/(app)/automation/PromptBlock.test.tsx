import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PromptBlock from "./PromptBlock";

describe("PromptBlock", () => {
  it("copies content with one click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<PromptBlock title="Prompt A" content="hello prompt" copyLabel="Copy Prompt A" />);
    fireEvent.click(screen.getByRole("button", { name: /copy prompt a/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("hello prompt");
    });
    expect(screen.getByText("Copied")).toBeInTheDocument();
  });
});

