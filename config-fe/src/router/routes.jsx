import React from "react";
import {Route, Switch} from "react-router-dom";

import Dashboard from "pages/Dashboard";
<<<<<<< Updated upstream
import Livefeed from "pages/Livefeed";
=======
import Configuration from "pages/Configuration";
>>>>>>> Stashed changes
import NotFound from "pages/NotFound";

function Routes() {
    return (
<<<<<<< Updated upstream
        <Switch>
            <Route path="/" exact component={Dashboard}/>
            <Route path="/feed/:id" exact component={Livefeed}/>
            <Route component={NotFound}/>
        </Switch>
=======
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Dashboard}/>
                <Route path="/test" component={App} />
                <Route path="/configuration" component={Configuration} />
                <Route component={NotFound}/>
            </Switch>
        </BrowserRouter>
>>>>>>> Stashed changes
    )
}

export default Routes;