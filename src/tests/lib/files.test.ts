import { formatFileSize } from "@/lib/files";
import { describe, it, expect } from "vitest";

describe("formatFileSize", () => {
  it("formats bytes", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1.0 MB");
  });

  it("handles zero bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });
});
