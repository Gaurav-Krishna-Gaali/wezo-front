import axios from "axios";
import { resetPasswordURL } from "../../URL/signUpURL";
import { userActions } from "../../Store/user-slice";

export const resetFunction = async (password, passwordConfirm, setLoading, dispatch, setClick, token) => {
  try {
    setClick(true);
    setLoading(["validating your request", "valid"]);

    console.log(resetPasswordURL + token);
    const response = await axios.patch(resetPasswordURL + token, { password, passwordConfirm });

    // console.log("user login ---> ", response.data.data.user);
    // console.log("token --> ", response.data.token);

    localStorage.setItem("user_Obj", JSON.stringify(response.data.data.user));
    localStorage.setItem("token", response.data.token);
    dispatch(userActions.signUp({ user: response.data.data.user, token: response.data.token }));
    setLoading(["password changed successfully, You can close this tab now", "valid"]);
    setClick(false);
  } catch (err) {
    setClick(false);

    setLoading(["Err invalid token", "invalid"]);
  }
};
