import React from "react";
import "./ActionButton.css";

const ActionButton = (props) => {
  const { text, className = "buttonStyle" } = props;
  return (
    <div className="buttonSize">
      <button className={className}>{text}</button>
    </div>
  );
};

export default ActionButton;