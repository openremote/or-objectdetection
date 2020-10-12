import React from "react";
import {Route, Switch} from "react-router-dom";

import Dashboard from "pages/Dashboard";
import NotFound from "pages/NotFound";
import App from 'App';

function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={Dashboard}/>
            <Route component={NotFound}/>
        </Switch>
    )
}

export default Routes;