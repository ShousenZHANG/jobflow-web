import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AiProviderForm } from "@/components/resume/AiProviderForm";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AiProviderForm", () => {
  it("renders provider controls and saves", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo, init?: RequestInit) => {
        if (init?.method === "POST") {
          return new Response(
            JSON.stringify({ config: { provider: "gemini", model: null, hasKey: true } }),
            { status: 200 },
          );
        }
        return new Response(JSON.stringify({ config: null }), { status: 200 });
      }),
    );

    render(<AiProviderForm />);

    expect(await screen.findByText("AI provider")).toBeInTheDocument();
    expect(screen.getByLabelText("Model (optional)")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("API key"), {
      target: { value: "test-key" },
    });

    const saveButton = screen.getByRole("button", { name: "Save provider" });
    fireEvent.click(saveButton);
    expect(saveButton).toBeDisabled();
  });
});
