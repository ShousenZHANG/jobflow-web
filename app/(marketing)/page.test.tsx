import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import HomePage from "./page";
import messages from "../../messages/en.json";

// Mock next-intl/server for server component
vi.mock("next-intl/server", () => ({
  getTranslations: (ns: string) => {
    return Promise.resolve((key: string) => {
      const map = messages as Record<string, Record<string, string>>;
      return map[ns]?.[key] ?? `${ns}.${key}`;
    });
  },
}));

afterEach(cleanup);

async function renderPage() {
  const Page = await HomePage();
  return render(
    <SessionProvider session={null}>
      <NextIntlClientProvider locale="en" messages={messages}>
        {Page}
      </NextIntlClientProvider>
    </SessionProvider>,
  );
}

describe("HomePage", () => {
  it("renders the new hero title and tailoring demo card", async () => {
    await renderPage();

    // Text-generate effect splits title into words — check for key word
    expect(screen.getByText(/AI-tailored/i)).toBeInTheDocument();
    // TailoringDemoCard shows search or JD content
    expect(screen.getByText(/Live demo|Frontend Engineer/i)).toBeInTheDocument();
  });

  it("uses correct semantic structure with a single main landmark", async () => {
    await renderPage();

    const mains = screen.getAllByRole("main");
    expect(mains).toHaveLength(1);
  });

  it("renders CTA linking to login", async () => {
    await renderPage();

    const ctaLinks = screen.getAllByRole("link", { name: /Start free/i });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
    expect(ctaLinks[0]).toHaveAttribute("href", "/login");
  });

  it("includes a skip-to-content link for accessibility", async () => {
    await renderPage();

    const skipLink = screen.getByText("Skip to content");
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });
});
