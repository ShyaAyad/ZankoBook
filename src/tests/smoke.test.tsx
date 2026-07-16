import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "./test-utils";

function TestComponent() {
  return <h1>Hello Testing!</h1>;
}

describe("Testing infrastructure", () => {
  it("renders a component", () => {
    renderWithProviders(<TestComponent />);

    expect(
      screen.getByRole("heading", { name: "Hello Testing!" }),
    ).toBeInTheDocument();
  });
});
