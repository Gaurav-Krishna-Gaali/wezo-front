import { Fragment, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, useHistory, Link, useParams } from "react-router-dom";
import PostV2 from "./PostV2";
import { getPostURL } from "../../URL/signUpURL";
import axios from "axios";
import { detailedPostActions } from "../../Store/detailed-post-slice";
import AddComment from "./AddComment";
import CommentList from "./CommentList";
import { postActions } from "../../Store/posts-slice";
import { toast } from "react-toastify";
import { withdrawCollabRequestURL } from "../../URL/signUpURL";
import SendCollabRequest from "../collab/SendCollabRequest";

const getPost = async (id, token, dispatch) => {
  try {
    dispatch(detailedPostActions.reset());
    const post = await axios.get(getPostURL + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    let myReaction = { haveIUpvoted: false, haveIDownvoted: false };

    if (post.data.post[0].reactions.length > 0) {
      if (post.data.post[0].reactions[0].reaction === 0) {
        myReaction.haveIDownvoted = true;
      } else if (post.data.post[0].reactions[0].reaction === 1) {
        myReaction.haveIUpvoted = true;
      }
    }

    if (post.data.post[0].likes.length < 1) {
      post.data.post[0].likes = [{ count: 0 }];
    }

    if (post.data.post[0].dislikes.length < 1) {
      post.data.post[0].dislikes = [{ count: 0 }];
    }

    dispatch(detailedPostActions.setPost({ post: { ...post.data.post[0], ...myReaction } }));

    // console.log(post);
  } catch (err) {
    console.log("err in getting post details");
  }
};

const withdrawRequest = async (url, token, id, notify, toast, update) => {
  try {
    notify("withdrawing request", { type: toast.TYPE.INFO, autoClose: false });
    await axios.delete(url + id, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    update("request withdrawn");
  } catch (err) {
    update("err withdrawing request", {
      type: toast.TYPE.ERROR,
      autoClose: 1000,
      style: { border: "none", color: "#f91880" },
    });
    console.error("err in withdrawing request", err);
  }
};

const DetailedPost = (props) => {
  const history = useHistory();
  const params = useParams();
  const postID = params.postID;

  const dispatch = useDispatch();
  const detailedPost = useSelector((state) => state.detailedPost.post);
  const loggedUser = useSelector((state) => state.user.userObj);
  const [showCollab, setShowCollab] = useState({ show: false, postID: null, index: null });
  // console.log("detailed post", detailedPost);

  const toastId = useRef(null);
  const notify = (message, details = null) => (toastId.current = toast(message, { autoClose: false, ...details }));

  const update = (message, details = null) =>
    toast.update(toastId.current, {
      render: message,
      type: toast.TYPE.SUCCESS,
      autoClose: 1000,
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      ...details,
    });

  useEffect(() => {
    if (props.token && postID != "") {
      getPost(postID, props.token, dispatch);
    }
  }, [props.token]);

  const showCollabHandler = (postID, collabReaction, index, withDraw) => {
    if (collabReaction.length === 0) {
      setShowCollab({ show: true, postID, index: index });
    } else {
      // with draw request
      if (withDraw) {
        withdrawRequest(withdrawCollabRequestURL, props.token, collabReaction[0]._id, notify, toast, update);
        dispatch(postActions.removeCollabRequest({ index: index }));
        dispatch(detailedPostActions.removeCollabRequest());
      }
    }
  };

  // if (!detailedPost.u_id) {
  //   return <div>loading</div>;
  // }
  const downvoteHandler = (id, vote) => {
    let merger = {};
    merger = { haveIUpvoted: false, haveIDownvoted: !detailedPost.haveIDownvoted };
    let count = {};
    count = {
      like: detailedPost.haveIUpvoted ? detailedPost.like - 1 : detailedPost.like,
      dislike: detailedPost.haveIDownvoted ? detailedPost.dislike - 1 : detailedPost.dislike + 1,
    };

    let likes, dislikes;

    if (detailedPost.likes.length > 0) {
      likes = [{ count: detailedPost.haveIUpvoted ? detailedPost.likes[0].count - 1 : detailedPost.likes[0].count }];
    } else {
      likes = [{ count: 0 }];
    }

    if (detailedPost.dislikes.length > 0) {
      dislikes = [
        {
          count: detailedPost.haveIDownvoted ? detailedPost.dislikes[0].count - 1 : detailedPost.dislikes[0].count + 1,
        },
      ];
    } else {
      dislikes = [{ count: 0 }];
    }

    try {
      dispatch(
        detailedPostActions.setPost({
          post: { ...detailedPost, ...merger, likes, dislikes },
        })
      );

      dispatch(postActions.setDownvote({ id: postID, vote: vote, type: "postID" }));
    } catch (err) {
      console.error("refresh or shared post cant downvote locally");
    }
  };
  const upvoteHandler = (id, vote) => {
    let merger = {};
    merger = { haveIUpvoted: !detailedPost.haveIUpvoted, haveIDownvoted: false };
    let count = {};
    count = {
      like: detailedPost.haveIUpvoted ? detailedPost.like - 1 : detailedPost.like + 1,
      dislike: detailedPost.haveIDownvoted ? detailedPost.dislike - 1 : detailedPost.dislike,
    };

    let likes, dislikes;

    if (detailedPost.likes.length > 0) {
      likes = [
        { count: detailedPost.haveIUpvoted ? detailedPost.likes[0].count - 1 : detailedPost.likes[0].count + 1 },
      ];
    } else {
      likes = [{ count: 0 }];
    }

    if (detailedPost.dislikes.length > 0) {
      dislikes = [
        { count: detailedPost.haveIDownvoted ? detailedPost.dislikes[0].count - 1 : detailedPost.dislikes[0].count },
      ];
    } else {
      dislikes = [{ count: 0 }];
    }

    try {
      dispatch(
        detailedPostActions.setPost({
          post: { ...detailedPost, ...merger, likes, dislikes },
        })
      );

      dispatch(postActions.setUpvote({ id: postID, vote: vote, type: "postID" }));
    } catch (err) {
      console.error("refresh or shared post cant upvote locally");
    }
  };

  const hideCollabHandler = () => {
    setShowCollab((p) => ({ show: !p.show, postID: p.postID }));
  };

  return (
    <Fragment>
      {showCollab.show ? (
        <SendCollabRequest
          postID={showCollab.postID}
          index={showCollab.index}
          token={props.token}
          userID={loggedUser._id}
          showCollabHandler={hideCollabHandler}
        />
      ) : (
        ""
      )}
      <PostV2
        loading={detailedPost.u_id ? false : true}
        index={0}
        post={detailedPost}
        token={props.token}
        loggedUser={loggedUser}
        setShowMore={detailedPost.setShowMore}
        upvote={upvoteHandler}
        downvote={downvoteHandler}
        usedAs="detailedPost"
        showCollabHandler={showCollabHandler}
      />
      {/*FIXME: could'nt send un edited images as of now, fix it later */}
      {detailedPost ? (
        <AddComment usedAs="addComment" token={props.token} postID={detailedPost._id} loggedUser={loggedUser} />
      ) : (
        ""
      )}
      {<CommentList token={props.token} loggedUser={loggedUser} postID={detailedPost._id} />}
    </Fragment>
  );
};

export default DetailedPost;
