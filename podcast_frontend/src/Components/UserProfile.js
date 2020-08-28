/* This component is the user's profile page. It renders two components (userContent & userBody) */
import React, { useEffect, useContext } from "react";
import axios from "axios";

import UserBody from "./UserBody";
import UserContent from "./UserContent";
import { UserContext } from "../Context/UserContext";

export default function UserProfile({ getPodId, history }) {
  const { state, dispatch } = useContext(UserContext);

  // component did mount
  useEffect(() => {
    // intercept response to extract error message
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
          if (!error.response.data.isAuthenticated) {
            window.location.reload(true);
          }
          dispatch({ type: "LOADING", payload: false });
          dispatch({
            type: "ERROR_MSG",
            payload: error.response.data.message
              ? error.response.data.message
              : [],
          });
        }
        if (error.response.status === 400) {
          const msg = error.response.data.message;
          const errMsg = [];
          errMsg.push(msg);
          dispatch({ type: "LOADING", payload: false });
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
    const auth = localData ? JSON.parse(localData) : false;
    axios("http://localhost:4000/user/podcast", header)
      .then((res) => {
        dispatch({
          type: "AUTH",
          payload: auth,
        });
        dispatch({
          type: "ERROR_MSG",
          payload: [],
        });
        dispatch({
          type: "UPDATE_PODS",
          payload: res.data.podcast,
        });
        dispatch({
          type: "FIRSTNAME_UPDATE",
          payload: res.data.userFirstName,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // conditionally render userContent or userBody based on the state of context pods state
  const view =
    state.pods.length > 0 ? (
      <UserContent getPodId={getPodId} props={history} />
    ) : (
      <UserBody props={history} />
    );
  return <div>{view}</div>;
}
