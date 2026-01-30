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
        JSON.stringify({ items: [baseJob], nextCursor: null }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.startsWith("/api/jobs?")) {
      return new Response(
        JSON.stringify({ items: [baseJob], nextCursor: null }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
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

  it("marks the results list as virtualized", () => {
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const resultsPane = screen.getAllByTestId("jobs-results-scroll")[0];
    expect(resultsPane).toHaveAttribute("data-virtual", "true");
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

  it("debounces keyword changes before fetching", async () => {
    const user = userEvent.setup();

    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const toolbar = screen.getAllByTestId("jobs-toolbar")[0];
    const input = within(toolbar).getByPlaceholderText("e.g. software engineer");
    await user.clear(input);
    await user.type(input, "designer");

    const hasDesignerQuery = () =>
      (global.fetch as unknown as { mock: { calls: Array<[RequestInfo]> } }).mock.calls.some(
        ([input]) => typeof input === "string" && input.includes("q=designer"),
      );

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(hasDesignerQuery()).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 160));
    expect(hasDesignerQuery()).toBe(true);
  });

  it("removes a job immediately and offers undo", async () => {
    const user = userEvent.setup();
    renderWithClient(<JobsClient initialItems={[baseJob]} initialCursor={null} />);

    const removeButton = (await screen.findAllByRole("button", { name: /remove/i }))[0];
    await user.click(removeButton);

    const resultsPane = screen.getAllByTestId("jobs-results-scroll")[0];
    await waitFor(() => {
      expect(
        within(resultsPane).queryByRole("button", { name: /Frontend Engineer/i }),
      ).not.toBeInTheDocument();
    });
    const undoButtons = screen.getAllByRole("button", { name: /undo/i });
    expect(undoButtons.length).toBeGreaterThan(0);
  });

  
});
