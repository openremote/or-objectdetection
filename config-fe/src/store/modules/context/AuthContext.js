import React from "react";

export const AuthenticationContext = React.createContext();
export const useAuthenticationContext = () =>
  React.useContext(AuthenticationContext);
/* HOC to inject store to any functional or class component */
export const withAuthenticationContext = (Component) => (props) => {
  return (
    <Component {...props} authenticationService={useAuthenticationContext()} />
  );
};
export default AuthenticationContext;
