import classes from "./patch.module.css";
import P from "../../../UI/P";
import Button from "../../../UI/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { amIFollowingURL, followURL } from "../../../URL/signUpURL";
import { useHistory } from "react-router-dom";
export const amIFollowing = async (url, token, id, setBtnTxt) => {
  try {
    const result = await axios.post(
      url,
      { following: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (result.data.data.split(" ")[0] === "1") {
      setBtnTxt("Following");
    } else {
      setBtnTxt("Follow");
    }
  } catch (err) {
    console.log("err in finding out if you follow each other or not");
  }
};

export const followSomeOne = async (url, token, id) => {
  try {
    const result = await axios.post(
      url,
      { follow: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.log("err in following :(", err);
  }
};

const ProfilePatchV2 = (props) => {
  const user = props.user;
  let profile;
  const [btnTxt, setBtnTxt] = useState();
  const history = useHistory();

  useEffect(() => {
    if (!props.token) {
      return;
    }

    if (props.myProfile && props.usedAs === "following") {
      setBtnTxt("Following");
      return;
    } else {
      amIFollowing(amIFollowingURL, props.token, user._id, setBtnTxt);
    }
  }, [props.token]);

  if (user.profile) {
    profile = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/" + user.profile.replace("$", "%24");
  } else if (!user.profile) {
    profile = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/default.png";
  }

  const profileHandler = () => {
    props.close();
    history.push("/profile/" + user.userID);
  };

  const followHandler = () => {
    console.log("Follow clicked", btnTxt);
    setBtnTxt((p) => (p === "Following" ? "Follow" : "Following"));
    followSomeOne(followURL, props.token, user._id);
  };

  return (
    <div key={props.index}>
      <div></div>
      <div className={classes.main}>
        <img className={classes.profile} src={profile} alt="" onClick={profileHandler} />
        <div className={classes.areaOneH}>
          <div className={classes.areaOneV}>
            <h1 onClick={profileHandler} className={classes.name}>
              {user.name}
            </h1>
            <h3 className={classes.userID}>@{user.userID}</h3>
          </div>
          <Button
            custom={`${classes.btn} ${btnTxt ? "" : classes.displayNone} ${
              btnTxt === "Following" || btnTxt === "following" ? classes.following : ""
            } ${user.userID === props.loggedUserID ? classes.displayNone : ""}`}
            onClick={followHandler}
            name={btnTxt}
          />
        </div>

        <P emoji={classes.emoji} className={classes.p} text={user.bio} />
      </div>
      <div></div>
    </div>
  );
};

export default ProfilePatchV2;
