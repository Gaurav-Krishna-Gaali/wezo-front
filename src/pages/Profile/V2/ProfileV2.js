import classes from "./profilev2.module.css";
import NavBar from "../../Feed/navbar/Navbar";
import feedClasses from "../../Feed/feed.module.css";
import { useSelector, useDispatch } from "react-redux";
import { Route, useHistory, Link, useParams } from "react-router-dom";
import { Fragment, useState } from "react";
import Card from "../../../UI/Card";
import { GuardSpinner } from "react-spinners-kit";
import axios from "axios";
import { useEffect } from "react";
import { viewProfileURL, followURL, amIFollowingURL } from "../../../URL/signUpURL";
import Button from "../../../UI/Button";
import moreMenu from "../../../UI/imgs/moreMenu.svg";
import calenderIcon from "../../../UI/imgs/New folder/calendar.svg";
import locationIcon from "../../../UI/imgs/New folder/place.svg";
import closeIcon from "../../../UI/imgs/close2.svg";
import chatIcon from "../../../UI/imgs/chat.svg";
import ImageViewer from "../../../UI/ImageViewer";
import personIcon from "../../../UI/imgs/person.svg";
import SkillsV2 from "./SkillsV2";
import P from "../../../UI/P";
import ListPatches from "./ListPatches";
import EditProfile from "../sub/EditProfile";
import { listProfileActions } from "../../../Store/list-people-slice";
import Projects from "./Projects";

const loadProfile = async (url, token, setUser, setFollowTxt, setLoading) => {
  try {
    setLoading(true);
    const result = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setUser(result.data.data);
    // await amIFollowing(amIFollowingURL, token, result.data.data._id, setFollowTxt);
    setLoading(false);
  } catch (err) {
    console.error("err in fetching profile ", err);
  }
};

export const followSomeOne = async (url, token, id, setUser) => {
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
    if (result.data.message === "following successfully") {
      setUser((p) => ({ ...p, followersCnt: p.followersCnt + 1 }));
    } else {
      setUser((p) => ({ ...p, followersCnt: p.followersCnt - 1 }));
    }
  } catch (err) {
    console.log("err in following :(", err);
  }
};

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

