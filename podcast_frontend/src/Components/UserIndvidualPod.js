/* This component shows details for individual user  */
import React from "react";
import ReactAudioPlayer from "react-audio-player";
import axios from "axios";

import pen from "../img/pen.png";
import trash from "../img/trash_bin.png";

export default function UserIndvidualPod({
  mountEditPod,
  filePath,
  title,
  getId,
  id,
  props
}) {

  // this function toggles the editPod 
  const toggleEditPod = (id) => {
    getId(id);
    mountEditPod(true);
    window.scroll(0, 0);
  };

  // this function changes route to podDesc component
  const sendPodId = (id) => { 
    props.push(`/podcast/${id}`)
  };

  const deletePod = (id) => {
    // axios post call
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
  return (
    <div>
      <div className="audioFile">
        <div className="audio">
          <ReactAudioPlayer
            src={`http://localhost:4000/${filePath}`}
            controls
          />
          <div
            className="edit"
            onClick={() => {
              toggleEditPod(id);
            }}
          >
            <img src={pen} alt="pen" />
          </div>
          <div
            className="trash"
            onClick={() => {
              deletePod(id);
            }}
          >
            <img src={trash} alt="bin" />
          </div>
        </div>
        <h4
          onClick={() => {
            sendPodId(id);
          }}
        >
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </h4>
      </div>
    </div>
  );
}
