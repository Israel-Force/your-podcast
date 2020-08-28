import React, { useState, useEffect, useContext } from "react";
import Error from "./Error";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Context/UserContext";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(UserContext);

  // change the value of input to user's input
  const changeEmail = (e) => setEmail(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);

  // component did mount
  useEffect(() => {
    // axios get call
    axios("http://localhost:4000/admin/login")
      .then((res) => {
        dispatch({
          type: "ERROR_MSG",
          payload: [],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // axios post call on submit
  const submit = (e) => {
    e.preventDefault();
    // intercept response to extract error message
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
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
            payload: error.response.data.message,
          });
          setEmail('')
          setPassword('')
        }
        return Promise.reject(error);
      }
    );
    // axios post call
    axios({
      method: "post",
      url: "http://localhost:4000/admin/login",
      data: {
        email,
        password,
      },
    })
      .then((res) => {
        if (res.status === 200)
          dispatch({ type: "AUTH", payload: res.data.isAuthenticated });
        localStorage.setItem(
          "isAuthenticated",
          JSON.stringify(res.data.isAuthenticated)
        );
        localStorage.setItem("token", JSON.stringify(res.data.token));
        window.location = "/admin/profile";
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // mount error message when there is an error
  const mountError = state.errorMsg.length > 0 ? <Error /> : null;

  return (
    <div className="login">
      <form onSubmit={submit}>
        {mountError}
        <input
          type="text"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => {
            changeEmail(e);
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => {
            changePassword(e);
          }}
        />
        <button type="submit">Login</button>
        <Link to="/user/login">Login as user</Link>
      </form>
    </div>
  );
}
