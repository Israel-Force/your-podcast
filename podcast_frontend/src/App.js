import React from "react";
import { Route, Switch } from "react-router-dom";


import Home from "./Components/Home";
import UserProfile from "./Components/UserProfile";
import AdminProfile from "./Components/AdminProfile";
import Register from "./Components/Register";
import LoginAdmin from "./Components/LoginAdmin";
import Login from "./Components/Login";
import PodDesc from "./Components/PodDesc";
import ProtectedRoute from "./Components/ProtectedRoute";
import PrivateRoute from "./Components/PrivateRoute";
import NotFound from "./Components/NotFound";


export default function App() {
  return (
    <div className="app">
      <Switch>
        <Route exact path="/" component={Home} />
        <ProtectedRoute exact path="/user/profile" component={UserProfile} />
        <PrivateRoute exact path="/admin/profile" component={AdminProfile} />
        <Route exact path="/admin/login" component={LoginAdmin} />
        <Route exact path="/user/login" component={Login} />
        <Route exact path="/user/register" component={Register} />
        <Route exact path="/podcast/:id" component={PodDesc} />
        <Route path="*" component={NotFound} />/
      </Switch>
    </div>
  );
}
