import Card from "../../../UI/Card";
import close from "../../../UI/imgs/close.svg";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listProfileActions } from "../../../Store/list-people-slice";
import classes from "./ListProfiles.module.css";
import { getFollowingURL, getFollowersURL } from "../../../URL/signUpURL";
import { useParams } from "react-router-dom";
import axios from "axios";
// import LoadingSpinner from "../../../UI/LoadingSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { GuardSpinner } from "react-spinners-kit";
import ProfilePatch from "./ProfilePatch";
import { useLocation } from "react-router-dom";

const loadProfileList = async (type, token, id, page, dispatch, setLoading, setHasMore) => {
  try {
    const result = await axios.post(
      type == "following" ? getFollowingURL : getFollowersURL,
      type == "following" ? { following: id, page: page } : { followers: id, page: page },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    // const result = await axios.get(url, {
    //   headers: {
    //     Authorization: "Bearer " + token,
    //   },
    // });

    // console.table(result.data.followers);
    // console.log(result.data.followers);
    const temp = type == "following" ? result.data.following : result.data.followers;

    if (temp.length <= 0) {
      setHasMore(false);
    }

    const ret = temp.map((e) => {
      return type == "following" ? e.inventory_docs : e.u_id;
    });

    // console.log("ret", ret);
    dispatch(
      listProfileActions.addToList({
        list: ret,
      })
    );
    setLoading(false);
  } catch (err) {
    console.error("err in fetching profile ", err);
  }
};

const ListProfiles = (props) => {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const profileList = useSelector((state) => state.profiles.list);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();

  // console.log("the list of profiles ", profileList);
  // console.table(profileList);

  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  console.log("user id is ", location.pathname.split("/").at(-1));

  const whoIsIT = location.pathname.split("/").at(-1);

  useEffect(() => {
    if (props.user.userID != whoIsIT) {
      closeHandler();
    }
  }, [whoIsIT]);

  useEffect(() => {
    if (props.token) {
    } else {
      return;
    }
    // console.log(props.user.followingID);

    if (page === 0) {
      setLoading(true);
    }

    const temp = props.type === "following" ? props.user.followingCnt : props.user.followersCnt;

    if (temp > profileList.length) {
      setHasMore(true);
    } else {
      setHasMore(false);
      return;
    }

    loadProfileList(
      props.type,

      props.token,
      props.user._id,
      page,
      dispatch,
      setLoading,
      setHasMore
    );
  }, [props.token, page]);

  if (!props.user && !props.user.followingID) {
    return <div>Invalid user</div>;
  }

  const closeHandler = () => {
    dispatch(listProfileActions.reset({ list: [] }));
    props.setShow("");
  };

  return (
    <div className={classes.mainDiv}>
      <Card custom={classes.card}>
        <div className={classes.topSection}>
          <h1 className={classes.title}>{props.type}</h1>

          <img className={classes.closeIcon} src={close} alt="close following dialog box" onClick={closeHandler} />
        </div>
        <hr />

        <div id="listOfProfiles" className={classes.list}>
          <InfiniteScroll
            dataLength={
              profileList.length
              // props.type == "following"
              //   ? props.user.followingCnt
              //   : props.user.followersCnt
            }
            next={() => setPage((p) => p + 1)}
            hasMore={hasMore}
            scrollableTarget="listOfProfiles"
          >
            {/* {this.state.items.map((i, index) => (
              <div style={style} key={index}>
                div - #{index}
              </div>
            ))} */}

            {loading ? (
              <div className={classes.spinner}>
                <div className={classes.spinner2}>
                  <GuardSpinner color={"#2ba272"} loading={true} />
                </div>
              </div>
            ) : (
              profileList.map((a, i) => (
                <ProfilePatch
                  type={props.type}
                  key={i}
                  name={a.name}
                  userID={a.userID}
                  profile={a.profile}
                  _id={a._id}
                  bio={a.bio}
                  closeHandler={closeHandler}
                  token={props.token}
                  whosePageIsIt={props.user.userID}
                />
              ))
            )}
          </InfiniteScroll>

          {/* {profileList.length == 0 ? (
            <h1 className={classes.notFollowing}>
              You are not following anyone
            </h1>
          ) : (
            ""
          )} */}
        </div>
      </Card>
    </div>
  );
};

export default ListProfiles;
