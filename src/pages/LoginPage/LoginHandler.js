import axios from "axios";
import { loginURL } from "../../URL/signUpURL";
import { userActions } from "../../Store/user-slice";
import { loadingActions } from "../../Store/loading-slice";

export const loginUser = async (
  email,
  password,
  setLoading,
  dispatch,
  setClick,
  history
) => {
  try {
    setClick(true);
    dispatch(
      loadingActions.setLoading({
        isLoading: true,
        message: "Logging user in...",
      })
    );
    // setLoading("loggin in user");
    const response = await axios.post(loginURL, { email, password });

    // console.log("user login ---> ", response.data.data.user);
    // console.log("token --> ", response.data.token);

    localStorage.setItem("user_Obj", JSON.stringify(response.data.data.user));
    localStorage.setItem("token", response.data.token);
    dispatch(
      userActions.signUp({
        user: response.data.data.user,
        token: response.data.token,
      })
    );

    dispatch(
      loadingActions.setLoading({
        isLoading: false,
      })
    );

    history.push("/feed");

    // setLoading("");
  } catch (err) {
    setClick(false);
    console.log(err.response);
    dispatch(
      loadingActions.setLoading({
        isLoading: true,
        showSpinner: false,
        message: "Invalid Credentials",
        color: "red",
      })
    );
    // setLoading("Invalid Credentials");
  }
};
