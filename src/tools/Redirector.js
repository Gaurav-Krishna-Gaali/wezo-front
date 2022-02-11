import { useLocation, useHistory } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { githubCodeURL } from "../URL/signUpURL";
import { GuardSpinner } from "react-spinners-kit";
import { ToastContainer, toast } from "react-toastify";
import classes from "./redirector.module.css";
const sendCode = async (url, token, code, history, state, setLoading, notify) => {
  try {
    setLoading(true);
    const result = await axios.get(url + code, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setLoading(false);
    if (result.data.userID) {
      history.replace(state + "/addFromGithub");
    }
    // console.log(result);
  } catch (err) {
    console.error("redirecting to import projects from github", err.response.data);
    if (err.response.data) {
      if (err.response.data.code === "g1") {
        notify("This github account is already linked with other profile", { type: toast.TYPE.ERROR, autoClose: 2000 });

        history.replace(state);
      }
    }
  }
};

const Redirector = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const toastId = useRef(null);
  const [err, setErr] = useState();

  const code = new URLSearchParams(location.search).get("code");
  const state = new URLSearchParams(location.search).get("state");

  const notify = (message, details = null) =>
    (toastId.current = toast(message, {
      autoClose: false,
      ...details,
      bodyClassName: classes.bodyToast,
      className: classes.containerToast,
    }));

  useEffect(() => {
    if (code && state && props.token) {
      // history.push(state + "/" + code);
      sendCode(githubCodeURL, props.token, code, history, state, setLoading, notify);
    }
  }, [props.token]);

  const update = (message, autoClose = 1000, details = null) =>
    toast.update(toastId.current, {
      render: message,
      type: toast.TYPE.SUCCESS,
      autoClose: autoClose,
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      ...details,
    });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GuardSpinner color={"#2ba272"} loading={loading} />
      </div>
    );
  }

  return <div>{/* Redirecting, {code}, {state} */}</div>;
};

export default Redirector;
