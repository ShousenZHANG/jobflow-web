import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SkillPackDownloadButton from "./SkillPackDownloadButton";

describe("SkillPackDownloadButton", () => {
  it("downloads skill pack through fetch without navigation link", async () => {
    const user = userEvent.setup();
    const createObjectUrlSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:skill-pack");
    const revokeObjectUrlSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const fetchMock = vi.fn(async () => {
      return new Response(new Blob(["skill-pack"]), {
        status: 200,
        headers: {
          "content-disposition": 'attachment; filename="jobflow-skill-pack.tar.gz"',
        },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<SkillPackDownloadButton />);
    const button = screen.getByRole("button", { name: /download skill pack/i });
    await user.click(button);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/prompt-rules/skill-pack", { cache: "no-store" });
    });
    expect(createObjectUrlSpy).toHaveBeenCalled();
    expect(revokeObjectUrlSpy).toHaveBeenCalled();
  });
});
