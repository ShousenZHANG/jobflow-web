import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AiRulesForm } from "@/components/resume/AiRulesForm";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AiRulesForm", () => {
  it("renders rule textareas and saves", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo, init?: RequestInit) => {
        if (init?.method === "POST") {
          return new Response(JSON.stringify({ profile: { cvRules: ["A"], coverRules: ["B"] } }), {
            status: 200,
          });
        }
        return new Response(JSON.stringify({ profile: { cvRules: ["Rule A"], coverRules: ["Rule B"] } }), {
          status: 200,
        });
      }),
    );

    render(<AiRulesForm />);

    expect(await screen.findByLabelText("CV Rules (one rule per line)")).toBeInTheDocument();
    expect(screen.getByLabelText("Cover Letter Rules (one rule per line)")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("CV Rules (one rule per line)"), {
      target: { value: "New CV Rule" },
    });

    const saveButton = screen.getByRole("button", { name: "Save rules" });
    fireEvent.click(saveButton);
    expect(saveButton).toBeDisabled();
  });
});
