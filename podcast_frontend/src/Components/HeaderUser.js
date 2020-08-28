/**This component is meant for the admin pages. It a header component with a burger for toggling the sidebar */

import React from "react";

export default function Header() {
  // logout functiom to clear the localStorage and return user to home page
  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };
  
  return (
    <div className="header">
      <p>
        POD<span>CAST</span>
      </p>
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
