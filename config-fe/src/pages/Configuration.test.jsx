import React from "react";
import { render, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import Configuration from "./Configuration";
import { MemoryRouter } from "react-router-dom";

const renderConfiguration = ({ match = { params: { id: "aap" } } } = {}) => {
  return render(
    <MemoryRouter>
      <Configuration match={match} />
    </MemoryRouter>
  );
};
describe("Configuration component", () => {
  it("matches the snapshot", () => {
    const { container } = renderConfiguration();
    expect(container).toMatchSnapshot();
  });
});
