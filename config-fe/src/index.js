import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "store/store";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

//font and themes
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "fontsource-roboto";

//TODO : make dark mode configurable for user
const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#4D9D2A"
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
