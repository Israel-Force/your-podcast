/**This component is meant for the admin pages. It a header component with a burger for toggling the sidebar */

import React from "react";

import Burger from "./Burger";


export default function AdminHeader({ change, sidebar }) {
  // logout functiom to clear the localStorage and return user to home page
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <div className="AdminHeader">
      <div>
        <Burger change={change} sidebar={sidebar} />
        <p>
          POD<span>CAST</span>
        </p>
      </div>
      <button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}
