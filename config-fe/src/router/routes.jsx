import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "pages/Dashboard";
import Livefeed from "pages/Livefeed";
import Configuration from "pages/Configuration";
import Login from "pages/Login";
import NotFound from "pages/NotFound";

import PrivateRoute from "./privateRoute.jsx"

function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/feed/:id" exact component={Livefeed} />
            <Route path="/configuration/:id" component={Configuration} />
            <Route path="/Login" component={Login} />
            <PrivateRoute path="/Test" component={NotFound} />
        </Switch>
        //<Route component={NotFound} />

    )
}

export default Routes;
