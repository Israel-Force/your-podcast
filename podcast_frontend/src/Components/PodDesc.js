/** This component shows a Podcast with it's details, it link can be shared to others */
import React, { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import axios from "axios";

import Header from "./Header"
import Footer from "./Footer";

export default function PodDesc({ podId, history, match }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [by, setBy] = useState("");
  const [filePath, setFilePath] = useState("");

  // component did mount
  useEffect(() => {
    axios(`http://localhost:4000/podcast/${match.params.id}`)
      .then((res) => {
        setTitle(res.data.podcast.title);
        setDescription(res.data.podcast.description);
        setBy(res.data.podcast.by);
        setFilePath(res.data.podcast.filePath);
      })
      .catch(console.log);
  }, []);
  return (
    <div>
      <Header />
      <div className="desc">
        <div>
          <div className="audio">
            <ReactAudioPlayer
              src={`http://localhost:4000/${filePath}`}
              controls
            />
          </div>
          <p className="title">{title}</p>
          <p className="by">{by}</p>
        </div>
        <div>
          <p>{description}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
