/** This component is for displaying error */
import React, { useContext } from "react";
import { UserContext } from "../Context/UserContext";

export default function Error() {
  const { state } = useContext(UserContext);

  // map through the array of errors and display each in the error div
  const showErrors = state.errorMsg.map((e, i) => {
    return <p key={i}>{e}</p>;
  });
  return <div className="error">{showErrors}</div>;
}
