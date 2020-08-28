import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../Context/UserContext";
import test from "./regEx";
import Error from "./Error";

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const [validFirstName, setValidFirstName] = useState(true);
  const [validLastName, setValidLastName] = useState(true);
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  // change the value of input to user's input
  const changeEmail = (e) => setEmail(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);
  const changeFirstname = (e) => setFirstname(e.target.value);
  const changeLastname = (e) => setLastname(e.target.value);

  const { testFirstName, testLastName, testEmail, testPassword } = test;

  // onKeyUp test input if itd passes regEx rule
  const isfirstNameValid = (firstName) => {
    setValidFirstName(testFirstName(firstName));
  };
  const islastNameValid = (lastName) => {
    setValidLastName(testLastName(lastName));
  };
  const isEmailValid = (email) => {
    setValidEmail(testEmail(email));
  };
  const isPasswordValid = (passwordl) => {
    setValidPassword(testPassword(password));
  };

  // component did mount
  useEffect(() => {
    dispatch({
      type: "ERROR_MSG",
      payload: [],
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
        dispatch({
          type: "AUTH",
          payload: error.response.data.isAuthenticated,
        });
        dispatch({
          type: "ERROR_MSG",
          payload: error.response.data.message,
        });
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        return Promise.reject(error);
      }
    );
    // if all regEx rule passes then make axios post call
    if (
      testFirstName(firstName) &&
      testLastName(lastName) &&
      testEmail(email) &&
      testPassword(password)
    ) {
      // axios post call
      axios({
        method: "post",
        url: "http://localhost:4000/user/signup",
        data: {
          firstName,
          lastName,
          email,
          password,
        },
      })
        .then((res) => {
          if (res.status === 200)
            dispatch({ type: "AUTH", payload: res.data.isAuthenticated });
          localStorage.setItem(
            "isAuthenticated",
            `${res.data.isAuthenticated}`
          );
          localStorage.setItem("token", JSON.stringify(res.data.token));
          window.location = "/user/profile";
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // else prevent user from submitting
    return e.preventDefault();
  };

  // mount error message when there is an error
  const mountError =
    state.errorMsg !== undefined && state.errorMsg.length > 0 ? (
      <Error />
    ) : null;

  return (
    <div>
      <div className="register">
        <form onSubmit={submit}>
          {mountError}
          <input
            type="text"
            placeholder="firstname"
            className={validFirstName ? "normal" : "danger"}
            value={firstName}
            onChange={(e) => {
              changeFirstname(e);
            }}
            onKeyUp={() => {
              isfirstNameValid(firstName);
            }}
          />
          <label
            className={validFirstName ? "hide" : "show"}
            htmlFor="firstName"
          >
            first name can only be alphabets and must be 2-50 characters long
          </label>
          <input
            type="text"
            placeholder="lastname"
            className={validLastName ? "normal" : "danger"}
            value={lastName}
            onChange={(e) => {
              changeLastname(e);
            }}
            onKeyUp={() => {
              islastNameValid(lastName);
            }}
          />
          <label
            htmlFor="last_name"
            className={validLastName ? "hide" : "show"}
          >
            last name can only be alphabets and must be 2-50 characters long
          </label>
          <input
            type="text"
            placeholder="email"
            className={validEmail ? "normal" : "danger"}
            value={email}
            onChange={(e) => {
              changeEmail(e);
            }}
            onKeyUp={() => {
              isEmailValid(email);
            }}
          />
          <label htmlFor="email" className={validEmail ? "hide" : "show"}>
            email must be a valid address e.g me@mydomain.com
          </label>
          <input
            type="password"
            placeholder="password"
            className={validPassword ? "normal" : "danger"}
            value={password}
            onChange={(e) => {
              changePassword(e);
            }}
            onKeyUp={() => {
              isPasswordValid(password);
            }}
          />
          <label htmlFor="password" className={validPassword ? "hide" : "show"}>
            password must be 6 characters long, underscores may be used.
          </label>
          <button>Register</button>
          <Link to="/user/login">Login</Link>
        </form>
      </div>
    </div>
  );
}
