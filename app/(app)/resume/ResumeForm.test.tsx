import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ResumeForm } from "@/components/resume/ResumeForm";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ResumeForm", () => {
  const closePreviewIfOpen = () => {
    const closeButton = screen.queryByRole("button", { name: "Close" });
    if (closeButton) {
      fireEvent.click(closeButton);
    }
  };

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

    const previewButton = screen.getByRole("button", { name: "Preview" });
    expect(previewButton).toBeDisabled();
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

    closePreviewIfOpen();
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
    closePreviewIfOpen();
    fireEvent.change(await screen.findByLabelText("Summary"), {
      target: { value: "Focused engineer." },
    });
    const secondNextButton = screen
      .getAllByRole("button", { name: "Next" })
      .find((button) => !button.hasAttribute("disabled"));
    expect(secondNextButton).toBeTruthy();
    fireEvent.click(secondNextButton!);
    closePreviewIfOpen();

    const addBulletButtons = screen.getAllByRole("button", { name: "Add bullet" });
    fireEvent.click(addBulletButtons[0]);

    const bulletInputs = screen.getAllByLabelText("Experience bullet");
    expect(bulletInputs.length).toBe(2);
  });

  it("opens preview dialog from the preview button", async () => {
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

    const previewButton = screen.getByRole("button", { name: "Preview" });
    fireEvent.click(previewButton);
    expect(await screen.findByRole("heading", { name: "PDF preview" })).toBeInTheDocument();
  });

  it("exposes a stable guide anchor for the resume setup step", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ profile: null }), { status: 200 })),
    );

    const { container } = render(<ResumeForm />);
    expect(await screen.findByRole("heading", { name: "Personal info" })).toBeInTheDocument();
    expect(container.querySelector('[data-guide-anchor="resume_setup"]')).toBeTruthy();
  });
});
