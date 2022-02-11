import Input from "../../UI/Input";
import Card from "../../UI/Card";
import Button from "../../UI/Button";
import classes from "./Login.module.css";
import { emailListeners, ValidateEmail } from "../signUP/SignUpHandlers";
import { useRef, useState } from "react";
import { loginUser } from "./LoginHandler";
import Loading from "../../UI/Loading";
import { useDispatch } from "react-redux";
import { loadingActions } from "../../Store/loading-slice";
import { useHistory } from "react-router-dom";

const Login = (props) => {
  const email = useRef();
  const password = useRef();
  const history = useHistory();

  const [loading, setLoading] = useState("");

  const { emailOnBlur, emailOnFocus, emailOnChange } = emailListeners();

  // redux state
  const dispatch = useDispatch();

  const loginHandler = async (e, setClick) => {
    e.preventDefault();
    if (
      !ValidateEmail(email.current.value.trim()) ||
      password.current.value.trim().length < 8
    ) {
      dispatch(
        loadingActions.setLoading({
          isLoading: true,
          message: "Invalid email or password, try again",
          color: "red",
        })
      );
      // setLoading("Invalid email or password, try again");
    } else {
      await loginUser(
        email.current.value.trim(),
        password.current.value.trim(),
        setLoading,
        dispatch,
        setClick,
        history
      );
    }
  };

  // dont know y but signup css classes are working here too
  // look at forgot password and signup

  //loading animation

  // console.log("is it loading", isLoading);

  return (
    <Card>
      <form className={classes.form}>
        <Input
          ref={email}
          placeHolder="Email"
          type="email"
          onChange={emailOnChange}
          onBlur={emailOnBlur}
          onFocus={emailOnFocus}
          autoFocus={true}
        />
        <Input
          ref={password}
          placeHolder="Password"
          type="password"
          autoFocus={false}
        />
        <Button type="submit" onClick={loginHandler} name="Sign In" />
      </form>
    </Card>
  );
};
export default Login;

// {/* {loading !== "" ? (
//           <Loading text={loading} addClass="valid right loadingMessage" />
//         ) : null} */}
