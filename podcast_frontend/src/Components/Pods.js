import React, { useState, useEffect, useContext } from "react";
import axios from "axios";



import EditUserPods from "./EditUserPods";
import { UserContext } from "../Context/UserContext";
import Allpods from "./Allpods";

export default function Pods({ props }) {
  const { state, dispatch } = useContext(UserContext);
  const [editUserPods, setEditUserPods] = useState(false);
  const mountEditUserPod = (cng) => setEditUserPods(cng);
  const [id, setId] = useState("");

  // This function gets podcast id from the  component for use in the EditUserPods component
  const getId = (id) => setId(id);

  // component did mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const bearerToken = token ? JSON.parse(token) : "";
    const header = {
      headers: { Authorization: "Bearer " + bearerToken },
    };
    axios(`http://localhost:4000/podcast/`, header)
      .then((res) => {
        dispatch({ type: "UPDATE_PODS", payload: res.data.podcasts.podcast });
      })
      .catch(console.log);
  }, []);

  return (
    <div className="pods">
      <h5>All pods</h5>
      <div className="usersDetails">
        <div className="users">
          {state.pods.length > 0 ? (
            state.pods.map((pod, i) => {
              return (
                <Allpods
                  key={i}
                  mountEditUserPod={mountEditUserPod}
                  editUserPods={editUserPods}
                  getId={getId}
                  {...pod}
                  props={props}
                />
              );
            })
          ) : (
            <h1>NO UPLOADED PODCAST YET</h1>
          )}
        </div>
      </div>
      <EditUserPods display={editUserPods} change={setEditUserPods} id={id} />
    </div>
  );
}
