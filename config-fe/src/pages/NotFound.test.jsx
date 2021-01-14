import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import NotFound from "./NotFound";
import { MemoryRouter } from "react-router-dom";

const renderNotFound = () => {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
};
describe("Configuration component", () => {
  it("matches the snapshot", () => {
    const { container } = renderNotFound();
    expect(container).toMatchSnapshot();
  });
});
