import Card from "../../UI/Card";
import Loading from "../../UI/Loading";
import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect, useCallback, Fragment } from "react";
import axios from "axios";
import { verifyEmailURL } from "../../URL/signUpURL";
import { loadingActions } from "../../Store/loading-slice";
import { useDispatch } from "react-redux";

const VerifyEmail = (props) => {
  // token as param
  const params = useParams();
  const EmailToken = params.EmailToken;
  console.log(EmailToken);
  // // setting loading state
  // const [message, setMessage] = useState("Verifying Email..");
  // const [valid, setValid] = useState("valid center loadingMessage");
  const dispatch = useDispatch();

  const history = useHistory();

  // use callback stores the functions and reuses them and doesnt reevaluate
  const verifyEmail = useCallback(async (token) => {
    try {
      dispatch(
        loadingActions.setLoading({
          isLoading: true,
          showSpinner: false,
          message: "verifying your email...",
        })
      );

      const response = await axios.get(verifyEmailURL + token);
      console.log(response);

      dispatch(
        loadingActions.setLoading({
          isLoading: true,
          showSpinner: false,
          message: "email verified, redirecting the user...",
        })
      );

      history.push("/signup/uploadProfile");

      dispatch(
        loadingActions.setLoading({
          isLoading: false,
        })
      );
    } catch (err) {
      console.log(err);

      dispatch(
        loadingActions.setLoading({
          isLoading: true,
          showSpinner: false,
          message:
            "Token invalid or expired, try logging in to get a new token",
          color: "red",
          forwardTo: "/login",
        })
      );

      // setMessage("Err in verifying the user...!");
      // setValid("invalid center loadingMessage");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    verifyEmail(EmailToken);
  }, [EmailToken, verifyEmail]);

  return <Fragment></Fragment>;
};

export default VerifyEmail;
