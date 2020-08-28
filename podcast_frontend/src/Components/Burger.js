/**This component is for toggling side bars on and off */
import React from "react";

export default function Burger({change, sidebar}) {
  return (
    <div className="burgerContainer" onClick={() => change(!sidebar)}>
      <div className="burger"></div>
    </div>
  );
}
