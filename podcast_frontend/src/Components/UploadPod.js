import React, { useContext, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { UserContext } from "../Context/UserContext";
import Error from "./Error";

export default function UploadPod({ display, change }) {
  const { state, dispatch } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [by, setBy] = useState("");
  const [sendToServer, setSendToServer] = useState(false);
  const [audio, setFile] = useState(null);

  // change the value of input to user's input
  const changeTitle = (e) => setTitle(e.target.value);
  const changeDescription = (e) => setDescription(e.target.value);
  const changeBy = (e) => setBy(e.target.value);


  /** TODO- findout why it is not working on mobile browser */
  // this function checks for the mime type of the uploaded audio
  // const checkMimeType = (e) => {
  //   let files = e.target.files;
  //   let err = [];
  //   const types = [
  //     "audio/basic",
  //     "audio/L24",
  //     "audio/mid",
  //     "audio/mpeg",
  //     "audio/mp4",
  //     "audio/x-aiff",
  //     "audio/x-mpegurl",
  //     "audio/vnd.rn-realaudio",
  //     "audio/ogg",
  //     "audio/vorbis",
  //     "audio/vnd.wav",
  //     "audio/webm",
  //     "audio.wav",
  //     "audio/midi",
  //     "audio/x-midi",
  //     "audio/aac",
  //     "audio/x-m4a",
  //   ];
  //   if (types.every((type) => files[0].type !== type))
  //     err.push("file is not supported");

  //   if (err.length > 0) {
  //     dispatch({
  //       type: "ERROR_MSG",
  //       payload: err,
  //     });
  //     setSendToServer(false);
  //     return false;
  //   }
  //   dispatch({
  //     type: "ERROR_MSG",
  //     payload: [],
  //   });
  //   setSendToServer(true);
  //   return true;
  // };

  // this function checks for the size of the audio uploaded
  const checkFileSize = (e) => {
    let files = e.target.files;
    let size = 1024 * 1024 * 15;
    let err = [];
    if (files[0].size > size) err.push("file is too large. max size is 15mb");
    if (err.length > 0) {
      dispatch({
        type: "ERROR_MSG",
        payload: err,
      });
      setSendToServer(false);
      return false;
    } 
      dispatch({
        type: "ERROR_MSG",
        payload: [],
      });
      setSendToServer(true);
      return true;
  };

  // this function checks if the audio mime type and size is supported and then update the setFile state
  const selectFile = (e) => {
    if (checkFileSize(e)) {
      setFile(e.target.files[0]);
    }
  };

// clear the error Msg whenever display state changes
  useEffect(() => {
    dispatch({
      type: "ERROR_MSG",
      payload: [],
    });
  }, [display]);

  const submit = (e) => {
    e.preventDefault();
    // if all conditions are right make axios post call
    if (sendToServer) {
      dispatch({ type: "LOADING", payload: true });
      const token = localStorage.getItem("token");
      const bearerToken = token ? JSON.parse(token) : "";
      const header = {
        headers: { Authorization: "Bearer " + bearerToken },
      };
      const data = new FormData();
      data.append("audio", audio);
      data.append("title", title);
      data.append("description", description);
      data.append("by", by);
      axios
        .post("http://localhost:4000/podcast", data, header)
        .then((res) => {
          dispatch({ type: "LOADING", payload: false });
          toast.success("upload success");
          window.location.reload(true);
        })
        .catch((err) => {
          toast.error("upload fail");
          console.log(err);
        });
    } else e.preventDefault();
  };

  const mountError = state.errorMsg.length > 0 ? <Error /> : null;
  
  const view = display ? (
    <div className="upload">
      <form onSubmit={submit} encType="multipart/form-data">
        <ToastContainer />
        <h6
          onClick={() => {
            change(!display);
          }}
        >
          X
        </h6>
        {mountError}
        <input
          type="file"
          accept="audio/*"
          id="file"
          size="60"
          onChange={(e) => {
            selectFile(e);
          }}
          required
        />
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => {
            changeTitle(e);
          }}
        />
        <textarea
          rows="5"
          cols="30"
          placeholder="description"
          value={description}
          onChange={(e) => {
            changeDescription(e);
          }}
        />
        <input
          type="text"
          placeholder="by"
          value={by}
          onChange={(e) => {
            changeBy(e);
          }}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  ) : null;
  return view;
}
