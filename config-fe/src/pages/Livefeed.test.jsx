import React from "react";
import { render } from "@testing-library/react";
import renderer from "react-test-renderer";
import Livefeed from "./Livefeed";
import { MemoryRouter } from "react-router-dom";

jest.mock("@stomp/stompjs");
const stomp = require("@stomp/stompjs");

// stomp is a mock function
stomp.mockImplementation(() => ({ Client: jest.fn(), Message: jest.fn() }));

const renderLivefeed = ({ match = { params: { id: "aap" } } } = {}) => {
  return render(
    <MemoryRouter>
      <Livefeed match={match} />
    </MemoryRouter>
  );
};

describe("Livefeed component", () => {
  it("matches the snapshot", () => {
    const { container } = renderLivefeed();
    expect(container).toMatchSnapshot();
  });
});
