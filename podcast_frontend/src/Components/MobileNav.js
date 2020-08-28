/** This component is thw nav for mobile view */
import React from "react";


export default function MobileNav({
  change,
  sidebar,
  changePod,
  changeUser,
}) {
  // This function toggle the Pod component.
  const changeRoute = () => {
    change(!sidebar);
    changeUser(false);
    const user = false;
    changePod(true);
    const pod = true;
    // save the state to the the localStorage for AdminProfile component
    localStorage.setItem("viewPod", JSON.stringify(pod));
    localStorage.setItem("viewUser", JSON.stringify(user));
  };

  // This function toggle the userDetails component.
  const routeChange = () => {
    change(!sidebar);
    const pod = false;
    changePod(false);
    const user = true;
    changeUser(true);
    // save the state to the the localStorage for AdminProfile component
    localStorage.setItem("viewPod", JSON.stringify(pod));
    localStorage.setItem("viewUser", JSON.stringify(user));
  };

  return (
    <div className="mobileNav">
      <ul>
        <li
          onClick={() => {
            routeChange();
          }}
        >
          View all users
        </li>
        <li
          onClick={() => {
            changeRoute();
          }}
        >
          View all Podcasts
        </li>
      </ul>
    </div>
  );
}
