import React from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector } from 'react-redux';

import Dashboard from "pages/Dashboard";
import Livefeed from "pages/Livefeed";
import Configuration from "pages/Configuration";
import Login from "pages/Login";
import NotFound from "pages/NotFound";

import ProtectedRoute from "./protectedRoute.jsx"

function Routes() {
    const auth = useSelector(state => state.auth);
    return (
        <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/feed/:id" exact component={Livefeed} />
            <Route path="/configuration/:id" component={Configuration} />
            <Route path="/Login" component={Login} />
            <ProtectedRoute path="/yeet" component={NotFound} authed={auth.authenticated} />
            <Route component={NotFound} />
        </Switch>
    )
}

export default Routes;