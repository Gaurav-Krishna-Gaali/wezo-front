import classes from "./repliesList.module.css";

import AddComment from "./AddComment";
import Comment from "./Comment";
import { getRepliesURL } from "../../URL/signUpURL";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { detailedPostActions } from "../../Store/detailed-post-slice";
import InfiniteScroll from "react-infinite-scroll-component";
import { GuardSpinner } from "react-spinners-kit";

const fetchReplies = async (url, id, token, pageNO, dispatch, index, setLoading, setHasMore) => {
  try {
    const replies = await axios.post(
      url,
      { commentID: id, page: pageNO },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (replies.data.replies.length < 7) {
      setHasMore(false);
    }

    for (let x = 0; x < replies.data.replies.length; x++) {
      let merger = { haveIUpvoted: false, haveIDownvoted: false };
      if (replies.data.replies[x].reactions.length > 0) {
        if (replies.data.replies[x].reactions[0].reaction == 1) {
          merger.haveIUpvoted = true;
        } else if (replies.data.replies[x].reactions[0].reaction == 0) {
          merger.haveIDownvoted = true;
        }

        replies.data.replies[x] = { ...replies.data.replies[x], ...merger };
      }

      // this is for that like dislike count

      if (replies.data.replies[x].likes.length < 1) {
        replies.data.replies[x].likes = [{ count: 0 }];
      }
      if (replies.data.replies[x].dislikes.length < 1) {
        replies.data.replies[x].dislikes = [{ count: 0 }];
      }
    }

    dispatch(detailedPostActions.appendReplies({ id: index, replies: replies.data.replies }));
    setLoading(false);

    // console.log("replies are here", replies.data.replies);
  } catch (err) {
    console.error("err fetching replies");
  }
};
const reactReply = async (url, id, commentID, postID, token, reaction) => {
  try {
    await axios.post(
      url,
      { postID: postID, replyID: id, reaction: reaction, commentID: commentID },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  } catch (err) {
    console.error("err reacting on comments");
  }
};

const RepliesList = (props) => {
  const [pageNo, setPageNo] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const comment = useSelector((state) => state.detailedPost.comments[props.index]);
  const loggedUser = useSelector((state) => state.user.userObj);

  useEffect(() => {
    if (props.token) {
      fetchReplies(getRepliesURL, props.commentID, props.token, pageNo, dispatch, props.index, setLoading, setHasMore);
    }
  }, [pageNo]);

  if (loading) {
    return (
      <div className={classes.loader}>
        <GuardSpinner color={"#2ba272"} loading={loading} />
      </div>
    );
  }

  // if (comment.replies.length < 1) {
  //   return <div>no replies</div>;
  // }

  const nextFunction = () => {
    setPageNo((p) => p + 1);
  };

  let listOfReplies;
  if (comment.replies) {
    listOfReplies = [...comment.replies];
  }
  console.log("ok the comment from reply list", comment);

  return (
    <div className={classes.replyList}>
      <div id="listOfReplies" className={classes.repliesScroll}>
        <InfiniteScroll
          scrollableTarget="listOfReplies"
          dataLength={listOfReplies.length}
          next={nextFunction}
          hasMore={hasMore}
        >
          {listOfReplies.length > 0 ? (
            listOfReplies.map((e, i) => {
              return (
                <Comment
                  usedAs="reply"
                  loggedUser={loggedUser}
                  token={props.token}
                  index={i}
                  reply={e}
                  key={e._id}
                  commentID={props.commentID}
                  postID={props.postID}
                  reactReply={reactReply}
                  commentIndex={props.index}
                />
              );
            })
          ) : (
            <div className={classes.noReply}>
              <p>No replies</p>
            </div>
          )}

          {!hasMore && listOfReplies.length > 0 ? (
            <div className={`${classes.loader} ${classes.end}`}>{!loading ? <p>END</p> : ""}</div>
          ) : (
            ""
          )}
        </InfiniteScroll>
      </div>

      {!loading ? (
        <AddComment
          index={props.index}
          usedAs="addReply"
          token={props.token}
          commentID={comment._id}
          loggedUser={loggedUser}
          postID={props.postID}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default RepliesList;
