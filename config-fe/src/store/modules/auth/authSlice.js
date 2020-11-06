import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authenticated: false
  },
  reducers: {
    authenticate: (state) => {
      return { ...state, authenticated: true };
    },
    deauthenticate: (state) => {
      return { ...state, authenticated: false };
    }
  }
});

export const { authenticate, deauthenticate } = authSlice.actions;

/**
 * Checks if the user is authenticated
 */
export const checkIsUserAuthenticated = () => (dispatch) => {
  // Fetch the data from the session storage
  const user = window.sessionStorage.getItem("user");

  if (user) {
    dispatch(authenticate());
  } else {
    dispatch(deauthenticate());
  }
};

export const login = (username, password, history) => (dispatch) => {
  if (username === "admin@or.com" && password === "admin") {
    window.sessionStorage.setItem("user", "admin");
    dispatch(authenticate());
    history.push("/");
  } else {
    dispatch(deauthenticate());
  }

  dispatch(authenticate());
};

export const logout = (history) => (dispatch) => {
  window.sessionStorage.removeItem("user");
  dispatch(deauthenticate());
  history.push("/login");
};

export default authSlice.reducer;
