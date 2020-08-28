/* This component renders the userIndividualDetails component */
import React, { useContext } from "react";

import { UserContext } from "../Context/UserContext";
import UserIndividualDetails from "./UserIndividualDetails";
import UserIndividualDetails2 from "./UserIndividualDetails2";

export default function UserDetails() {
  const { state } = useContext(UserContext);
  return (
    <div className="usersDetails">
      <h5>All Users</h5>
      <div className="users">
        {state.admin.map((user, i) => {
          // this check if user's indesx number is even for a different styling
          if (i % 2 === 0) {
            return <UserIndividualDetails key={i} {...user} />;
          } else {
            return <UserIndividualDetails2 key={i} {...user} />;
          }
        })}
      </div>
    </div>
  );
}
