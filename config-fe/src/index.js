import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import store from 'store/store'
import Routes from 'router/routes'
import { BrowserRouter } from "react-router-dom";

//font and themes
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import 'fontsource-roboto';

import Sidebar from 'features/core/Sidebar/Sidebar';
import AppBar from 'features/core/Appbar/Appbar';
import { Container, Box } from '@material-ui/core';

//TODO : make dark mode configurable for user
const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: '#4D9D2A'
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <Container maxWidth={false} disableGutters>
            <Box display="flex" flexDirection="row">
              <Box>
                <Sidebar />
              </Box>
              <Box flexGrow={1}>
                <Box display="flex" flexDirection="column">
                  <Box>
                    <AppBar />
                  </Box>
                  <Box flexGrow={1} p={3}>
                    <Routes />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
