import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import { DashboardWithStyles } from "./Dashboard";
import { MemoryRouter } from "react-router-dom";

const renderDashboard = ({ LoadVideoSources = jest.fn(), feeds = [] } = {}) => {
  return render(
    <MemoryRouter>
      <DashboardWithStyles feeds={feeds} LoadVideoSources={LoadVideoSources} />
    </MemoryRouter>
  );
};
describe("Dashboard component", () => {
  it("matches the snapshot", () => {
    const { container } = renderDashboard();
    expect(container).toMatchSnapshot();
  });
});
