// import { Link } from "react-router-dom";
// import Button from "../../UI/Button";
import LinkButton from "../../UI/LinkButton";
import classes from "./LandingPage.module.css";
import Toggle from "../../UI/Toggle";
import VideoJS from "../Player/VideoJS";
import { useSelector, useDispatch } from "react-redux";
// for testing purpose
import P from "../../UI/P";
const LandingPage = (props) => {
  const loggedUser = useSelector((state) => state.user.userObj);
  return (
    <>
      <header className={classes.header}>
        <nav className={classes.nav}>
          <ul>
            <li>
              <LinkButton text="Sign Up" to="/signup" />
            </li>

            <li>
              <LinkButton text="Login" to="/login" />
            </li>
            <li>
              <LinkButton text="Forgot password" to="/forgotPassword" />
            </li>
            <li>
              <LinkButton text="Feed" to="/feed" />
            </li>
            <li>
              <LinkButton text="my profile" to={"/profile/" + loggedUser.userID} />
            </li>
            <li>
              <Toggle />
            </li>
          </ul>
        </nav>
      </header>
      <p>Landing page</p>
      <div className={classes.videoContainer}>
        <VideoJS />
      </div>

      <P text="hello #python world https://www.npmjs.com/package/#valid-url haha #react_native #redis #android_development #java #mongodb hello #python world https://www.npmjs.com/package/#valid-url haha #react_native #redis #android_development #java #mongodb" />
    </>
  );
};

export default LandingPage;
