import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "pages/Dashboard";
import Livefeed from "pages/Livefeed";
import NotFound from "pages/NotFound";
import App from 'App';
import Popup from 'features/custom/Popup'

function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/feed/:id" exact component={Livefeed} />
            <Route component={NotFound} />
        </Switch>
    )
}

export default Routes;