import Card from "../../UI/Card";
import cardClass from "./post.module.css";
import classes from "./commentList.module.css";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import { commentsFeedURL, commentReactionURL } from "../../URL/signUpURL";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { detailedPostActions } from "../../Store/detailed-post-slice";
import InfiniteScroll from "react-infinite-scroll-component";
import { GuardSpinner } from "react-spinners-kit";

const getComments = async (url, id, token, pageNo, dispatch, setHasMore, setLoading) => {
  try {
    setLoading(true);
    const comments = await axios.post(
      url,
      { postID: id, page: pageNo },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    if (comments.data.comments.length < 7) {
      setHasMore(false);
    }

    for (let x = 0; x < comments.data.comments.length; x++) {
      let merger = { haveIUpvoted: false, haveIDownvoted: false };
      if (comments.data.comments[x].reactions.length > 0) {
        if (comments.data.comments[x].reactions[0].reaction == 1) {
          merger.haveIUpvoted = true;
        } else if (comments.data.comments[x].reactions[0].reaction == 0) {
          merger.haveIDownvoted = true;
        }

        comments.data.comments[x] = { ...comments.data.comments[x], ...merger };
      }
      // this is for that like dislike count

      if (comments.data.comments[x].likes.length < 1) {
        comments.data.comments[x].likes = [{ count: 0 }];
      }
      if (comments.data.comments[x].dislikes.length < 1) {
        comments.data.comments[x].dislikes = [{ count: 0 }];
      }
      if (comments.data.comments[x].repliesCnt.length < 1) {
        comments.data.comments[x].repliesCnt = [{ count: 0 }];
      }
    }

    dispatch(detailedPostActions.appendComments({ comments: comments.data.comments }));
    setLoading(false);

    // console.log("fetched comments ", comments.data);
  } catch (err) {
    console.log("err in fetching comments");
  }
};

const reactComment = async (url, id, postID, token, reaction) => {
  try {
    await axios.post(
      url,
      { postID: postID, commentID: id, reaction: reaction },
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

const CommentList = (props) => {
  const [pageNo, setPageNo] = useState(0);
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const comments = useSelector((state) => state.detailedPost.comments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.token && props.postID) {
      // if (pageNo === 0) {
      //   dispatch(detailedPostActions.resetComments());
      // }
      getComments(commentsFeedURL, props.postID, props.token, pageNo, dispatch, setHasMore, setLoading);
    }
  }, [props.postID, pageNo]);

  const nextFunction = () => {
    if (comments.length > 1) {
      console.log("next fired");
      setPageNo((p) => p + 1);
    }
  };

  return (
    <Card custom={cardClass.card}>
      <h1 className={classes.title}>Comments</h1>
      <hr />
      <div id="commentsList" className={classes.commentsContainer}>
        <InfiniteScroll dataLength={comments.length} next={nextFunction} hasMore={hasMore}>
          {comments.length > 0 ? (
            comments.map((e, i) => {
              return (
                <Comment
                  loggedUser={props.loggedUser}
                  usedAs="comment"
                  token={props.token}
                  index={i}
                  comment={e}
                  key={e._id}
                  reactComment={reactComment}
                  postID={props.postID}
                />
              );
            })
          ) : (
            <div className={classes.noComments}>
              <p>No comments</p>
            </div>
          )}
        </InfiniteScroll>
      </div>
      <div className={classes.loader}>
        <GuardSpinner color={"#2ba272"} loading={loading} />
        {!hasMore && !loading && comments.length > 0 ? <p>END</p> : ""}
      </div>
    </Card>
  );
};

export default CommentList;
