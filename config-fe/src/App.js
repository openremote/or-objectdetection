import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box } from "@material-ui/core";

// Custom components
import Routes from "router/routes";
import Sidebar from "features/core/Sidebar/Sidebar";
import AppBar from "features/core/Appbar/Appbar";

// Actions
import { checkIsUserAuthenticated } from "./store/modules/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const authSelect = useSelector(state => state.auth);
  useEffect(() => {
    dispatch(checkIsUserAuthenticated());
  }, []);

  if (!authSelect.loading) {
    return (
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
    );
  }

  return (
    <p>Loading WIP</p>
  )
};

export default App;
