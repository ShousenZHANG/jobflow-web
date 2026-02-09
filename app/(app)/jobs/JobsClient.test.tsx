import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JobsClient } from "./JobsClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";

const baseJob = {
  id: "11111111-1111-1111-1111-111111111111",
  jobUrl: "https://example.com/job/1",
  title: "Frontend Engineer",
  company: "Acme",
  location: "Remote",
  jobType: "Full-time",
  jobLevel: "Mid",
  status: "NEW" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      {ui}
      <Toaster />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  const mockFetch = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.startsWith("/api/jobs?limit=50")) {
      return new Response(
        JSON.stringify({ items: [baseJob], nextCursor: null, facets: { jobLevels: ["Mid"] } }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.startsWith("/api/jobs?")) {
      return new Response(
        JSON.stringify({ items: [baseJob], nextCursor: null, facets: { jobLevels: ["Mid"] } }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.startsWith("/api/jobs/") && init?.method === "DELETE") {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.startsWith("/api/jobs/") && (!init || init.method === "GET")) {
      return new Response(
        JSON.stringify({ id: baseJob.id, description: "Job description" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(JSON.stringify({ error: "not mocked" }), { status: 500 });
  });

  vi.stubGlobal("fetch", mockFetch);
});

describe("JobsClient", () => {
  it("exposes ScrollArea component", () => {
    expect(ScrollArea).toBeDefined();
  });

  it("renders initial jobs", async () => {
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    expect((await screen.findAllByText("Frontend Engineer")).length).toBeGreaterThan(0);
  });

  it("shows sort and results in the top toolbar", () => {
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const toolbar = screen.getAllByTestId("jobs-toolbar")[0];
    expect(within(toolbar).getByTestId("jobs-sort")).toBeInTheDocument();
  });

  it("renders scroll areas for results and details", () => {
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    expect(screen.getAllByTestId("jobs-results-scroll")[0]).toBeInTheDocument();
    expect(screen.getAllByTestId("jobs-details-scroll")[0]).toBeInTheDocument();
  });

  it("applies the page-enter animation on the jobs shell", () => {
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const shell = screen.getAllByTestId("jobs-shell")[0];
    expect(shell).toHaveClass("edu-page-enter");
  });

  it("renders results without forcing virtualized mode", () => {
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const resultsPane = screen.getAllByTestId("jobs-results-scroll")[0];
    expect(resultsPane).toHaveAttribute("data-virtual", "false");
  });

  it("marks job items with performance-friendly list rendering", async () => {
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const jobButton = (await screen.findAllByRole("button", { name: /Frontend Engineer/i }))[0];
    expect(jobButton).toHaveAttribute("data-perf", "cv-auto");
  });

  it("shows a light loading overlay while keeping previous results", async () => {
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const resultsPane = screen.getAllByTestId("jobs-results-scroll")[0];
    expect(resultsPane).toHaveAttribute("data-loading", "false");
  });

  it("does not force no-store cache for jobs requests", async () => {
    const user = userEvent.setup();
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const toolbar = screen.getAllByTestId("jobs-toolbar")[0];
    const input = within(toolbar).getByPlaceholderText("e.g. software engineer");
    await user.clear(input);
    await user.type(input, "designer");
    await new Promise((resolve) => setTimeout(resolve, 220));

    const jobsCall = (global.fetch as unknown as { mock: { calls: Array<[RequestInfo, RequestInit | undefined]> } }).mock.calls.find(
      ([request]) =>
        typeof request === "string" && request.startsWith("/api/jobs?") && request.includes("q=designer"),
    );

    expect(jobsCall).toBeTruthy();
    expect(jobsCall?.[1]?.cache).not.toBe("no-store");
  });

  it("does not make a separate job-levels fetch request", async () => {
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    await screen.findAllByText("Frontend Engineer");

    const extraLevelsCalls = (
      global.fetch as unknown as { mock: { calls: Array<[RequestInfo]> } }
    ).mock.calls.filter(
      ([input]) => typeof input === "string" && input.startsWith("/api/jobs?limit=50"),
    );
    expect(extraLevelsCalls).toHaveLength(0);
  });

  it("updates keyword input as the user types", async () => {
    const user = userEvent.setup();
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const toolbar = screen.getAllByTestId("jobs-toolbar")[0];
    const input = within(toolbar).getByPlaceholderText("e.g. software engineer");
    await user.clear(input);
    await user.type(input, "designer");

    expect(input).toHaveValue("designer");
  });

  it("removes a job after delete confirmation", async () => {
    const user = userEvent.setup();
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const removeButton = (await screen.findAllByTestId("job-remove-button"))[0];
    await user.click(removeButton);
    const dialog = await screen.findByRole("alertdialog", { name: /delete this job/i });
    await user.click(within(dialog).getByRole("button", { name: /^delete$/i }));

    const resultsPane = screen.getAllByTestId("jobs-results-scroll")[0];
    await waitFor(() => {
      expect(
        within(resultsPane).queryByRole("button", { name: /Frontend Engineer/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("renders markdown with SaaS-style headings and lists", async () => {
    const markdown = "## Requirements\n\n- Ownership\n\n> Note";
    const mockFetch = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.url;
      if (url.startsWith("/api/jobs?limit=50")) {
        return new Response(
          JSON.stringify({ items: [baseJob], nextCursor: null, facets: { jobLevels: ["Mid"] } }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url.startsWith("/api/jobs?")) {
        return new Response(
          JSON.stringify({ items: [baseJob], nextCursor: null, facets: { jobLevels: ["Mid"] } }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (
        url.startsWith("/api/jobs/") &&
        (!init || !init.method || init.method === "GET")
      ) {
        return new Response(
          JSON.stringify({ id: baseJob.id, description: markdown }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ error: "not mocked" }), { status: 500 });
    });

    vi.stubGlobal("fetch", mockFetch);
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    await waitFor(() => {
      expect(screen.getAllByText("Job Description").length).toBeGreaterThan(0);
    });
    const heading = await screen.findByRole(
      "heading",
      { name: "Requirements" },
      { timeout: 3000 },
    );
    expect(heading).toHaveClass("text-base", "font-semibold", "text-slate-900");

    const listItem = await screen.findByText("Ownership");
    expect(listItem.closest("li")).toHaveClass("text-sm", "text-slate-700");

    const quotes = await screen.findAllByText("Note");
    const quote = quotes.find((node) => node.closest("blockquote")) ?? quotes[0];
    expect(quote.closest("blockquote")).toHaveClass("border-l-2");
  });

  it("keeps Saved CV in the primary actions row, removes its icon, and pins Remove to top-right", async () => {
    const jobWithSavedCv = {
      ...baseJob,
      id: "22222222-2222-2222-2222-222222222222",
      resumePdfUrl: "https://example.com/resume.pdf",
      resumePdfName: "resume.pdf",
    };

    renderWithClient(<JobsClient initialItems={[jobWithSavedCv]} initialCursor={null} />);

    const primaryActionsList = await screen.findAllByTestId("job-primary-actions");
    const primaryActionsWithSavedCv =
      primaryActionsList.find((node) =>
        within(node).queryByRole("link", { name: /saved cv/i }),
      ) ?? null;
    expect(primaryActionsWithSavedCv).toBeTruthy();
    if (!primaryActionsWithSavedCv) return;

    expect(
      within(primaryActionsWithSavedCv).getByRole("link", { name: /open job/i }),
    ).toBeInTheDocument();
    const savedCvLink = within(primaryActionsWithSavedCv).getByRole("link", { name: /saved cv/i });
    expect(savedCvLink.querySelector("svg")).toBeNull();

    const removeButton = screen.getAllByTestId("job-remove-button")[0];
    expect(removeButton).toHaveClass("sm:absolute", "sm:right-0", "sm:top-0");
  });

  it("disables skill pack download until prompt meta is ready, then advances to Copy Prompt with one click", async () => {
    const user = userEvent.setup();
    let resolvePrompt!: (value: Response) => void;
    const promptResponse = new Promise<Response>((resolve) => {
      resolvePrompt = resolve;
    });

    const createObjectUrlSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:skill-pack");
    const revokeObjectUrlSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    const mockFetch = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.url;
      if (url.startsWith("/api/jobs?limit=50")) {
        return new Response(
          JSON.stringify({ items: [baseJob], nextCursor: null, facets: { jobLevels: ["Mid"] } }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url.startsWith("/api/jobs?")) {
        return new Response(
          JSON.stringify({ items: [baseJob], nextCursor: null, facets: { jobLevels: ["Mid"] } }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url.startsWith("/api/jobs/") && (!init || init.method === "GET")) {
        return new Response(
          JSON.stringify({ id: baseJob.id, description: "Job description" }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url.startsWith("/api/applications/prompt")) {
        return promptResponse;
      }
      if (url.startsWith("/api/prompt-rules/skill-pack")) {
        return new Response(new Blob(["skill-pack"]), {
          status: 200,
          headers: {
            "content-disposition": 'attachment; filename="jobflow-skill-pack.tar.gz"',
          },
        });
      }
      return new Response(JSON.stringify({ error: "not mocked" }), { status: 500 });
    });
    vi.stubGlobal("fetch", mockFetch);

    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const generateCvButton = (await screen.findAllByRole("button", { name: /generate cv/i }))[0];
    await user.click(generateCvButton);

    const downloadButton = await screen.findByRole("button", {
      name: /preparing|download skill pack/i,
    });
    expect(downloadButton).toBeDisabled();

    resolvePrompt(
      new Response(
        JSON.stringify({
          prompt: {
            systemPrompt: "system",
            userPrompt: "user",
          },
          expectedJsonShape: { cvSummary: "string" },
          promptMeta: {
            ruleSetId: "rules-1",
            resumeSnapshotUpdatedAt: "2026-02-08T00:00:00.000Z",
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await waitFor(() => {
      expect(downloadButton).toBeEnabled();
    });

    await user.click(downloadButton);

    expect(await screen.findByText(/copy prompt and paste it/i)).toBeInTheDocument();
    expect(createObjectUrlSpy).toHaveBeenCalled();
    expect(revokeObjectUrlSpy).toHaveBeenCalled();
  });

});
