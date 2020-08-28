/** This componenjt is for updating the pod in the Admin's page */
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EditUserPods({ display, change, id }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [by, setBy] = useState("");

  // change the value of input to user's input
  const changeTitle = (e) => setTitle(e.target.value);
  const changeDescription = (e) => setDescription(e.target.value);
  const changeBy = (e) => setBy(e.target.value);

  // make axios call when display is toggled on
  useEffect(() => {
    setTitle("");
    setDescription("");
    setBy("");
    if (id !== undefined) {
      const token = localStorage.getItem("token");
      const bearerToken = token ? JSON.parse(token) : "";
      const header = {
        headers: { Authorization: "Bearer " + bearerToken },
      };
      axios(`http://localhost:4000/podcast/${id}`, header)
        .then((res) => {
          setTitle(res.data.podcast.title);
          setDescription(res.data.podcast.description);
          setBy(res.data.podcast.by);
        })
        .catch(console.log);
    }
  }, [display]);

  // submit the update to the server
  const submit = (e) => {
    e.preventDefault();
    // axios put call
    const token = localStorage.getItem("token");
    const bearerToken = token ? JSON.parse(token) : "";
    const header = {
      headers: { Authorization: "Bearer " + bearerToken },
    };
    const data = {
      title,
      description,
      by,
    };
    axios
      .put(`http://localhost:4000/podcast/${id}`, data, header)
      .then((res) => {
        // user does not need server response therefore just reload the page to update the view
        window.location.reload(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // conditionally render this component based on user activity
  const view = display ? (
    <div className="editPod">
      <form onSubmit={submit}>
        <h6
          onClick={() => {
            change(!display);
          }}
        >
          X
        </h6>
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
        <button type="submit">Change</button>
      </form>
    </div>
  ) : null;
  return view;
}
