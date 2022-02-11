import Card from "../../UI/Card";
import classes from "./post.module.css";
import { Route, useHistory, Link, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, Fragment, useRef } from "react";
import P from "../../UI/P";
import arrow from "../../UI/imgs/arrow.svg";
import upvote from "../../UI/imgs/upvote.svg";
import upvoteGreen from "../../UI/imgs/upvoteGreen.svg";
import upvoteRed from "../../UI/imgs/upvoteRed.svg";
import upvoteFilled from "../../UI/imgs/upvoteFilled.svg";
import downvoteFilled from "../../UI/imgs/downvoteFilled.svg";
import comment from "../../UI/imgs/comment.svg";
import commentGreen from "../../UI/imgs/commentGreen.svg";
import moreMenu from "../../UI/imgs/moreMenu.svg";
import close from "../../UI/imgs/close2.svg";
import deleteIcon from "../../UI/imgs/delete.svg";
import personIcon from "../../UI/imgs/person.svg";
import blockIcon from "../../UI/imgs/block.svg";
import flag from "../../UI/imgs/flag.svg";
import colab from "../../UI/imgs/colab.svg";
import colabGreen from "../../UI/imgs/colabGreen.svg";
import share from "../../UI/imgs/share.svg";
import shareGreen from "../../UI/imgs/shareGreen.svg";
import axios from "axios";
import { reactURL, amIFollowingURL, followURL, deletePostURL, giphyFromIDURL } from "../../URL/signUpURL";
import { followSomeOne } from "../Profile/Profile";
import test from "../../pages/Profile/joe.jpg";
import VideoJS from "../Player/VideoJS";
import { GuardSpinner } from "react-spinners-kit";
import { useSelector, useDispatch } from "react-redux";
import { postActions } from "../../Store/posts-slice";
import { detailedPostActions } from "../../Store/detailed-post-slice";
import ImageViewer from "../../UI/ImageViewer";
import classesFromComment from "./comments.module.css";
import { fetchGif } from "./Comment";

const amIFollowing = async (url, token, id, setFollowTxt) => {
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

    if (result.data.data.split(" ")[0] == "1") {
      setFollowTxt("Following");
    } else {
      setFollowTxt("Follow");
    }
  } catch (err) {
    console.log("err in finding out if you follow each other or not");
  }
};

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

