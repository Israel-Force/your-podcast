import React from "react";


import demo from "../img/demo.png";

export default function SideBar({
  change,
  sidebar,
  changePod,
  changeUser,
}) {
   // This function toggle the Pod component.
  const changeRoute = () => {
    change(!sidebar);
    const user = false
    changeUser(false);
    const pod = true
    changePod(true);
     // save the state to the the localStorage for AdminProfile component
    localStorage.setItem("viewPod", JSON.stringify(pod))
    localStorage.setItem("viewUser", JSON.stringify(user))
  };

   // This function toggle the userDetails component.
  const routeChange = () => {
    change(!sidebar);
    const pod = false
    changePod(false);
    const user = true
    changeUser(true);
      // save the state to the the localStorage for AdminProfile component
    localStorage.setItem("viewPod", JSON.stringify(pod))
    localStorage.setItem("viewUser", JSON.stringify(user))
  };
  return (
    <div
      className="sidebar"
      onClick={() => {
       change(!sidebar);
     }}
    >
      <div className="nav">
        <div className="nav-img-container">
          <img src={demo} alt="default" />
        </div>
        <div>
          <ul>
            <li onClick={() => { routeChange() }}>View all users</li>
            <li onClick={() => { changeRoute() }}>View all podcasts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
