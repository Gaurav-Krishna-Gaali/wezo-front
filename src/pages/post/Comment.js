import { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import classes from "./comments.module.css";
import { calculatePostTime } from "./PostV2";
import P from "../../UI/P";
import upvote from "../../UI/imgs/upvote.svg";
import upvoteGreen from "../../UI/imgs/upvoteGreen.svg";
import upvoteRed from "../../UI/imgs/upvoteRed.svg";
import upvoteFilled from "../../UI/imgs/upvoteFilled.svg";
import downvoteFilled from "../../UI/imgs/downvoteFilled.svg";
import arrow from "../../UI/imgs/arrow.svg";
import {
  giphyFromIDURL,
  commentReactionURL,
  replyReactionURL,
  deleteReplyURL,
  deleteCommentURL,
} from "../../URL/signUpURL";
import axios from "axios";
import RepliesList from "./RepliesList";
import ImageViewer from "../../UI/ImageViewer";
import deleteIcon from "../../UI/imgs/delete.svg";
import flagIcon from "../../UI/imgs/flag.svg";
import moreMenu from "../../UI/imgs/moreMenu.svg";
import close from "../../UI/imgs/close2.svg";
import { detailedPostActions } from "../../Store/detailed-post-slice";

export const fetchGif = async (url, id, setGif) => {
  try {
    const gif = await axios.get(url + id);
    // console.log(gif.data.data[0].images.fixed_width_downsampled);
    // setGif(gif.data.data[0].images.fixed_width_downsampled.url);

    setGif({
      still: gif.data.data[0].images.fixed_width_still.url,
      play: gif.data.data[0].images.fixed_width_downsampled.url,
    });
  } catch (err) {
    console.error("err fetchign gif", err);
  }
};

const deleteReply = async (url, id, token) => {
  try {
    await axios.delete(url + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (err) {
    console.error("error deleting reply ,", err);
  }
};

const Comment = (props) => {
  const comment = props.usedAs === "reply" ? props.reply : props.comment;

  const author = comment.u_id;
  const loggedUser = props.loggedUser;
  const [postDate, setPostDate] = useState(calculatePostTime(comment.created_at));

  const [gif, setGif] = useState();
  const [gifState, setGifState] = useState(false);
  const [mainImage, setMainImage] = useState(0);
  const [view, setView] = useState(false);

  const [showReplies, setShowReplies] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const [upvoteSrc, setUpvoteSrc] = useState(comment.haveIUpvoted === true ? upvoteFilled : upvote);
  const [downvoteSrc, setDownvoteSrc] = useState(comment.haveIDownvoted === true ? downvoteFilled : upvote);

  const dispatch = useDispatch();
  // useEffect(() => {
  //   setPostDate(calculatePostTime(comment.created_at));
  //   if (comment.gif) {
  //     fetchGif(giphyFromIDURL, comment.gif, setGif);
  //   }
  // });
  useEffect(() => {
    if (comment.gif) {
      fetchGif(giphyFromIDURL, comment.gif, setGif);
    }
  }, []);

  let profile = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/default.png";
  if (author.profile) {
    profile = "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/" + author.profile.replace("$", "%24");
  }

  let listOfImages;

  if (comment.imgs.length > 0) {
    listOfImages = comment.imgs.map((e) => {
      return "https://wezo-media.s3.ap-south-1.amazonaws.com/" + e.replace("$", "%24");
    });
  }

  const gifClickHandler = () => {
    setGifState((p) => !p);
  };

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

  const repliesHandler = () => {
    if (props.usedAs === "comment") {
      if (showReplies) {
        dispatch(detailedPostActions.resetReplies({ id: props.index }));
      }
      setShowReplies((p) => !p);
    }
  };

  const viewHandler = () => {
    setView((p) => !p);
  };

  const moreMenuHandler = () => {
    setShowMoreMenu((p) => !p);
  };

  const upvoteHandler = () => {
    if (downvoteSrc === downvoteFilled) {
      if (props.usedAs === "comment") {
        dispatch(detailedPostActions.commentDownvote({ id: props.index, vote: -1 }));
      } else if (props.usedAs === "reply") {
        dispatch(
          detailedPostActions.downvoteReply({ commentIndex: props.commentIndex, replyIndex: props.index, vote: -1 })
        );
      }
      setDownvoteSrc(upvote);
    }

    let vote = 1;

    if (upvoteSrc === upvoteFilled) {
      vote = -1;
    }
    setUpvoteSrc((p) => {
      if (p === upvoteFilled) {
        return upvote;
      } else {
        return upvoteFilled;
      }
    });
    if (props.usedAs === "comment") {
      props.reactComment(commentReactionURL, comment._id, props.postID, props.token, 1);
      dispatch(detailedPostActions.commentUpvote({ id: props.index, vote: vote }));
    } else if (props.usedAs === "reply") {
      props.reactReply(replyReactionURL, comment._id, props.commentID, props.postID, props.token, 1);
      dispatch(
        detailedPostActions.upvoteReply({ commentIndex: props.commentIndex, replyIndex: props.index, vote: vote })
      );
    }
  };

  const downvoteHandler = () => {
    if (upvoteSrc === upvoteFilled) {
      if (props.usedAs === "comment") {
        dispatch(detailedPostActions.commentUpvote({ id: props.index, vote: -1 }));
      } else if (props.usedAs === "reply") {
        dispatch(
          detailedPostActions.upvoteReply({ commentIndex: props.commentIndex, replyIndex: props.index, vote: -1 })
        );
      }
      setUpvoteSrc(upvote);
    }
    let vote = 1;
    if (downvoteSrc === downvoteFilled) {
      vote = -1;
    }

    setDownvoteSrc((p) => {
      if (p === downvoteFilled) {
        return upvote;
      } else {
        return downvoteFilled;
      }
    });
    if (props.usedAs === "comment") {
      props.reactComment(commentReactionURL, comment._id, props.postID, props.token, 0);
      dispatch(detailedPostActions.commentDownvote({ id: props.index, vote: vote }));
    } else if (props.usedAs === "reply") {
      props.reactReply(replyReactionURL, comment._id, props.commentID, props.postID, props.token, 0);
      dispatch(
        detailedPostActions.downvoteReply({ commentIndex: props.commentIndex, replyIndex: props.index, vote: vote })
      );
    }
  };

  const deleteHandler = () => {
    if (props.usedAs === "reply") {
      dispatch(detailedPostActions.deleteReply({ commentIndex: props.commentIndex, replyIndex: props.index }));
      deleteReply(deleteReplyURL, comment._id, props.token);
    } else if (props.usedAs === "comment") {
      deleteReply(deleteCommentURL, comment._id, props.token);
      dispatch(detailedPostActions.deleteComment({ commentIndex: props.index }));
    }
  };

  return (
    <Fragment>
      <div className={`${classes.comment} ${props.usedAs === "reply" ? classes.reply : ""}`}>
        <div className={classes.profile}>
          <img src={profile} alt="" />
        </div>
        <div className={classes.content}>
          <div className={classes.head}>
            <h1 className={classes.name}>{author.name}</h1>
            <p className={classes.dot}>&#183;</p>
            <h3 className={classes.userID}>@{author.userID}</h3>
            <p className={classes.postDate}>{postDate}</p>
          </div>
          <div className={classes.message}>
            <P
              emoji={classes.emoji}
              text={props.usedAs === "reply" ? comment.reply : comment.comment}
              className={classes.actualComment}
            ></P>
          </div>
          {gif ? (
            <div className={`${classes.imageSection} ${classes.gifSection}`} onClick={gifClickHandler}>
              <img className={classes.gif} src={gifState ? gif.play : gif.still} alt="" />
            </div>
          ) : (
            ""
          )}
          {comment.imgs.length > 0 ? (
            <div className={classes.imageSection}>
              <img className={`${classes.image}`} src={listOfImages[mainImage]} alt="post pic" onClick={viewHandler} />
              {listOfImages.length > 1 ? (
                <Fragment>
                  <img
                    onClick={arrowRightClickHandler}
                    className={` ${classes.rightArrow} ${classes.arrow}`}
                    src={arrow}
                    alt="click to see next pic"
                  />
                  <img
                    onClick={arrowLeftClickHandler}
                    className={`${classes.leftArrow} ${classes.arrow}`}
                    src={arrow}
                    alt="click to see next pic"
                  />
                  <div className={classes.dotContainer}>
                    {listOfImages.map((img, indx) => {
                      return (
                        <div
                          key={indx}
                          className={`${classes.dott} ${mainImage === indx ? classes.dotActive : ""}`}
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

          <div className={classes.reactionsDiv}>
            <div className={classes.reaction}>
              <img
                className={classes.upvote}
                onClick={upvoteHandler}
                src={upvoteSrc}
                alt="upvote"
                onMouseOver={(e) => (upvoteSrc === upvoteFilled ? "" : (e.currentTarget.src = upvoteGreen))}
                onMouseLeave={(e) => (e.currentTarget.src = upvoteSrc)}
              />

              <p style={{ color: upvoteSrc === upvoteFilled ? "#2ba272" : "" }} className={classes.reactTxt}>
                {comment.likes[0].count}
              </p>
            </div>

            <div className={`${classes.reaction} ${classes.downvoteDiv}`}>
              <img
                className={classes.downvote}
                onClick={downvoteHandler}
                src={downvoteSrc}
                alt="downvote"
                onMouseOver={(e) => (downvoteSrc === downvoteFilled ? "" : (e.currentTarget.src = upvoteRed))}
                onMouseLeave={(e) => (e.currentTarget.src = downvoteSrc)}
              />

              <p style={{ color: downvoteSrc === downvoteFilled ? "#F91880" : "" }} className={classes.reactTxt}>
                {comment.dislikes[0].count}
              </p>
            </div>
            <p className={classes.replies} onClick={repliesHandler}>
              {props.usedAs === "comment"
                ? showReplies
                  ? "Hide Replies"
                  : comment.repliesCnt.length > 0
                  ? "REPLIES " + comment.repliesCnt[0].count
                  : "REPLIES " + 0
                : "REPLY"}
            </p>
            <div className={classes.moreMenu}>
              <img
                className={classes.moreIcon}
                onClick={moreMenuHandler}
                src={showMoreMenu ? close : moreMenu}
                alt=""
              />
              {showMoreMenu ? (
                <div className={classes.floatingMenu}>
                  {author.userID === loggedUser.userID ? (
                    <div className={classes.menuItem} onClick={deleteHandler}>
                      <img src={deleteIcon} alt="" /> <p>delete</p>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className={classes.menuItem}>
                    <img src={flagIcon} alt="" /> <p>flag</p>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          {showReplies ? (
            <RepliesList
              key={comment._id}
              index={props.index}
              token={props.token}
              commentID={comment._id}
              postID={props.postID}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      {view ? <ImageViewer default={mainImage} viewHandler={viewHandler} images={listOfImages} /> : ""}
      <hr className={classes.hr} />
    </Fragment>
  );
};

export default Comment;
