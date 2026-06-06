import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { ExportActions } from "../components/ExportActions";

const { downloadCsv } = vi.hoisted(() => ({
  downloadCsv: vi.fn()
}));

vi.mock("../lib/download", () => ({
  downloadCsv
}));

describe("ExportActions", () => {
  beforeEach(() => {
    downloadCsv.mockClear();
  });

  it("renders export buttons and triggers downloads", () => {
    render(<ExportActions mentor />);

    fireEvent.click(screen.getByRole("button", { name: /export progress csv/i }));
    fireEvent.click(screen.getByRole("button", { name: /export mentor csv/i }));

    expect(downloadCsv).toHaveBeenCalledWith("/exports/progress.csv", "course-progress.csv");
    expect(downloadCsv).toHaveBeenCalledWith("/exports/mentor.csv", "mentor-overview.csv");
  });
});