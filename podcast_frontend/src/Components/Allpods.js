/* This component is to display various podcast details received from the server*/
import React from "react";
import axios from "axios";

export default function Allpods({
  editUserPods,
  mountEditUserPod,
  title,
  user,
  by,
  id,
  getId,
  props,
}) {

  // if there is a user extract his/her first and last name and if not move on
  if (user) {
    var { firstName, lastName } = user;
  } else {
    firstName = "";
    lastName = "";
  }
  // capitalize the first letter of the first and last namae
  const capitalizedFirstname =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const capotalizedLastname =
    lastName.charAt(0).toUpperCase() + lastName.slice(1);
  
  /* conditionally render EditPod component and send its id to the mother component (Pod) to make axios request to get the podcast details to pre-fill the edit input fields */ 
  const toggleEditPod = (id) => {
    getId(id);
    mountEditUserPod(!editUserPods);
    window.scroll(0,0)
  };

  const deletePod = (id) => {
    // axios delete call
    const token = localStorage.getItem("token");
    const bearerToken = token ? JSON.parse(token) : "";
    const header = {
      headers: { Authorization: "Bearer " + bearerToken },
    };
    axios
      .delete(`http://localhost:4000/podcast/${id}`, header)
      .then((res) => {
        window.location.reload(true);
      })
      .catch(console.log);
  };

  // this function changes route to the Individual Podcast description page
  const changeRoute = (id) => {
    props.history.push(`/podcast/${id}`);
  };
  
  return (
    <div className="row">
      <div className="row-cols-1">
        <p
          className="head"
          onClick={() => {
            changeRoute(id);
          }}
        >
          {title}
        </p>
        <p
          onClick={() => {
            changeRoute(id);
          }}
        >
          {by}
        </p>
      </div>
      <div className="row-cols-2">
        <p className="head">Uploaded By</p>
        <p>{capitalizedFirstname + " " + capotalizedLastname}</p>
      </div>
      <div className="row-cols-3">
        <p className="head">Edit</p>
        <button
          onClick={() => {
            toggleEditPod(id);
          }}
        >
          Edit
        </button>
      </div>
      <div className="row-cols-4">
        <p className="head">Delete</p>
        <button
          onClick={() => {
            deletePod(id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
