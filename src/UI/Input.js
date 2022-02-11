import { forwardRef, useState, Fragment } from "react";
import FormError from "./FormError";
import showPwdImg from "../UI images/eye.svg";
import hidePwdImg from "../UI images/eye-slash.svg";
import { useSelector } from "react-redux";
import "./Input.css";

const Input = forwardRef((props, ref) => {
  const [valid, setValid] = useState(false);
  const [render, setRender] = useState(false);
  const [red, setRed] = useState(false);
  const [message, setMessage] = useState("Message");
  const [passType, setPassType] = useState(props.type);
  const [eye, setEye] = useState(showPwdImg);
  const [val, setVal] = useState(props.defaultValue);

  //dark mode
  const isDarkMode = useSelector((state) => state.theme.darkMode);

  const showPasswordHandler = () => {
    if (eye === showPwdImg) {
      setEye(hidePwdImg);
    } else if (eye === hidePwdImg) {
      setEye(showPwdImg);
    }

    if (passType === "text") {
      setPassType("password");
    } else {
      setPassType("text");
    }

    console.log("clicked on show pass");
  };

  console.log("boo", props.placeHolder);

  return (
    <Fragment>
      <div className="pwd-container">
        <input
          className={`${isDarkMode ? "input input-dark-mode" : "input"} ${
            props.custom ? props.custom : ""
          }`}
          placeholder={props.placeHolder}
          ref={ref}
          type={passType ? passType : "text"}
          value={props.defaultValue ? val : undefined}
          autoFocus={props.autoFocus}
          onChange={
            props.onChange
              ? (e) =>
                  props.onChange(
                    e,
                    valid,
                    render,
                    red,
                    message,
                    setValid,
                    setRender,
                    setRed,
                    setMessage,
                    setVal
                  )
              : null
          }
          onFocus={
            props.onFocus
              ? (e) =>
                  props.onFocus(
                    e,
                    valid,
                    render,
                    red,
                    message,
                    setValid,
                    setRender,
                    setRed,
                    setMessage
                  )
              : null
          }
          onBlur={
            props.onBlur
              ? (e) =>
                  props.onBlur(
                    e,
                    valid,
                    render,
                    red,
                    message,
                    setValid,
                    setRender,
                    setRed,
                    setMessage
                  )
              : null
          }
        />
        {props.placeHolder === "Password" ? (
          <img src={eye} onClick={showPasswordHandler} />
        ) : (
          ""
        )}
        {props.placeHolder === "Confirm Password" ? (
          <img src={eye} onClick={showPasswordHandler} />
        ) : (
          ""
        )}
      </div>

      {!valid && render ? <FormError message={message} invalid={red} /> : null}
    </Fragment>
  );
});

export default Input;
