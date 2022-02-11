import classes from "./LoadingSpinner.module.css";
import { GuardSpinner } from "react-spinners-kit";
import { useSelector, useDispatch } from "react-redux";
import { loadingActions } from "../Store/loading-slice";
import { useRef } from "react";
import { Link } from "react-router-dom";

const LoadingSpinner = (props) => {
  let Loading = useSelector((state) => state.loading);
  const isDarkMode = useSelector((state) => state.theme.darkMode);

  if (props.loading) {
    Loading = {
      color: "green" || props.color,
      message: props.loading,
      forwardTo: "/" || props.forwardTo,
    };
  }

  let style = {
    backgroundColor: "#fefefe",
    color: "#656565",
  };

  if (isDarkMode) {
    style = { backgroundColor: "#3f3f3f", color: "#fefefe" };
  }

  if (Loading.color === "red") {
    style = { ...style, color: "red" };
  }

  const dispatch = useDispatch();
  const tryAgainHandler = () => {
    dispatch(
      loadingActions.setLoading({
        isLoading: false,
        message: "Invalid email or password, try again",
        color: "red",
      })
    );
  };

  const pageLevelTryAgain = () => {};

  return (
    <div className={classes.backdrop} style={style}>
      <div id={`${classes.container}`}>
        <GuardSpinner color={"#2ba272"} loading={true} />
        <div className={classes.mess}>
          <p className={`${classes.loadingMessage} normal`}>
            {Loading.message}
          </p>
          {Loading.color === "red" ? (
            <Link
              onClick={props.loading ? pageLevelTryAgain : tryAgainHandler}
              className={classes.linkStyle}
              to={Loading.forwardTo ? Loading.forwardTo : ""}
            >
              try again?
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

// {/* <div className={classes.backdrop}>
//   <div className={classes.spinner}>
//     <GuardSpinner color={"#2ba272"} loading={true} />
// <div className={classes.mess}>
//   <p className={classes.loadingMessage}>{Loading.message}</p>
// </div>
//   </div>
// </div>; */}
