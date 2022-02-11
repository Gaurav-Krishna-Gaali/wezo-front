import classes from "./Card.module.css";
import { useSelector } from "react-redux";

const Card = (props) => {
  // const isDarkMode = useSelector((state) => state.theme.darkMode);
  const isDarkMode = true;
  // console.log("card");

  return (
    <div
      onMouseEnter={props.onMouseEnter ? props.onMouseEnter : null}
      onMouseLeave={props.onMouseLeave ? props.onMouseLeave : null}
      style={props.inLine}
      className={`${classes.card} ${isDarkMode ? classes["card-dark-mode"] : ""} ${
        props.width ? classes["card-width-" + props.width] : ""
      } ${props.custom ? props.custom : ""}`}
    >
      {props.children}
    </div>
  );
};
export default Card;
