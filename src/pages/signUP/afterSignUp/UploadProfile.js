import Card from "../../../UI/Card";
import EditImage from "../../../UI/cropper/EditImage";
import classes from "./UploadProfile.module.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { profilePreURL, profileStatus } from "../../../URL/signUpURL";
import { loadingActions } from "../../../Store/loading-slice";
import { userActions } from "../../../Store/user-slice";

import { useHistory } from "react-router-dom";

import Button from "../../../UI/Button";

const profile = {
  imageURL: "/images/profile.png",
};

export function srcToFile(src, fileName, mimeType) {
  return fetch(src)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], fileName, { type: mimeType });
    });
}

const UploadProfile = (props) => {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const history = useHistory();

  const [result, setResult] = useState(null);
  console.log("cropped image ready to upload -->", result);

  // token for auth
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.userObj);

  // uploading profile
  const uploadHandler = async (event, setClick) => {
    if (result != null) {
      try {
        dispatch(
          loadingActions.setLoading({
            isLoading: true,
            message: "Setting up your profile pic",
          })
        );

        const url = await axios.get(profilePreURL + "/" + result.type.split("/").slice(-1) + "/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const file = await srcToFile(result.img, "profile." + result.type.split("/").slice(-1), result.type);

        // console.log("sending", file);
        // uploading to filesystem
        const sending = await axios.put(url.data.url, file, {
          headers: {
            "Content-Type": "image/" + result.type.split("/").slice(-1),
          },
        });

        dispatch(
          loadingActions.setLoading({
            isLoading: true,
            message: "upload successful :)",
          })
        );

        // /api/v1/users/profileStatus/users/profile/WzGyOG$1634795237431.jpg/profile

        if (sending.status === 200) {
          console.log("updating profile status", url.data.fileName.split("/"));
          await axios.get(profileStatus + url.data.fileName.split("/")[2] + "/profile", {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
        }

        dispatch(
          loadingActions.setLoading({
            isLoading: false,
          })
        );

        //setting up the local info

        const temp = { ...user, profile: url.data.fileName.split("/")[2] };

        // const temp = JSON.parse(modi);

        localStorage.setItem("user_Obj", JSON.stringify(temp));

        dispatch(userActions.signUp({ user: temp, token: token }));

        history.push("/signup/addusername");

        console.log("res", sending);
      } catch (err) {
        console.log("err in uploading", err);
        dispatch(
          loadingActions.setLoading({
            isLoading: true,
            message: "err in uploading profile",
            color: "red",
            forwardTo: "/signup/uploadProfile",
          })
        );
      }
    }
  };

  return (
    <Card custom={classes.customCard}>
      <div className={classes.logonstep}>
        <img
          className={classes.logo}
          alt="logo"
          src={isDarkMode ? "/images/wezo_dark.svg" : "/images/wezo_white.svg"}
        />
        <p className={classes.steps}>Step 1 of 4</p>
      </div>
      <h1 className={`${classes.heading} ${isDarkMode ? classes.HeadingDark : ""}`}>Upload a profile picture..!</h1>
      <h1 className={classes.subHeading}>Adding a photo helps your friends identify you</h1>
      <EditImage className={classes.uploadProfile} default={profile} aspect={1 / 1} sendPic={setResult} />

      <Button custom={classes.button} name="Upload" onClick={uploadHandler} />

      <Link className={classes.link} to="/signup/addusername">
        Skip for now
      </Link>
    </Card>
  );
};

export default UploadProfile;
