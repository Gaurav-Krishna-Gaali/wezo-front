import axios from "axios";
import { signUpURL, sendVerificationURL } from "../../URL/signUpURL";
import { userActions } from "../../Store/user-slice";

import { loadingActions } from "../../Store/loading-slice";

// email validation
export function ValidateEmail(mail) {
  // eslint-disable-next-line no-useless-escape
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

export const signUp = async (
  name,
  email,
  password,
  passwordConfirm,
  dispatch,
  setMessage,
  setLoading,
  setClick
) => {
  try {
    // setLoading("Signing up please wait");
    dispatch(
      loadingActions.setLoading({
        isLoading: true,
        showSpinner: false,
        message: "Signing up user...",
      })
    );
    // setClick(true);
    // console.log("buttonClicked");
    const response = await axios.post(signUpURL, {
      name,
      email,
      password,
      passwordConfirm,
    });

    const temp = JSON.parse(response.request.response);
    localStorage.setItem("user_Obj", JSON.stringify(temp.data.user));
    localStorage.setItem("token", temp.token);

    dispatch(userActions.signUp({ user: temp.data.user, token: temp.token }));
    // setLoading("Sending email verification");
    dispatch(
      loadingActions.setLoading({
        isLoading: true,
        showSpinner: false,
        message: "Sending email verification",
      })
    );
    // now sending email verification request

    await axios.get(sendVerificationURL, {
      headers: {
        Authorization: `Bearer ${temp.token}`,
      },
    });
    // setClick(false);
    // setLoading("Verification link sent to email (valid for 10 mins)");
    dispatch(
      loadingActions.setLoading({
        isLoading: true,
        showSpinner: false,
        message:
          "Link to verify email sent to mail, you can close this tab now",
      })
    );
  } catch (err) {
    // setLoading(false);
    // setClick(false);
    console.log(err);
    if (err && err.response.data.data.err.code === 11000) {
      // setMessage(
      //   "An account exists with this mail address, try login or forgot password"
      // );

      console.log(err.response.data.data.err.code);

      dispatch(
        loadingActions.setLoading({
          isLoading: true,
          showSpinner: false,
          message:
            "An account exists with this mail address, try login or forgot password",
          color: "red",
        })
      );
    } else {
      dispatch(
        loadingActions.setLoading({
          isLoading: true,
          showSpinner: false,
          message: "An unknown error occurred :( ",
          color: "red",
        })
      );
    }
  }
};

export function nameListeners() {
  const nameOnChange = (
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
    if (e.target.value.trim().length < 3) {
      setValid(false);
    } else {
      setValid(true);
    }
  };

  const nameOnFocus = (
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
    if (e.target.value.trim().length < 3) {
      if (message === "Message") {
        setMessage("Name must be at least 3 chars long");
      }
      setRender(true);
      if (red) {
        setRed(false);
      }
    }
  };

  const nameOnBlur = (
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
    if (e.target.value.trim().length < 3) {
      setRed(true);
    } else {
      setValid(true);
    }
  };
  return { nameOnChange, nameOnFocus, nameOnBlur };
}

export function emailListeners() {
  const emailOnBlur = (
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
    if (!ValidateEmail(e.target.value.trim())) {
      setRed(true);
      setRender(true);
      setMessage("Invalid email address");

      if (valid) {
        setValid(false);
      }
    } else {
      setValid(true);
    }
  };

  const emailOnFocus = (
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
    if (!valid) {
      setRed(false);
    }
  };

  const emailOnChange = (
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
    if (render) {
      if (ValidateEmail(e.target.value.trim())) {
        setValid(true);
      }
    }
  };
  return { emailOnBlur, emailOnFocus, emailOnChange };
}

export function passwordListeners(inpCpass) {
  const passwordOnBlur = (
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
    if (e.target.value.trim().length < 8) {
      setRed(true);
      setRender(true);
      setMessage("Minimum password length is 8 chars");

      if (valid) {
        setValid(false);
      }
    } else {
      setValid(true);
    }
  };

  const passwordOnFocus = (
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
    if (!valid) {
      setRed(false);
    }
  };

  const passwordOnChange = (
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
    if (render) {
      if (e.target.value.trim().length >= 8) {
        setValid(true);
      }
    }
    if (inpCpass.current.value.length !== 0) {
      if (inpCpass.current.value.trim() !== e.target.value.trim()) {
        if (valid) {
          setValid(false);
        }
        if (!render) {
          setRender(true);
        }
        if (
          message === "Message" ||
          message === "Minimum password length is 8 chars"
        ) {
          setMessage("Passwords don't match !");
        }
      }
    }
  };
  return { passwordOnBlur, passwordOnFocus, passwordOnChange };
}

export function passwordClisteners(password) {
  const passwordCOnBlur = (
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
    if (password.current.value.trim() !== e.target.value.trim()) {
      setRed(true);
      setRender(true);
      setMessage("Passwords don't match");

      if (valid) {
        setValid(false);
      }
    } else {
      setValid(true);
    }
  };

  const passwordCOnFocus = (
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
    if (!valid) {
      setRed(false);
    }
  };

  const passwordCOnChange = (
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
    if (render || !valid) {
      if (password.current.value.trim() === e.target.value.trim()) {
        setValid(true);
      } else {
        setValid(false);
      }
    }
  };
  return { passwordCOnBlur, passwordCOnFocus, passwordCOnChange };
}
