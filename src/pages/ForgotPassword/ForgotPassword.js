import axios from "axios";
import { useCallback } from "react";
import Button from "../../UI/Button";
import Card from "../../UI/Card";
import Input from "../../UI/Input";
import { emailListeners, ValidateEmail } from "../signUP/SignUpHandlers";
import { useRef, useState } from "react";
import Loading from "../../UI/Loading";
import { forgotPass } from "./ForgotPasswordHandler";

// will be using same classes from login
import classes from "../LoginPage/Login.module.css";

const ForgotPassword = (props) => {
  const email = useRef();
  const [loading, setLoading] = useState(["", "valid"]);

  const resetPasswordHandler = async (e, setClick) => {
    e.preventDefault();

    if (!ValidateEmail(email.current.value.trim())) {
      setLoading("Invalid email address");
    } else {
      await forgotPass(email.current.value.trim(), setLoading, setClick);
    }
  };

  const { emailOnBlur, emailOnFocus, emailOnChange } = emailListeners();
  return (
    <Card>
      <form className={classes.form}>
        <Input
          onFocus={emailOnFocus}
          onBlur={emailOnBlur}
          onChange={emailOnChange}
          ref={email}
          placeHolder="Email address"
        />
        <Button type="submit" onClick={resetPasswordHandler} name="Reset password" />
        {loading[0] !== "" ? <Loading text={loading[0]} addClass={loading[1] + " right loadingMessage"} /> : null}
      </form>
    </Card>
  );
};

export default ForgotPassword;
