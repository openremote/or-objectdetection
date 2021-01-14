import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Login from "./Login";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";
import { AuthenticationContext } from "../store/modules/context/AuthContext";

const renderLogin = ({
  authService = { login: jest.fn() },
  location = { state: { username: "harry" } }
} = {}) => {
  return render((store) => (
    <MemoryRouter>
      <AuthenticationContext.Provider value={authService}>
        <Login location={location} store={store} />
      </AuthenticationContext.Provider>
    </MemoryRouter>
  ));
};

describe("LoginScreen", () => {
  it("Renders correctly", () => {
    const { container } = renderLogin();
    expect(container).toMatchSnapshot();
  });
});
