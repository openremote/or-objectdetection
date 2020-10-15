import React from "react";
import {Route, Switch} from "react-router-dom";

import Dashboard from "pages/Dashboard";
import Livefeed from "pages/Livefeed";
import Configuration from "pages/Configuration";
import NotFound from "pages/NotFound";

function Routes() {
    return (
            <Switch>
                <Route path="/" exact component={Dashboard}/>
                <Route path="/feed/:id" exact component={Livefeed}/>
                <Route path="/configuration" component={Configuration} />
                <Route component={NotFound}/>
            </Switch>
    )
}

export default Routes;
