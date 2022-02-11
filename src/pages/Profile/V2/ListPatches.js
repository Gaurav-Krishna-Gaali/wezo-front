import ProfilePatchV2 from "./ProfilePatchV2";
import classes from "./ListPatches.module.css";
import Card from "../../../UI/Card";
import { listProfileActions } from "../../../Store/list-people-slice";
import { getFollowingURL, getFollowersURL } from "../../../URL/signUpURL";
import axios from "axios";
import { GuardSpinner } from "react-spinners-kit";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, Fragment } from "react";
import closeIcon from "../../../UI/imgs/close.svg";

const loadProfileList = async (type, token, id, page, dispatch, setLoading, setHasMore) => {
  try {
    setLoading(true);
    const result = await axios.post(
      type === "following" ? getFollowingURL : getFollowersURL,
      type === "following" ? { following: id, page: page } : { followers: id, page: page },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const temp = type === "following" ? result.data.following : result.data.followers;

    if (temp.length <= 0) {
      setHasMore(false);
    }

    const ret = temp.map((e) => {
      return type === "following" ? e._id : e._id;
    });

    console.log("ret", ret);
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

const ListPatches = (props) => {
  const profileList = useSelector((state) => state.profiles.list);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  //
  useEffect(() => {
    if (props.token) {
    } else {
      return;
    }
    // console.log(props.user.followingID);

    if (page === 0 && profileList.length === 0) {
      setLoading(true);
    }

    const temp = props.usedAs === "following" ? props.followingCnt : props.followersCnt;

    if (temp > profileList.length) {
      setHasMore(true);
    } else {
      setHasMore(false);
      return;
    }

    loadProfileList(props.usedAs, props.token, props._id, page, dispatch, setLoading, setHasMore);
  }, [props.token, page]);

  if (page === 0 && loading) {
    return (
      <div className={classes.backdrop}>
        <Card custom={classes.loader}>
          <GuardSpinner color={"#2ba272"} loading={loading} />
        </Card>
      </div>
    );
  }

  return (
    <div className={classes.backdrop}>
      <Card custom={classes.card}>
        <div className={classes.topSection}>
          <h1 className={classes.heading}>{props.usedAs}</h1>
          <img onClick={props.close} src={closeIcon} alt="" />
        </div>
        <hr />

        <div className={classes.scrollable} id="scrollProfiles">
          <InfiniteScroll
            dataLength={
              profileList.length
              // props.type == "following"
              //   ? props.user.followingCnt
              //   : props.user.followersCnt
            }
            next={() => setPage((p) => p + 1)}
            hasMore={hasMore}
            scrollableTarget="scrollProfiles"
          >
            {profileList.map((e, i) => {
              return (
                <Fragment key={i}>
                  <ProfilePatchV2
                    index={i}
                    user={e}
                    loggedUserID={props.loggedUserID}
                    loggedUser_id={props.loggedUser_id}
                    token={props.token}
                    usedAs={props.usedAs}
                    myProfile={props.myProfile}
                    close={props.close}
                  />
                  <hr className={classes.innerHR} />
                </Fragment>
              );
            })}
          </InfiniteScroll>
        </div>
      </Card>
    </div>
  );
};

export default ListPatches;
