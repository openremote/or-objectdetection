import React from "react";
import { useSelector } from 'react-redux';
import { Route, Redirect } from "react-router-dom";
import { authenticate, checkIsUserAuthenticated } from "../store/modules/auth/authSlice";

/*class PrivateRoute extends React.Component {
    render() {  return (
            <Route
                {...rest}
                render={(bla) =>
props                  this.props.authenticated === true ? (
                        <Component {...this.pro>
                    ) : (
                            <Redirect
                                to={{
                                    pathname: "/login",
                                    state: { from: this.procation }
                                }}
                            />
                        )
                }
            />
        )
    }
}

const mapStateToProps = (state) => ({
    authenticated: state.auth.authenticated
})

export default connect(mapStateToProps)((privateRoute)) */

const PrivateRoute = (component, authed, ...rest) => {
    let auth = useSelector(state => state.auth)
    console.log(auth);

    return (
        <Route
            {...rest}
            render={(props) =>
                auth.authenticated === true ? (
                    <component {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}


/* export default function PrivateRoute({ component: Component, authed, ...rest }) {


    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated() === true ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
} */

export default PrivateRoute;
