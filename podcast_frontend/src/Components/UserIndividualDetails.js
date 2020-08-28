/* This component shows details for individual user  */
import React from "react";
import axios from "axios";

export default function UserIndividualDetails({
  firstName,
  lastName,
  joined,
  email,
  id,
}) {
  const deleteUser = (id) => {
    // axios delete call
    const token = localStorage.getItem("token");
    const bearerToken = token ? JSON.parse(token) : "";
    const header = {
      headers: { Authorization: "Bearer " + bearerToken },
    };
    axios
      .delete(`http://localhost:4000/user/${id}`, header)
      .then((res) => {
        window.location.reload(true);
      })
      .catch(console.log);
  };
  // This capitalizes the first letter of the first and last name
  const capitalizedFirstname =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const capotalizedLastname =
    lastName.charAt(0).toUpperCase() + lastName.slice(1);

  //This trims out the time
  const time = joined ? joined.slice(0, 10) : null;
  return (
    <div className="row">
      <div className="row-cols-1">
        <p className="head">Name</p>
        <p>{capitalizedFirstname + " " + capotalizedLastname}</p>
      </div>
      <div className="row-cols-2">
        <p className="head">Email</p>
        <p>{email}</p>
      </div>
      <div className="row-cols-3">
        <p className="head">Date Joined</p>
        <p>{time}</p>
      </div>
      <div className="row-cols-4">
        <p className="head">Delete</p>
        <button
          onClick={() => {
            deleteUser(id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
