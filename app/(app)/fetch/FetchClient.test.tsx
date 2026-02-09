import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FetchClient } from "./FetchClient";

const pushMock = vi.fn();
const startRunMock = vi.fn();
const markRunningMock = vi.fn();
const markTaskCompleteMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {
      user: {
        id: "user-1",
      },
    },
  }),
}));

vi.mock("@/app/GuideContext", () => ({
  useGuide: () => ({
    isTaskHighlighted: () => false,
    markTaskComplete: markTaskCompleteMock,
  }),
}));

vi.mock("@/app/FetchStatusContext", () => ({
  useFetchStatus: () => ({
    startRun: startRunMock,
    markRunning: markRunningMock,
    status: null,
    runId: null,
    error: null,
    open: false,
    setOpen: vi.fn(),
    cancelRun: vi.fn(),
    importedCount: 0,
    elapsedSeconds: 0,
  }),
}));

describe("FetchClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    pushMock.mockReset();
    startRunMock.mockReset();
    markRunningMock.mockReset();
    markTaskCompleteMock.mockReset();

    const fetchMock = vi.fn(async (input: RequestInfo, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.url;
      if (url === "/api/fetch-runs" && init?.method === "POST") {
        return new Response(JSON.stringify({ id: "run-1" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url === "/api/fetch-runs/run-1/trigger" && init?.method === "POST") {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "not mocked" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  it("does not start a page-level polling interval after submitting fetch", async () => {
    const user = userEvent.setup();
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");

    render(<FetchClient />);

    await user.click(screen.getByRole("button", { name: /start fetch/i }));

    await waitFor(() => {
      expect(startRunMock).toHaveBeenCalledWith("run-1");
    });

    expect(markRunningMock).toHaveBeenCalled();
    const pollingCalls = setIntervalSpy.mock.calls.filter((call) => call[1] === 3000);
    expect(pollingCalls).toHaveLength(0);
  });
});
