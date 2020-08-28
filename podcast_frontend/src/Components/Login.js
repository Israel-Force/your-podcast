import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import axios from "axios";

import { UserContext } from "../Context/UserContext";
import Error from "./Error";
import google from "../img/google_logo.png";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(UserContext);

  // change the value of input to user's input
  const changeEmail = (e) => setEmail(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);

  // get accessToken from google
   const responseGoogle = async (res) => {
    await axios.post('http://localhost:4000/user/google', {
      access_token: res.accessToken
    })
    .then((res) => {
      if (res.status === 200)
        dispatch({ type: "AUTH", payload: res.data.isAuthenticated });
      localStorage.setItem(
        "isAuthenticated",
        JSON.stringify(res.data.isAuthenticated)
      );
      localStorage.setItem("token", JSON.stringify(res.data.token));
      window.location = "/user/profile";
    })
    .catch(console.log)
  };

  const googleFailed = () => {
    dispatch({
      type: "AUTH",
      payload: false,
    });
    dispatch({
      type: "ERROR_MSG",
      payload: [ "Authentication failed. Please try again" ],
    });
    setEmail('')
    setPassword('')
  }

  // component did mount
  useEffect(() => {
    // axios get call
    axios("http://localhost:4000/user/login")
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
      url: "http://localhost:4000/user/login",
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
        window.location = "/user/profile";
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
          placeholder="email"
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
        <GoogleLogin
          clientId= "350406031730-dud18sal4lsav0nmlhntq9np42rra8lu.apps.googleusercontent.com"
          render={(renderProps) => (
            <div
              className="google"
              onClick={renderProps.onClick}
              disable={renderProps.disable}
            >
              <div className="google_logo">
                <img src={google} alt="google" />
              </div>
              <p>Login with google</p>
            </div>
          )}
          buttonText="Login with google"
          onSuccess={responseGoogle}
          onFailure={googleFailed}
          cookiePolicy={"single_host_origin"}
        />
        <Link to="/user/register" className="signup">Sign up</Link>
        <Link to="/admin/login">Login as Admin</Link>
      </form>
    </div>
  );
}