const ProfielV2 = (props) => {
  const params = useParams();
  const userID = params.userID;
  const loggedUser = useSelector((state) => state.user.userObj);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [follow, setFollow] = useState("Follow");
  const [view, setView] = useState(false);
  const [maniImage, setMainImage] = useState();
  const [show, setShow] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [followTxt, setFollowTxt] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !user.name) {
      setLoading(true);
    }
  });

  // loading profile
  useEffect(() => {
    if (props.token) {
      loadProfile(viewProfileURL + userID, props.token, setUser, setFollow, setLoading);
    }
  }, [userID, props.token]);

  useEffect(() => {
    if (user) {
      if (user._id === loggedUser._id) {
        setFollowTxt("Edit Profile");
        return;
      } else {
        amIFollowing(amIFollowingURL, props.token, user._id, setFollowTxt);
      }
    }
  }, [props.token, user]);

  if (loading) {
    return (
      <div className={feedClasses.feed}>
        <div className={feedClasses.navbar}>
          <NavBar />
        </div>
        <div className={`${feedClasses.posts} ${classes.profileArea}`}>
          <Card custom={`${classes.card} ${classes.loader}`}>
            <GuardSpinner color={"#2ba272"} loading={loading} />
          </Card>
        </div>
        <div className={feedClasses.suggested}></div>
      </div>
    );
  }

  let banner;
  let profile;

  if (user && user.banner) {
    banner = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/banner/" + user.banner.replace("$", "%24");
  } else if (user && !user.banner) {
    banner = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/banner/default.jpg";
  }
  if (user && user.profile) {
    profile = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/" + user.profile.replace("$", "%24");
  } else if (user && !user.profile) {
    profile = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/default.png";
  }

  const monthNames = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  let year;
  let month;
  if (user) {
    year = new Date(user.joinedAt).getFullYear();
    month = monthNames[new Date(user.joinedAt).getMonth()];
  }

  const viewHandler = () => {
    setView((p) => !p);
  };

  const bannerHandler = () => {
    setMainImage(banner);
    setView((p) => !p);
  };

  const profileHandler = () => {
    setMainImage(profile);
    setView((p) => !p);
  };

  const showFollowingHandler = () => {
    if (user.followingCnt > 0) {
      setShow("following");
    }
  };

  const buttonHandler = () => {
    // if its edit show edit menu
    if (user.userID === loggedUser.userID) {
      editHandler();
    } else {
      followSomeOne(followURL, props.token, user._id, setUser);
      setFollowTxt((p) => {
        if (p === "Following") {
          return "Follow";
        } else {
          return "Following";
        }
      });
    }
  };

  const editHandler = () => {
    setShowEdit((p) => !p);
  };

  const closeShowHandler = () => {
    dispatch(listProfileActions.reset());
    setShow();
  };

  const showFollowersHandler = () => {
    if (user.followersCnt > 0) {
      setShow("followers");
    }
  };

  return (
    <Fragment>
      <div className={feedClasses.feed}>
        <div className={feedClasses.navbar}>
          <NavBar userID={loggedUser.userID} />
        </div>
        <Route path={"/profile/" + userID}>
          <div className={`${feedClasses.posts} ${classes.profileArea}`}>
            <div>
              <img className={classes.banner} src={banner} alt="" onClick={bannerHandler} />
            </div>
            <Card custom={classes.top}>
              <div className={classes.profileContainer}>
                <img className={classes.profile} onClick={profileHandler} src={profile} alt="" />
                <div className={classes.nameContainer}>
                  <h1 className={classes.name}>{user.name}</h1>
                  <h3 className={classes.userID}>@{user.userID}</h3>
                </div>
                <div className={classes.actionButtons}>
                  <img className={classes.moreMenu} src={moreMenu} alt="" />
                  {followTxt ? (
                    <Button
                      onClick={buttonHandler}
                      custom={`${classes.btn} ${followTxt === "Following" ? classes.following : ""}`}
                      name={followTxt}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className={classes.bio}>
                  <P emoji={classes.emoji} className={classes.p} text={user.bio} />
                </div>
                <div className={classes.bottomButtons}>
                  <p onClick={showFollowingHandler}>
                    <span>{user.followingCnt + " "}</span>
                    Following
                  </p>
                  <p onClick={showFollowersHandler}>
                    <span>{user.followersCnt + " "}</span>
                    Followers
                  </p>
                  <div className={classes.bDiv}>
                    <img src={calenderIcon} alt="" />
                    <p>{month + " " + year}</p>
                  </div>
                  <div className={classes.bDiv}>
                    <img src={locationIcon} alt="" />
                    <p>{user.country}</p>
                  </div>
                </div>
              </div>
              {show === "following" ? (
                <ListPatches
                  close={closeShowHandler}
                  token={props.token}
                  usedAs="following"
                  userID={user.userID}
                  followingCnt={user.followingCnt}
                  followersCnt={user.followersCnt}
                  _id={user._id}
                  loggedUserID={loggedUser.userID}
                  loggedUser_id={loggedUser._id}
                  myProfile={user.userID === loggedUser.userID ? true : false}
                />
              ) : (
                ""
              )}
              {show === "followers" ? (
                <ListPatches
                  close={closeShowHandler}
                  token={props.token}
                  usedAs="followers"
                  userID={user.userID}
                  followingCnt={user.followingCnt}
                  followersCnt={user.followersCnt}
                  _id={user._id}
                  loggedUserID={loggedUser.userID}
                  loggedUser_id={loggedUser._id}
                  myProfile={user.userID === loggedUser.userID ? true : false}
                />
              ) : (
                ""
              )}
              {view ? <ImageViewer default={0} viewHandler={viewHandler} images={[maniImage]} /> : ""}
            </Card>
            <SkillsV2 setUser={setUser} user={user} showEditButton={user.userID === loggedUser.userID} />
            <Projects
              projectsCnt={user.projectsCnt}
              user_id={user._id}
              github_username={user.github_username}
              userID={user.userID}
              token={props.token}
              loggedu_id={loggedUser._id}
              key={"aa"}
            />
          </div>
        </Route>

        {showEdit ? <EditProfile setUser={setUser} token={props.token} closeHandler={editHandler} user={user} /> : ""}
        <div className={feedClasses.suggested}></div>
      </div>
    </Fragment>
  );
};

export default ProfielV2;
