import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ResumeForm } from "@/components/resume/ResumeForm";

describe("ResumeForm", () => {
  it("renders summary, skills, and experience inputs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ profile: null }), { status: 200 })),
    );

    render(<ResumeForm />);

    expect(await screen.findByLabelText("Summary")).toBeInTheDocument();
    expect(screen.getByLabelText("Skills")).toBeInTheDocument();
    expect(screen.getByLabelText("Experience title")).toBeInTheDocument();
    expect(screen.getByLabelText("Experience company")).toBeInTheDocument();
    expect(screen.getByLabelText("Experience location")).toBeInTheDocument();
    expect(screen.getByLabelText("Experience dates")).toBeInTheDocument();
    expect(screen.getByLabelText("Experience bullets")).toBeInTheDocument();
  });

  it("adds a new experience block", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ profile: null }), { status: 200 })),
    );

    render(<ResumeForm />);

    const addButtons = await screen.findAllByRole("button", { name: "Add experience" });
    fireEvent.click(addButtons[0]);

    const titles = screen.getAllByLabelText("Experience title");
    expect(titles.length).toBe(2);
  });
});
