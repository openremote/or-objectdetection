import React from "react";
import { Router, Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, authed, ...rest }) => (
  <Router>
    <Route
      {...rest}
      render={(props) =>
        authed ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  </Router>
);

export default ProtectedRoute;
