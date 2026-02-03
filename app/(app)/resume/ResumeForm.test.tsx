import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ResumeForm } from "@/components/resume/ResumeForm";

describe("ResumeForm", () => {
  it("renders personal info step with required fields", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ profile: null }), { status: 200 })),
    );

    render(<ResumeForm />);

    expect(await screen.findByRole("heading", { name: "Personal info" })).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();

    const nextButtons = screen.getAllByRole("button", { name: "Next" });
    nextButtons.forEach((button) => expect(button).toBeDisabled());
  });

  it("advances to summary after basics are filled", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ profile: null }), { status: 200 })),
    );

    render(<ResumeForm />);

    fireEvent.change(await screen.findByLabelText("Full name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone"), {
      target: { value: "+1 555 0100" },
    });

    const nextButton = screen
      .getAllByRole("button", { name: "Next" })
      .find((button) => !button.hasAttribute("disabled"));
    expect(nextButton).toBeTruthy();
    fireEvent.click(nextButton!);

    expect(await screen.findByRole("heading", { name: "Summary" })).toBeInTheDocument();
    expect(screen.getByLabelText("Summary")).toBeInTheDocument();
  });

  it("adds experience bullets", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ profile: null }), { status: 200 })),
    );

    render(<ResumeForm />);

    fireEvent.change(await screen.findByLabelText("Full name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone"), {
      target: { value: "+1 555 0100" },
    });

    const firstNextButton = screen
      .getAllByRole("button", { name: "Next" })
      .find((button) => !button.hasAttribute("disabled"));
    expect(firstNextButton).toBeTruthy();
    fireEvent.click(firstNextButton!);
    fireEvent.change(await screen.findByLabelText("Summary"), {
      target: { value: "Focused engineer." },
    });
    const secondNextButton = screen
      .getAllByRole("button", { name: "Next" })
      .find((button) => !button.hasAttribute("disabled"));
    expect(secondNextButton).toBeTruthy();
    fireEvent.click(secondNextButton!);

    const addBulletButtons = screen.getAllByRole("button", { name: "Add bullet" });
    fireEvent.click(addBulletButtons[0]);

    const bulletInputs = screen.getAllByLabelText("Experience bullet");
    expect(bulletInputs.length).toBe(2);
  });
});
