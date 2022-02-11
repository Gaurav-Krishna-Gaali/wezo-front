import Card from "../../UI/Card";
import Input from "../../UI/Input.js";
import "./Signup.css";
import Button from "../../UI/Button";
import FormError from "../../UI/FormError";
import { Link } from "react-router-dom";
import Radio from "../../UI/Radio";
import { useSelector } from "react-redux";
import { loadingActions } from "../../Store/loading-slice";
import UserName from "./afterSignUp/UserName";
import { Switch, Route } from "react-router-dom";

import {
  signUp,
  ValidateEmail,
  nameListeners,
  emailListeners,
  passwordListeners,
  passwordClisteners,
} from "./SignUpHandlers";

import Loading from "../../UI/Loading";

import { useDispatch } from "react-redux";

import React, { Fragment, useState } from "react";

const SignUp = (props) => {
  const dispatch = useDispatch();

  const name = React.createRef();
  const email = React.createRef();
  const password = React.createRef();
  const passwordConfirm = React.createRef();

  console.log("app");

  // state for 11000 err
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState("");

  // state for terms and conditions
  const [agree, setAgree] = useState(false);

  const signUpHandler = (e, setClick) => {
    e.preventDefault();
    const inpName = name.current.value.trim();
    const inpEmail = email.current.value.trim();
    const inpPass = password.current.value.trim();
    const inpCpass = passwordConfirm.current.value.trim();

    if (
      inpName.length >= 3 &&
      ValidateEmail(inpEmail.trim()) &&
      inpPass.length >= 8 &&
      inpPass === inpCpass &&
      agree
    ) {
      console.log("submit sucess full");
      signUp(
        inpName,
        inpEmail,
        inpPass,
        inpCpass,
        dispatch,
        setErr,
        setLoading,
        setClick
      );
    } else {
      dispatch(
        loadingActions.setLoading({
          isLoading: true,
          showSpinner: false,
          message: "Invalid Credentials",
          color: "red",
        })
      );
    }
  };

  // name listeners
  const { nameOnChange, nameOnFocus, nameOnBlur } = nameListeners();

  // email listeners
  const { emailOnBlur, emailOnFocus, emailOnChange } = emailListeners();

  // password listeners
  const { passwordOnBlur, passwordOnFocus, passwordOnChange } =
    passwordListeners(passwordConfirm);

  // password confirm listeners
  const { passwordCOnBlur, passwordCOnFocus, passwordCOnChange } =
    passwordClisteners(password);

  // TODO: implement error handler for direct click on submit
  // with out touching the input fields

  // radio button handler
  const radioHandler = (radio, setRadio, radioFilled, radioEmpty) => {
    if (radio === radioEmpty) {
      setAgree(true);
      setRadio(radioFilled);
    } else {
      setRadio(radioEmpty);
      setAgree(false);
    }
  };

  // darkmode settings
  const isDarkMode = useSelector((state) => state.theme.darkMode);

  return (
    <Fragment>
      <Card>
        <img
          className="signupSVG"
          src="https://wezo-media.s3.ap-south-1.amazonaws.com/UI/signUP.svg"
          alt="two people working together"
        />

        <form className="form">
          <h3
            className={`${
              isDarkMode
                ? "main-heading main-heading-dark-mode"
                : "main-heading"
            }`}
          >
            Sign Up
          </h3>
          {err !== "" ? <FormError message={err} invalid={true} /> : null}
          <Input
            placeHolder="Name"
            ref={name}
            onChange={nameOnChange}
            onFocus={nameOnFocus}
            onBlur={nameOnBlur}
            autoFocus={true}
          />
          <Input
            placeHolder="Email"
            ref={email}
            onBlur={emailOnBlur}
            onFocus={emailOnFocus}
            onChange={emailOnChange}
          />
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
          <Radio
            text="I have read and agreed to WeZo terms of service"
            onClick={radioHandler}
          />
          <Button name="Sign Up" onClick={signUpHandler} type="submit" />
          <p
            className={`${
              isDarkMode ? "toOther toOther-dark-mode" : "toOther"
            }`}
          >
            Already have an account ?&nbsp;
            {
              <Link className="link" to="/login">
                Sign in
              </Link>
            }
          </p>

          {loading !== "" ? (
            <Loading text={loading} addClass="loadingMessage valid right" />
          ) : null}
        </form>
      </Card>
    </Fragment>
  );
};

export default SignUp;