const sendUpvote = async (vote, id, token) => {
  try {
    await axios.post(
      reactURL,
      { postID: id, reaction: vote },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  } catch (err) {
    console.log("err registering upvote", err);
  }
};

export const calculatePostTime = (date) => {
  const endDate = new Date();
  const startDate = new Date(date);
  let postDate;

  let diff = endDate.getTime() - startDate.getTime();
  const hours = diff / 1000 / 60 / 60;

  // console.log("hrs ,", date);

  // diff -= hours * 1000 * 60 * 60;
  const minutes = hours * 60;
  if (minutes < 1) {
    postDate = round(minutes * 60) + "s";
  } else if (minutes < 60) {
    postDate = round(minutes) + "m";
    // postDate = minutes + " m";
  } else if (hours < 24) {
    postDate = round(hours) + "h";
  } else if (hours < 672) {
    postDate = round(hours / 24) + "d";
  } else {
    const monthNames = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let year;
    let month;

    year = new Date(date).getFullYear();
    month = monthNames[new Date(date).getMonth()];

    postDate = month + " " + year;
  }

  return postDate;
};

const deleteThatPost = async (url, id, token) => {
  try {
    await axios.delete(url + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (err) {
    console.error("err deleting post");
  }
};

const PostV2 = (props) => {
  const history = useHistory();
  const playerRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const post = props.post;
  const [postDate, setPostDate] = useState(calculatePostTime(post.created_at));
  const [showMore, setShowMore] = useState(post.showMore ? post.showMore : post.imgUrl.length > 0 ? 165 : 500);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [mainImage, setMainImage] = useState(0);
  const [upvoteSrc, setUpvoteSrc] = useState(post.haveIUpvoted === true ? upvoteFilled : upvote);
  const [downvoteSrc, setDownvoteSrc] = useState(post.haveIDownvoted === true ? downvoteFilled : upvote);
  const [collabSrc, setCollabSrc] = useState();

  // console.log("collab reaction ", post.collabReaction);

  useEffect(() => {
    if (post.collabReaction && post.collabReaction.length > 0) {
      setCollabSrc("https://wezo-media.s3.ap-south-1.amazonaws.com/UI/collab-pending.svg");
    } else {
      setCollabSrc(colab);
    }
  }, [post.collabReaction]);

  useEffect(() => {
    if (post) {
      setUpvoteSrc(post.haveIUpvoted === true ? upvoteFilled : upvote);
    }
  }, [post.haveIUpvoted]);

  useEffect(() => {
    if (post) {
      setDownvoteSrc(post.haveIDownvoted === true ? downvoteFilled : upvote);
    }
  }, [post.haveIDownvoted]);

  let listOfImages = post.imgUrl;
  // let listOfImages = [test];
  const [following, setFollowing] = useState("dono");
  const [view, setView] = useState(false);

  const [gif, setGif] = useState();
  const [gifState, setGifState] = useState(false);

  // upvote --> upvoteFilled --> upvote
  useEffect(() => {
    if (showMoreMenu && following === "dono" && props.loggedUser._id !== post.u_id._id) {
      amIFollowing(amIFollowingURL, props.token, post.u_id._id, setFollowing);
    }
  }, [props.token, showMoreMenu]);

  // console.log("user id is ", location.pathname.split("/").at(-1));

  useEffect(() => {
    const arr = location.pathname.split("/");
    if (arr[arr.length - 1] === "feed") {
      setUpvoteSrc(post.haveIUpvoted === true ? upvoteFilled : upvote);
      setDownvoteSrc(post.haveIDownvoted === true ? downvoteFilled : upvote);
    }
  });

  useEffect(() => {
    const arr = location.pathname.split("/");
    if (arr[arr.length - 1] !== "feed" && props.loading === false) {
      setPostDate(calculatePostTime(post.created_at));
      // console.log(post);
    }
  }, [props.loading]);

  useEffect(() => {
    if (!props.loading && post.haveIUpvoted) {
      setUpvoteSrc(post.haveIUpvoted === true ? upvoteFilled : upvote);
    } else if (!props.loading && post.haveIDownvoted) {
      setDownvoteSrc(post.haveIDownvoted === true ? downvoteFilled : upvote);
    }
  }, [props.loading]);

  useEffect(() => {
    if (post.gif) {
      fetchGif(giphyFromIDURL, post.gif, setGif);
    }
  }, [post.gif]);

  // useEffect(() => {
  //   if (upvoteSrc === upvote && post.haveIUpvoted) {
  //     console.log("removing upvote");
  //   }
  // }, [post.haveIUpvoted]);

  // useEffect(() => {
  //   console.log("sending downvote");
  // }, [downvoteSrc]);

  if (!props.loggedUser || !props.token) {
    return <div>haven't got props yet</div>;
  }

  if (props.loading) {
    return (
      <Card custom={`${classes.card} ${props.usedAs === "detailedPost" ? classes.detailedPost : ""}`}>
        <div className={classes.spinner}>
          <div className={classes.spinner2}>
            <GuardSpinner color={"#2ba272"} loading={true} />
          </div>
        </div>
      </Card>
    );
  }

  let profile;
  if (post && post.u_id.profile) {
    profile = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/" + post.u_id.profile.replace("$", "%24");
  } else {
    profile = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/default.png";
  }

  if (listOfImages.length > 0) {
    listOfImages = listOfImages.map((e) => {
      return "https://wezo-media.s3.ap-south-1.amazonaws.com/" + e.replace("$", "%24");
    });
  }

  const profileClickHandler = () => {
    history.push("/profile/" + post.u_id.userID);
  };

  const showMoreHandler = () => {
    setShowMore(post.postContent.length);
    props.setShowMore(props.index, post.postContent.length);
  };

  // --- --- //

  const dotClickHandler = (indx) => {
    setMainImage(indx);
  };

  const arrowLeftClickHandler = () => {
    if (mainImage === 0) {
      setMainImage(listOfImages.length - 1);
    } else {
      setMainImage((p) => p - 1);
    }
  };

  const arrowRightClickHandler = () => {
    if (mainImage === listOfImages.length - 1) {
      setMainImage(0);
    } else {
      setMainImage((p) => p + 1);
    }
  };

  const upvoteHandler = (e) => {
    // if there is a downvote remove it
    if (downvoteSrc === downvoteFilled) {
      // setDownvoteSrc(upvote);

      props.downvote(props.index, -1);
    }

    sendUpvote(1, post._id, props.token);

    // setUpvoteSrc((p) => {
    //   if (p === upvote) {
    //     return upvoteFilled;
    //   } else if (p === upvoteFilled) {
    //     return upvote;
    //   }
    // });
    props.upvote(props.index, upvoteSrc === upvoteFilled ? -1 : 1);
  };

  const downvoteHandler = () => {
    // if there is a upvote remove it
    if (upvoteSrc === upvoteFilled) {
      // setUpvoteSrc(upvote);
      props.upvote(props.index, -1);
    }
    sendUpvote(0, post._id, props.token);
    // setDownvoteSrc((p) => {
    //   if (p === upvote) {
    //     return downvoteFilled;
    //   } else if (p === downvoteFilled) {
    //     return upvote;
    //   }
    // });
    props.downvote(props.index, downvoteSrc === downvoteFilled ? -1 : 1);
  };

  const followHandler = () => {
    setFollowing((p) => {
      if (p === "Following") {
        return "Follow";
      } else if (p === "Follow") {
        return "Following";
      }
    });
    followSomeOne(followURL, props.token, post.u_id._id, setFollowing);
  };

  const viewPostHandler = () => {
    if (location.pathname.split("/").at(-1) === "feed" || location.pathname.split("/").at(-1) === "collab") {
      // console.log("this is runngin", location.pathname.split("/").at(-1));
      history.push("/feed/viewPost/" + post._id);
    }
  };

  // --- deleting post --- //
  const deletePostHandler = () => {
    deleteThatPost(deletePostURL, post._id, props.token);
    if (location.pathname.split("/").at(-1) === "feed") {
      dispatch(postActions.deletePost({ id: props.index }));
    } else {
      console.log("the index that i have here is ");
      dispatch(postActions.detailedDelete({ id: post._id }));
      history.push("/feed");
    }
  };

  const viewHandler = () => {
    setView((p) => !p);
  };
  const gifClickHandler = () => {
    setGifState((p) => !p);
  };

  const collabClickHandler = () => {
    if (post.u_id._id !== props.loggedUser._id) {
      props.showCollabHandler(
        post._id,
        post.collabReaction,
        props.index,
        collabSrc === "https://wezo-media.s3.ap-south-1.amazonaws.com/UI/collab-pending.svg" ? true : false
      );
    }
  };

  return (
    <Card custom={`${classes.card} ${props.usedAs === "detailedPost" ? classes.detailedPost : ""}`}>
      <div className={classes.topSection}>
        <img
          onClick={profileClickHandler}
          className={classes.profile}
          alt="profile pic"
          src={profile}
          onError={(e) => (e.target.src = "/images/profile.png")}
        />
        <div onClick={profileClickHandler} className={classes.nameContainer}>
          <h1 className={classes.name}>{post.u_id.name}</h1>
          <p className={classes.postTime}> &#183;</p>
          <p className={classes.time}>{postDate}</p>
          <h3 className={classes.userID}>@{post.u_id.userID}</h3>
        </div>

        <div className={classes.moreMenu}>
          {/* <p>&#183;&#183;&#183;</p> */}
          <img
            onClick={() => {
              setShowMoreMenu((p) => !p);
            }}
            src={showMoreMenu ? close : moreMenu}
            alt="more menu"
          />
          {showMoreMenu ? (
            <Card custom={classes.hoverOptions}>
              {props.loggedUser._id === post.u_id._id ? (
                <Fragment>
                  <div className={classes.moreItem} onClick={deletePostHandler}>
                    <img src={deleteIcon} alt="delete post" />
                    <p>delete post</p>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  {following !== "dono" ? (
                    <div className={classes.moreItem} onClick={followHandler}>
                      <img src={personIcon} alt="follow" />
                      {following === "Following" ? <p>Unfollow</p> : <p>Follow</p>}
                    </div>
                  ) : (
                    ""
                  )}
                  <div className={classes.moreItem}>
                    <img src={blockIcon} alt="delete post" />
                    <p>block</p>
                  </div>
                  <div className={classes.moreItem}>
                    <img src={flag} alt="report" /> <p>report post</p>
                  </div>
                </Fragment>
              )}
            </Card>
          ) : (
            ""
          )}
        </div>
      </div>
      <hr />
      <div className={classes.contentContainer}>
        <P className={classes.content} text={post.postContent.substring(0, showMore)}>
          {post.postContent.length > 165 && (showMore === 165 || showMore === 500) ? (
            <p onClick={showMoreHandler} className={classes.showMore}>
              ...read more
            </p>
          ) : (
            ""
          )}
        </P>
      </div>
      {/* render only if there are images */}
      {listOfImages.length > 0 ? (
        <div className={classesFromComment.imageSection}>
          <img
            className={`${classesFromComment.image}`}
            src={listOfImages[mainImage]}
            alt="post pic"
            onClick={viewHandler}
          />
          {listOfImages.length > 1 ? (
            <Fragment>
              <img
                onClick={arrowRightClickHandler}
                className={` ${classesFromComment.rightArrow} ${classesFromComment.arrow}`}
                src={arrow}
                alt="click to see next pic"
              />
              <img
                onClick={arrowLeftClickHandler}
                className={`${classesFromComment.leftArrow} ${classesFromComment.arrow}`}
                src={arrow}
                alt="click to see next pic"
              />
              <div className={classesFromComment.dotContainer}>
                {listOfImages.map((img, indx) => {
                  return (
                    <div
                      key={indx}
                      className={`${classesFromComment.dott} ${mainImage === indx ? classesFromComment.dotActive : ""}`}
                      onClick={() => {
                        dotClickHandler(indx);
                      }}
                    ></div>
                  );
                })}
              </div>
            </Fragment>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}

      {gif ? (
        <div
          className={`${classesFromComment.imageSection} ${classesFromComment.gifSection}`}
          onClick={gifClickHandler}
        >
          <img className={classesFromComment.gif} src={gifState ? gif.play : gif.still} alt="" />
        </div>
      ) : (
        ""
      )}
      {/* if there is a video */}
      {post.vidUrl ? (
        <div className={classes.videoContainer}>
          <VideoJS source="https://wezo-video.s3.ap-south-1.amazonaws.com/postVideos/test1.m3u8" />
        </div>
      ) : (
        ""
      )}

      <div className={`${classes.reactionSection} ${listOfImages.length > 0 ? "" : classes.onlyTxt}`}>
        <div className={classes.reaction}>
          <img
            src={upvoteSrc}
            alt="upvote"
            onClick={upvoteHandler}
            onMouseOver={(e) => (upvoteSrc === upvoteFilled ? "" : (e.currentTarget.src = upvoteGreen))}
            onMouseLeave={(e) => (e.currentTarget.src = upvoteSrc)}
          />

          <p style={{ color: upvoteSrc === upvoteFilled ? "#2ba272" : "" }} className={classes.reactTxt}>
            {post.likes.length > 0 ? post.likes[0].count : 0}
          </p>
        </div>

        <div className={`${classes.reaction}`}>
          <img
            onClick={downvoteHandler}
            className={classes.downVote}
            src={downvoteSrc}
            alt="downvote"
            onMouseOver={(e) => (downvoteSrc === downvoteFilled ? "" : (e.currentTarget.src = upvoteRed))}
            onMouseLeave={(e) => (e.currentTarget.src = downvoteSrc)}
          />

          <p style={{ color: downvoteSrc === downvoteFilled ? "#F91880" : "" }} className={classes.reactTxt}>
            {post.dislikes.length > 0 ? post.dislikes[0].count : 0}
          </p>
        </div>

        <div className={`${classes.reaction}`} onClick={viewPostHandler}>
          <img
            src={comment}
            alt="comment"
            onMouseOver={(e) => (e.currentTarget.src = commentGreen)}
            onMouseLeave={(e) => (e.currentTarget.src = comment)}
          />

          <p className={classes.reactTxt}>{post.comments}</p>
        </div>

        {post.postType === "Collab" ? (
          <div onClick={collabClickHandler} className={`${classes.reaction}`}>
            <img
              src={collabSrc}
              alt="collab"
              onMouseOver={(e) =>
                (e.currentTarget.src =
                  collabSrc === colab
                    ? colabGreen
                    : "https://wezo-media.s3.ap-south-1.amazonaws.com/UI/collab-reject.svg")
              }
              onMouseLeave={(e) => (e.currentTarget.src = collabSrc)}
            />
          </div>
        ) : (
          ""
        )}

        <div className={`${classes.reaction}`}>
          <img
            src={share}
            alt="share"
            onMouseOver={(e) => (e.currentTarget.src = shareGreen)}
            onMouseLeave={(e) => (e.currentTarget.src = share)}
          />
        </div>
      </div>
      {view ? <ImageViewer default={mainImage} viewHandler={viewHandler} images={listOfImages} /> : ""}
    </Card>
  );
};

export default PostV2;

// {listOfImages.length > 0 ? (
//   <div className={classes.imageSection}>
//     <img className={`${classes.image}`} src={listOfImages[mainImage]} alt="post pic" onClick={viewHandler} />
//     {listOfImages.length > 1 ? (
//       <Fragment>
//         <img
//           onClick={arrowRightClickHandler}
//           className={` ${classes.rightArrow} ${classes.arrow}`}
//           src={arrow}
//           alt="click to see next pic"
//         />
//         <img
//           onClick={arrowLeftClickHandler}
//           className={`${classes.leftArrow} ${classes.arrow}`}
//           src={arrow}
//           alt="click to see next pic"
//         />
//         <div className={classes.dotContainer}>
//           {listOfImages.map((img, indx) => {
//             return (
//               <div
//                 key={indx}
//                 className={`${classes.dott} ${mainImage === indx ? classes.dotActive : ""}`}
//                 onClick={() => {
//                   dotClickHandler(indx);
//                 }}
//               ></div>
//             );
//           })}
//         </div>
//       </Fragment>
//     ) : (
//       ""
//     )}
//   </div>
// ) : (
//   ""
// )}
