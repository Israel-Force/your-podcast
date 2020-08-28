/** This component is the landing page */
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <div className="welcome">
        <h2>WELCOME TO YOUR NUMBER ONE PODCAST SITE</h2>
        <button onClick={() => (window.location = "/user/login")}>
          <Link to="/user/login">START HERE</Link>
        </button>
      </div>
    </div>
  );
}
