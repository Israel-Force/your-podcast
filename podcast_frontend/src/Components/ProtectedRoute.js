/**This component protects the userProfile route from unauthenticated user */

import React from "react";
import { Route, Redirect } from "react-router-dom";

import AuthCheck from "./Auth";

export default function ProtectedRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (AuthCheck.getAuth()) return <Component {...props} />;
        else
          return (
            <Redirect
              to={{
                pathname: "/user/login",
              }}
            />
          );
      }}
    />
  );
}
