import classes from "./Button.module.css";
import { useState } from "react";
import { RotateSpinner } from "react-spinners-kit";

const Button = (props) => {
  const [click, setClick] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log("Button render");

  return (
    <button
      type={props.type}
      onClick={(e) => {
        props.onClick(e, setLoading);
      }}
      // style={{ paddingTop: "8px", paddingBottom: "8px" }}
      className={`${classes.button} ${props.custom ? props.custom : ""} ${loading ? classes.disabled : ""}`}
    >
      {loading === true ? <RotateSpinner sizeUnit="em" size={1.5} color={"#2ba272"} loading={true} /> : props.name}
      {/* {props.name} */}
    </button>
  );
};

export default Button;
//${click ? classes.disabled : ""}
