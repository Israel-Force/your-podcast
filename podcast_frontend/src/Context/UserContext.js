import React, { createContext, useReducer } from "react";
import UserReducer from "../reducer/UserReducer";

export const UserContext = createContext();

const initialState = {
  pods: [],
  firstName: '',
  isAuthenticated: false,
  errorMsg: [], 
  podId: undefined,
  admin: [],
  loading: false
};

export default function UserContextProvider(props) {
  const [state, dispatch] = useReducer(UserReducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {props.children}
    </UserContext.Provider>
  );
}
