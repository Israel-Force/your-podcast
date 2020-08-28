/** This component displays when the user has no Podcast uploaded yrt  */

import React, { useState, useContext } from "react";

import mic from "../img/mic.png";
import HeaderUser from "./HeaderUser";
import UploadPod from "./UploadPod";
import Footer from "./Footer";
import { UserContext } from "../Context/UserContext";


export default function UserBody({ props }) {
  const [upload, setupload] = useState(false)
  const {state} = useContext(UserContext)

  // This function mounts the uploadPod component
  const mountPod = (cng) => {
    setupload(cng);
    window.scroll(0,0)
  };

  return (
    <div>
      <HeaderUser props={props} />
      <div className="userBody">
        <h3>WELCOME {state.firstName.toUpperCase()}</h3>
        <div className="mic">
          <img src={mic} alt="mic" />
        </div>
        <p className="pod">NO PODCAST UPLOADED YET</p>
        <button onClick={() => mountPod(true)}>UPLOAD HERE</button>
      </div>
      <UploadPod display={upload} change={mountPod} />
      <Footer />
    </div>
  );
}
