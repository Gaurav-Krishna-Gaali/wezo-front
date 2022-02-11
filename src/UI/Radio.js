import { Fragment, useState } from "react";
import classes from "./Radio.module.css";
import { useSelector } from "react-redux";

import radioFilled from "../UI/imgs/radio-filled.svg";
import radioEmpty from "../UI/imgs/radio-empty.svg";

const Radio = (props) => {
  const [radio, setRadio] = useState(radioEmpty);
  const isDarkMode = useSelector((state) => state.theme.darkMode);

  return (
    <Fragment>
      <div
        className={classes.div}
        onClick={(e) => {
          props.onClick(radio, setRadio, radioFilled, radioEmpty);
        }}
      >
        <img name="radio" className={classes.radio} alt="radio button" src={radio} />
        <label className={isDarkMode ? `${classes["radio-txt-dark-mode"]} ${classes["radio-txt"]}` : classes["radio-txt"]}>
          {props.text}
        </label>
      </div>
    </Fragment>
  );
};

export default Radio;
