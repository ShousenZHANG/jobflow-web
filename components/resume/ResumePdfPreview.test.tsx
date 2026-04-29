import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResumePdfPreview } from "./ResumePdfPreview";

type MockPdfDocument = {
  numPages: number;
  url: string;
  destroy: ReturnType<typeof vi.fn>;
};

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

const reactPdfMock = vi.hoisted(() => ({
  getDocument: vi.fn(),
  pageMountCount: 0,
  pageUnmountCount: 0,
}));

vi.mock("react-pdf", async () => {
  const React = await import("react");

  return {
    pdfjs: {
      GlobalWorkerOptions: {},
      getDocument: reactPdfMock.getDocument,
    },
    Page: ({
      pdf,
      pageNumber,
      width,
    }: {
      pdf: MockPdfDocument;
      pageNumber: number;
      width: number;
    }) => {
      const mountId = React.useRef(++reactPdfMock.pageMountCount);

      React.useEffect(() => {
        return () => {
          reactPdfMock.pageUnmountCount += 1;
        };
      }, []);

      return (
        <div
          data-testid={`pdf-page-${pageNumber}`}
          data-doc-url={pdf.url}
          data-mount-id={mountId.current}
          style={{ width }}
        >
          {pdf.url}
        </div>
      );
    },
  };
});

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function createDocument(url: string, numPages = 1): MockPdfDocument {
  return {
    numPages,
    url,
    destroy: vi.fn(),
  };
}

function queuePdfLoad(deferred: Deferred<MockPdfDocument>) {
  const destroy = vi.fn();
  reactPdfMock.getDocument.mockReturnValueOnce({
    promise: deferred.promise,
    destroy,
  });
  return destroy;
}

describe("ResumePdfPreview", () => {
  beforeEach(() => {
    reactPdfMock.getDocument.mockReset();
    reactPdfMock.pageMountCount = 0;
    reactPdfMock.pageUnmountCount = 0;
  });

  afterEach(() => {
    cleanup();
  });

  it("keeps the current rendered page mounted while a replacement PDF is still loading", async () => {
    const firstLoad = createDeferred<MockPdfDocument>();
    const secondLoad = createDeferred<MockPdfDocument>();
    queuePdfLoad(firstLoad);

    const { rerender } = render(<ResumePdfPreview pdfUrl="blob:first" />);

    await act(async () => {
      firstLoad.resolve(createDocument("blob:first"));
      await firstLoad.promise;
    });

    const firstPage = await screen.findByTestId("pdf-page-1");
    const firstMountId = firstPage.getAttribute("data-mount-id");
    expect(firstPage).toHaveAttribute("data-doc-url", "blob:first");

    queuePdfLoad(secondLoad);
    rerender(<ResumePdfPreview pdfUrl="blob:second" />);

    const stillVisiblePage = screen.getByTestId("pdf-page-1");
    expect(stillVisiblePage).toHaveAttribute("data-doc-url", "blob:first");
    expect(stillVisiblePage).toHaveAttribute("data-mount-id", firstMountId);
    expect(reactPdfMock.pageUnmountCount).toBe(0);

    await act(async () => {
      secondLoad.resolve(createDocument("blob:second"));
      await secondLoad.promise;
    });

    await waitFor(() => {
      expect(screen.getByTestId("pdf-page-1")).toHaveAttribute("data-doc-url", "blob:second");
    });
  });
});
