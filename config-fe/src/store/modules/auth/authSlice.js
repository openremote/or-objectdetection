import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    authenticated: false,
    loading: true
  },
  reducers: {
    authenticate: (state) => {
      state.authenticated = true;
      state.loading = false;
    },
    deauthenticate: (state) => {
      state.authenticated = false;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    }
  }
});

export const { authenticate, deauthenticate, setLoading } = authSlice.actions;

/**
 * Checks if the user is authenticated
 */
export const checkIsUserAuthenticated = () => (dispatch) => {
  dispatch(setLoading());
  // Fetch the data from the session storage
  const user = window.localStorage.getItem("user");

  if (user) {
    dispatch(authenticate());
  } else {
    dispatch(deauthenticate());
  }
};

export const login = (username, password, history) => (dispatch) => {
  dispatch(setLoading());
  if (username === "admin@or.com" && password === "admin") {
    window.localStorage.setItem("user", "admin");
    dispatch(authenticate());
    history.push("/");
  } else {
    dispatch(deauthenticate());
  }

  dispatch(authenticate());
};

export const logout = (history) => (dispatch) => {
  window.localStorage.removeItem("user");
  dispatch(deauthenticate());
  history.push("/login");
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const authSelect = state => state.auth;

export default authSlice.reducer;
