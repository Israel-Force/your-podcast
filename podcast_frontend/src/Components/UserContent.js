/** This renders an authenticated user uploaded podcasts */
import React, { useState, useContext } from "react";

import HeaderUser from "./HeaderUser";
import Edit from "./Edit";
import Footer from "./Footer";
import LoadTask from './LoadTask'
import { UserContext } from "../Context/UserContext";
import UserIndvidualPod from "./UserIndvidualPod";
import UploadPod from "./UploadPod";

export default function UserContent({ props }) {
  const [editPod, setEditpod] = useState(false);
  const [id, setId] = useState("");
  const [upload, setupload] = useState(false);
  const { state } = useContext(UserContext);

  // This function mounts the uploadPod component
  const mountPod = (cng) => {
    setupload(cng);
    window.scroll(0, 0);
  };

  // This function mounts the EditPod component
  const mountEditPod = (cng) => {
    setEditpod(cng);
    window.scroll(0, 0);
  };

  // This function get id from the userIndividualPod child component and update the setId state
  const getId = (id) => setId(id);

  return (
    <div>
      <LoadTask />
      <HeaderUser props={props} />
      <div className="content">
        <h3>WELCOME {state.pods[0].name.toUpperCase()}</h3>
        {state.pods.map((pod, i) => {
          return pod === null ? (
            false
          ) : (
            <UserIndvidualPod
              key={i}
              {...pod}
              mountEditPod={mountEditPod}
              getId={getId}
              props={props}
            />
          );
        })}
        <button onClick={() => mountPod(true)}>UPLOAD HERE</button>
      </div>
      <Edit display={editPod} change={mountEditPod} id={id} />
      <UploadPod display={upload} change={mountPod} />
      <Footer />
    </div>
  );
}
