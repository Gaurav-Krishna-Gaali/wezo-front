import Card from "../../../UI/Card";
import Input from "../../../UI/Input";
import classes from "./UserName.module.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { checkUserNameURL, setUsernameURL } from "../../../URL/signUpURL";
import Button from "../../../UI/Button";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { loadingActions } from "../../../Store/loading-slice";
import { userActions } from "../../../Store/user-slice";

const UserName = (props) => {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const user = useSelector((state) => state.user.userObj);
  const token = useSelector((state) => state.user.token);
  const unameRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const [userName, setUserName] = useState("");

  const inputHandler = (
    e,
    valid,
    render,
    red,
    message,
    setValid,
    setRender,
    setRed,
    setMessage
  ) => {
    const doneTyping = async () => {
      try {
        const res = await axios.get(checkUserNameURL + e.target.value.trim());
        console.log(res);
        if (res.data.available) {
          setRender(true);
          setMessage("Username available");
          setRed(false);
        } else {
          setRender(true);
          setMessage("Username not available");
          setRed(true);
        }
      } catch (err) {}
    };

    if (e.target.value.trim().length >= 3) {
      //   console.log(e.target.value);
      //   setRender(true);
      //   setMessage("erer");

      if (/^[A-Za-z][A-Za-z0-9_]{2,10}$/.test(e.target.value.trim())) {
        setRender(false);
        let typingTimer;
        let doneTypingInterval = 800;

        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
      } else {
        setRender(true);
        setMessage(
          "Username must be at least 3 letters and start with letter and can contain _ and letters"
        );
      }
    } else {
      setRender(false);
    }
  };

  const submitUnameHandler = async () => {
    try {
      if (unameRef.current.value.trim().length >= 3) {
        dispatch(
          loadingActions.setLoading({
            isLoading: true,
            showSpinner: false,
            message: "setting up your username...",
          })
        );

        const result = await axios.post(
          setUsernameURL,
          { uname: unameRef.current.value.trim().toLowerCase() },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const tempUser = {
          ...user,
          userID: result.data.userID,
        };
        dispatch(userActions.signUp({ user: tempUser, token: token }));
        localStorage.setItem("user_Obj", JSON.stringify(tempUser));

        dispatch(
          loadingActions.setLoading({
            isLoading: true,
            message: "username updated",
          })
        );

        setTimeout(function () {
          dispatch(
            loadingActions.setLoading({
              isLoading: false,
            })
          );
        }, 1000);

        history.push("/signup/addskills/");
      }
    } catch (err) {
      console.log(err);
      dispatch(
        loadingActions.setLoading({
          isLoading: true,
          message: "err",
          color: "red",
          forwardTo: "/signup/addusername",
        })
      );
    }
  };

  return (
    <Card custom={classes.customCard}>
      <div className={classes.logonstep}>
        <img
          className={classes.logo}
          alt="logo"
          src={isDarkMode ? "/images/wezo_dark.svg" : "/images/wezo_white.svg"}
        />
        <p className={classes.steps}>Step 2 of 4</p>
      </div>

      <h1
        className={`${classes.heading} ${
          isDarkMode ? classes.HeadingDark : ""
        }`}
      >
        Username
      </h1>
      <h1 className={classes.subHeading}>
        Pick a username that is easy to remember
      </h1>
      <Input
        custom={classes.customInput}
        onChange={inputHandler}
        placeHolder="username"
        ref={unameRef}
      />
      <Button custom={classes.btn} name="submit" onClick={submitUnameHandler} />
    </Card>
  );
};

export default UserName;
