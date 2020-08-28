/* This component is the Admin's profile page. It renders two components (userDetails & Pods) by default it renders the userDetails on mount */

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import AdminHeader from "./AdminHeader";
import UserDetails from "./UserDetails";
import SideBar from "./SideBar";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import Pods from "./Pods";
import { UserContext } from "../Context/UserContext";

export default function AdminProfile(history) {
  const [sidebar, setSidebar] = useState(false);
  const [viewpod, setPod] = useState(false);
  const [viewUser, setUser] = useState(true);
  const { dispatch } = useContext(UserContext);

  //This function is to toggle the sidebar
  const mountSidebar = (chng) => setSidebar(chng);

  // This functions are to switch between the UserDetails and Pods components
  const changePod = (chg) => setPod(chg);
  const unmountUserDetails = (change) => setUser(change);

  //  component did mount
  useEffect(() => {
    // intercept axios response to extract error messages
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          /* update context save response in localStorage and reload the page to redirect user to the login page if authentication is  false */
          dispatch({
            type: "AUTH",
            payload: error.response.data.isAuthenticated,
          });

          localStorage.setItem(
            "isAuthenticated",
            JSON.stringify(error.response.data.isAuthenticated)
          );
          dispatch({
            type: "ERROR_MSG",
            payload: error.response.data.message
              ? error.response.data.message
              : [],
          });
          if (!error.response.data.isAuthenticated) {
            window.location.reload(true);
          }
        }
        if (error.response.status === 400) {
          const msg = error.response.data.message;
          const errMsg = [];
          errMsg.push(msg);
          dispatch({
            type: "ERROR_MSG",
            payload: errMsg,
          });
        }
        return Promise.reject(error);
      }
    );
    // get token from local storage and set headers for axios get call to the server on mounting component
    const token = localStorage.getItem("token");
    const bearerToken = token ? JSON.parse(token) : "";
    const header = {
      headers: { Authorization: "Bearer " + bearerToken },
    };
    // get authentication state from localStorage
    const localData = localStorage.getItem("isAuthenticated");
    const auth =
      localData !== undefined && localData !== null
        ? JSON.parse(localData)
        : false;
    axios("http://localhost:4000/user/", header)
      .then((res) => {
        /* get viewPod and viewUser state from the localStorage to remind browser of their previous value before page reload  */
        const localData_1 = localStorage.getItem("viewPod");
        const pod =
          localData_1 !== undefined && localData_1 !== null
            ? JSON.parse(localData_1)
            : false;
        setPod(pod);
        const localData_2 = localStorage.getItem("viewUser");
        const member =
          localData_2 !== undefined && localData_2 !== null
            ? JSON.parse(localData_2)
            : true;
        setUser(member);

        // remind browser if user is authenticated on page reload
        dispatch({
          type: "AUTH",
          payload: auth,
        });
        dispatch({
          type: "ERROR_MSG",
          payload: [],
        });

        // update context with user details
        dispatch({
          type: "UPDATE_ADMIN",
          payload: res.data.users,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // conditionally render  sideBar component based on user activity
  const view = sidebar ? (
    <SideBar
      change={mountSidebar}
      sidebar={sidebar}
      pod={viewpod}
      changePod={changePod}
      users={viewUser}
      changeUser={unmountUserDetails}
    />
  ) : null;

  // conditionally render  pods component and userDetails based on users activity
  const mountPod = viewpod ? <Pods props={history} /> : null;
  const mountUsersDetails = viewUser ? <UserDetails /> : null;
  
  return (
    <div className="admin">
      <AdminHeader change={mountSidebar} sidebar={sidebar} />
      <MobileNav
        change={mountSidebar}
        sidebar={sidebar}
        pod={viewpod}
        changePod={changePod}
        users={viewUser}
        changeUser={unmountUserDetails}
      />
      <div>
        {viewUser ? <h4>Dashboard</h4> : null}
        {mountUsersDetails}
      </div>
      {view}
      {mountPod}
      <Footer />
    </div>
  );
}
