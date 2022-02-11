import axios from "axios";
import { forgotPasswordURL } from "../../URL/signUpURL";

export const forgotPass = async (email, setLoading, setClick) => {
  try {
    setClick(true);
    setLoading(["Sending reset link to mail", "valid"]);

    await axios.post(forgotPasswordURL, { email });

    // console.log("user login ---> ", response.data.data.user);
    // console.log("token --> ", response.data.token);

    setLoading(["Reset link sent to mail", "valid"]);
  } catch (err) {
    setClick(false);
    console.log(err.response);
    setLoading(["err user doesn't exist", "invalid"]);
  }
};
