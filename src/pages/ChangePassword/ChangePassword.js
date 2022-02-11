// using same classes from login
import classes from "../LoginPage/Login.module.css";

import Button from "../../UI/Button";
import Card from "../../UI/Card";
import Input from "../../UI/Input";
import React, { useState } from "react";
import Loading from "../../UI/Loading";

import { passwordListeners, passwordClisteners } from "../signUP/SignUpHandlers";
import { resetFunction } from "./ChangePasswordHandler";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ChangePassword = (props) => {
  const password = React.createRef();
  const passwordConfirm = React.createRef();
  const [loading, setLoading] = useState(["", "valid"]);

  const dispatch = useDispatch();
  // token as param
  const params = useParams();
  const resetToken = params.RestToken;

  // password listeners
  const { passwordOnBlur, passwordOnFocus, passwordOnChange } = passwordListeners(passwordConfirm);

  // password confirm listeners
  const { passwordCOnBlur, passwordCOnFocus, passwordCOnChange } = passwordClisteners(password);

  // change password handler

  const changePasswordHandler = async (e, setClick) => {
    e.preventDefault();
    if (password.current.value.trim() === passwordConfirm.current.value.trim()) {
      let pass = password.current.value.trim();
      let Cpass = passwordConfirm.current.value.trim();

      await resetFunction(pass, Cpass, setLoading, dispatch, setClick, resetToken);
    } else {
      setLoading(["Err passwords don't match", "invalid"]);
    }
  };

  return (
    <Card>
      <form className={classes.form}>
        <Input
          placeHolder="Password"
          ref={password}
          onBlur={passwordOnBlur}
          onFocus={passwordOnFocus}
          onChange={passwordOnChange}
          type="password"
        />
        <Input
          placeHolder="Confirm Password"
          ref={passwordConfirm}
          onBlur={passwordCOnBlur}
          onFocus={passwordCOnFocus}
          onChange={passwordCOnChange}
          type="password"
        />
        <Button type="submit" onClick={changePasswordHandler} name="Change password" />
        {loading[0] !== "" ? <Loading text={loading[0]} addClass={loading[1] + " right loadingMessage"} /> : null}
      </form>
    </Card>
  );
};

export default ChangePassword;
