import Card from "../../../UI/Card";
import classes from "./EditProfile.module.css";
import edit from "../../../UI/imgs/edit.svg";
import editBanner from "../../../UI/imgs/edit-banner.svg";
import EditImage from "../../../UI/cropper/EditImage";
import { useState, useRef } from "react";
import Input from "../../../UI/Input";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { autosize } from "../../signUP/afterSignUp/Bio";
import Button from "../../../UI/Button";
import axios from "axios";
import { checkUserNameURL, setUsernameURL, updateNameURL, addBio } from "../../../URL/signUpURL";
import { profilePreURL, profileStatus } from "../../../URL/signUpURL";
import { loadingActions } from "../../../Store/loading-slice";
import { userActions } from "../../../Store/user-slice";
import { srcToFile } from "../../signUP/afterSignUp/UploadProfile";
import closeIcon from "../../../UI/imgs/close.svg";
import { GuardSpinner } from "react-spinners-kit";

import { Fragment } from "react";
const EditProfile = (props) => {
  let user = props.user;

  const [ban, setBan] = useState();
  const [pro, setPro] = useState();
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const [text, setText] = useState(user.bio ? user.bio : "");
  const dispatch = useDispatch();
  // const token = useSelector((state) => state.user.token);
  const token = props.token;
  const history = useHistory();
  const name = useRef();
  const userID = useRef();
  const textArea = useRef();

  const [name2, setName] = useState(user.name);
  const [userid, setUserid] = useState(user.userID);
  const [loading, setLoading] = useState(false);

  const typingHandler = (e) => {
    if (e.target.value.length <= 165) {
      setText(e.target.value);
    }
  };

  let profile = user.profile
    ? "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/" + user.profile.replace("$", "%24")
    : "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/default.png";
  let banner = user.banner
    ? "https://wezo-media.s3.ap-south-1.amazonaws.com/users/banner/" + user.banner.replace("$", "%24")
    : "https://wezo-media.s3.ap-south-1.amazonaws.com/users/banner/default.jpg";

  const onChangeHandler = (e, valid, render, red, message, setValid, setRender, setRed, setMessage, setVal) => {
    setVal(e.target.value);
    setName(e.target.value);
  };

  const inputHandler = (e, valid, render, red, message, setValid, setRender, setRed, setMessage, setVal) => {
    setVal(e.target.value);
    if (e.target.value !== user.userID) {
      const doneTyping = async () => {
        try {
          const res = await axios.get(checkUserNameURL + e.target.value.trim());
          console.log(res);
          if (res.data.available) {
            setRender(true);
            setUserid(e.target.value);
            setMessage("Username available");
            setRed(false);
          } else {
            setRender(true);
            setMessage("Username not available");
            setRed(true);
          }
        } catch (err) {}
      };

      if (e.target.value.trim().length >= 3) {
        //   console.log(e.target.value);
        //   setRender(true);
        //   setMessage("erer");

        if (/^[A-Za-z][A-Za-z0-9_]{2,10}$/.test(e.target.value.trim())) {
          setRender(false);
          let typingTimer;
          let doneTypingInterval = 1000;

          clearTimeout(typingTimer);
          typingTimer = setTimeout(doneTyping, doneTypingInterval);
        } else {
          setRender(true);
          setMessage("Username must be at least 3 letters and start with letter and can contain _ and letters");
        }
      } else {
        setRender(false);
      }
    }
  };

  const saveChangesHandler = async (e, setClick) => {
    // console.log("cropped image", ban);

    // console.log("cropped image", pro);
    setLoading(true);

    let tempUser = { ...user };

    if (ban) {
      // dispatch(
      //   loadingActions.setLoading({
      //     isLoading: true,
      //     message: "updating banner...!",
      //   })
      // );

      const url = await axios.get(profilePreURL + "/" + ban.type.split("/").slice(-1) + "/banner", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const file = await srcToFile(ban.img, "profile." + ban.type.split("/").slice(-1), ban.type);

      // console.log("sending", file);
      // uploading to filesystem
      await axios.put(url.data.url, file, {
        headers: {
          "Content-Type": "image/" + ban.type.split("/").slice(-1),
        },
      });

      await axios.get(profileStatus + url.data.fileName.split("/")[2] + "/banner", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      // diagnose
      tempUser = { ...tempUser, banner: url.data.fileName.split("/")[2] };
    }

    if (pro) {
      // dispatch(
      //   loadingActions.setLoading({
      //     isLoading: true,
      //     message: "updating profile...!",
      //   })
      // );

      const url = await axios.get(profilePreURL + "/" + pro.type.split("/").slice(-1) + "/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const file = await srcToFile(pro.img, "profile." + pro.type.split("/").slice(-1), pro.type);

      // console.log("sending", file);
      // uploading to filesystem
      await axios.put(url.data.url, file, {
        headers: {
          "Content-Type": "image/" + pro.type.split("/").slice(-1),
        },
      });

      await axios.get(profileStatus + url.data.fileName.split("/")[2] + "/profile", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      tempUser = { ...tempUser, profile: url.data.fileName.split("/")[2] };
    }

    ////////////////////user name//////////////////////
    if (name2 !== user.name) {
      // dispatch(
      //   loadingActions.setLoading({
      //     isLoading: true,
      //     message: "updating username...!",
      //   })
      // );

      await axios.post(
        updateNameURL,
        { name: name2 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("name ee", name2);

      // diagnose
      tempUser = { ...tempUser, name: name2 };
    }

    //<---------------- uID ----------------------->//

    if (userid !== user.userID) {
      // dispatch(
      //   loadingActions.setLoading({
      //     isLoading: true,
      //     message: "updating user id",
      //   })
      // );

      await axios.post(
        setUsernameURL,
        { uname: userid.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      tempUser = { ...tempUser, userID: userid };
    }

    //<----------------BIO------------------------->//
    if (text !== user.bio) {
      // dispatch(
      //   loadingActions.setLoading({
      //     isLoading: true,
      //     message: "Updating bio !",
      //   })
      // );

      await axios.post(
        addBio,
        { bio: text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      tempUser = { ...tempUser, bio: text };
    }

    dispatch(userActions.signUp({ user: { ...tempUser, followersCnt: 2, followingCnt: 1 }, token: token }));
    props.setUser(tempUser);
    localStorage.setItem("user_Obj", JSON.stringify(tempUser));

    setLoading(false);
    props.closeHandler();
    // history.push(`/profile/${user.userID}`);

    // dispatch(
    //   loadingActions.setLoading({
    //     isLoading: false,
    //     message: "changes saved !",
    //   })
    // );
  };

  return (
    <div className={classes.backdrop}>
      <Card custom={classes.card}>
        <EditImage
          aspect={3 / 1}
          className={classes.banner}
          default={{
            imageURL: banner,
          }}
          parentDivClass={classes.cntBanner}
          sendPic={setBan}
        >
          <div className={classes.bannerOverlay}>
            <img src={editBanner} alt="edit overlay" />
          </div>
        </EditImage>
        <img className={classes.closeIcon} onClick={props.closeHandler} src={closeIcon} alt="" />
        <EditImage
          aspect={1 / 1}
          className={classes.profile}
          default={{
            imageURL: profile,
          }}
          parentDivClass={classes.cnt}
          sendPic={setPro}
        >
          <div className={classes.profileOverlay}>
            <img src={edit} alt="edit overlay" />
          </div>
        </EditImage>
        <div className={classes.inputFields}>
          <p className={classes.fieldName}>Name</p>
          <Input
            ref={name}
            custom={`${classes.customName} ${classes.inp}`}
            onChange={onChangeHandler}
            defaultValue={user.name}
          />

          <p className={classes.fieldName}>User name</p>
          <Input ref={userID} custom={classes.inp} onChange={inputHandler} defaultValue={user.userID} />
          <p className={classes.fieldName}>Bio</p>
          <div style={{ marginTop: "0" }} className={`${classes.content}`}>
            <textarea
              rows="4"
              cols="4"
              ref={textArea}
              className={`${classes.bio}  ${isDarkMode ? classes["bio-dark"] : ""} ${classes.bio}`}
              onChange={typingHandler}
              onKeyDown={autosize}
              value={text}
            ></textarea>
            <p className={classes.count}>{165 - text.length}</p>
          </div>
          {loading ? (
            <div className={classes.loader}>
              <GuardSpinner color={"#2ba272"} loading={true} />
            </div>
          ) : (
            ""
          )}
          <Button custom={classes.btn} onClick={saveChangesHandler} name="Save changes" />
        </div>
      </Card>
    </div>
  );
};

export default EditProfile;
