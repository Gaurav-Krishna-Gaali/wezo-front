import classes from "./profilepatch.module.css";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import P from "../../../UI/P";
import Button from "../../../UI/Button";
import { Fragment, useState } from "react";
import { amIFollowingURL, followURL } from "../../../URL/signUpURL";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const checkItOut = async (url, token, id, setAmIfollowing) => {
  try {
    const result = await axios.post(
      url,
      { following: id },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!result.data) {
      return;
    }

    if (result.data.data.split(" ")[0] === "1") {
      setAmIfollowing("following");
    }

    // console.log(result);
  } catch (err) {
    console.log("error in profile patch checkitout");
  }
};

const ProfilePatch = (props) => {
  const [amIfollowing, setAmIfollowing] = useState("follow");
  const history = useHistory();
  const loggedUser = useSelector((state) => state.user.userObj);

  useEffect(() => {
    if (props.token && loggedUser) {
    } else {
      return;
    }

    if (props.whosePageIsIt == loggedUser.userID && props.type === "following") {
      setAmIfollowing("following");
      return;
    }

    checkItOut(amIFollowingURL, props.token, props._id, setAmIfollowing);
  }, [props.token]);

  const profileClickHandler = () => {
    // console.log("clicked");
    props.closeHandler();
    history.push("/profile/" + props.userID);
  };

  const btnClickHandler = async () => {
    try {
      setAmIfollowing((p) => {
        if (p === "following") {
          return "follow";
        } else {
          return "following";
        }
      });
      const result = await axios.post(
        followURL,
        { follow: props._id },
        {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        }
      );

      // console.log("follow btn click in patch", result);
    } catch (err) {
      console.log("err in btn click patch follow", err);
    }
  };

  let profile;

  if (props.profile) {
    profile = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/" + props.profile.replace("$", "%24");
  } else {
    profile = "/images/profile.png";
  }

  return (
    <Fragment>
      <div className={classes.mainDiv}>
        <img
          onClick={profileClickHandler}
          className={classes.profile}
          src={profile}
          alt="profile pic"
          onError={(e) => (e.target.src = "/images/profile.png")}
        />
        <h1 onClick={profileClickHandler} className={classes.name}>
          {props.name}
        </h1>
        {loggedUser.userID !== props.userID ? (
          <Button
            name={amIfollowing}
            type="button"
            onClick={btnClickHandler}
            custom={`${classes.button} ${amIfollowing === "following" ? classes.buttonFollowing : ""}`}
          />
        ) : (
          ""
        )}

        <h3 className={classes.userID}>@{props.userID}</h3>
        <P onClick={profileClickHandler} className={classes.bio} text={props.bio}></P>

        {/* <div>additional section</div> */}
      </div>
      <hr />
    </Fragment>
  );
};

export default ProfilePatch;
