import Card from "../../../UI/Card";
import classes from "./Bio.module.css";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../../UI/Button";
import axios from "axios";
import { addBio } from "../../../URL/signUpURL";
import { loadingActions } from "../../../Store/loading-slice";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export function autosize(e) {
  e.target.style.height = "inherit";

  // Get the computed styles for the element
  const computed = window.getComputedStyle(e.target);

  // Calculate the height
  const height =
    parseInt(computed.getPropertyValue("border-top-width"), 10) +
    parseInt(computed.getPropertyValue("padding-top"), 10) +
    e.target.scrollHeight +
    parseInt(computed.getPropertyValue("padding-bottom"), 10) +
    parseInt(computed.getPropertyValue("border-bottom-width"), 10);

  e.target.style.height = `${height}px`;
}

const Bio = (props) => {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const textArea = useRef();
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const history = useHistory();

  const typingHandler = (e) => {
    if (e.target.value.length <= 165) {
      setText(e.target.value);
    }
  };

  const nextHandler = async (e, setClick) => {
    if (text.length > 0) {
      dispatch(
        loadingActions.setLoading({
          isLoading: true,
          showSpinner: false,
          message: "Adding your bio...",
        })
      );

      e.preventDefault();
      const res = await axios.post(
        addBio,
        { bio: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        loadingActions.setLoading({
          isLoading: true,
          message: "Bio added successfully",
        })
      );

      setTimeout(function () {
        dispatch(
          loadingActions.setLoading({
            isLoading: false,
          })
        );
      }, 1000);

      history.push("/");

      console.log(res);
    }
  };

  console.log("texxxxtt", text);

  return (
    <Card custom={classes.card}>
      <div className={classes.logonstep}>
        <img
          className={classes.logo}
          alt="logo"
          src={isDarkMode ? "/images/wezo_dark.svg" : "/images/wezo_white.svg"}
        />
        <p className={classes.steps}>Step 4 of 4</p>
      </div>
      <h1
        className={`${classes.heading} ${
          isDarkMode ? classes.HeadingDark : ""
        }`}
      >
        Let the world know more about yourself..!
      </h1>
      <h1 className={classes.subHeading}>
        Add a splash of personality and mention something that you love
      </h1>
      <div className={classes.content}>
        <textarea
          rows="4"
          cols="4"
          ref={textArea}
          className={`${classes.bio} ${isDarkMode ? classes["bio-dark"] : ""}`}
          onChange={typingHandler}
          onKeyDown={autosize}
          placeholder="Your Bio Here"
          value={text}
        ></textarea>
        <p className={classes.count}>{165 - text.length}</p>
      </div>
      <Button
        custom={classes.button}
        onClick={nextHandler}
        name="Next"
        type="submit"
      />
      <Link className={classes.link} to="/feed">
        Skip for now
      </Link>
    </Card>
  );
};

export default Bio;
