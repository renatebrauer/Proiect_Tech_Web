import React, { useRef, useState } from "react";
import "./Input.css";

const Input = (props) => {
  const inputRef = useRef();
  const { type, defaultValue = "", handleValue = () => {}, field = "" , value= ""} = props;
  const [inputVal] = useState(value);
  
  return (
    <div className="inputContainer">
      <input ref={inputRef} type={type} className="inputStyle" placeholder={defaultValue} onChange={() => handleValue(inputRef.current.value, field)}/>
    </div>
  );
};

export default Input;