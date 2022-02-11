import { feedURL } from "../../URL/signUpURL";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import postSlice, { postActions } from "../../Store/posts-slice";
import axios from "axios";
import { GuardSpinner } from "react-spinners-kit";
import PostV2 from "./PostV2";
import InfiniteScroll from "react-infinite-scroll-component";
import classes from "./listposts.module.css";
import SendCollabRequest from "../collab/SendCollabRequest";
import { withdrawCollabRequestURL } from "../../URL/signUpURL";
import { toast } from "react-toastify";

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

const getFeed = async (token, dispatch, setLoading, page, setHasMore) => {
  try {
    setLoading(true);
    const feed = await axios.post(
      feedURL,
      { page: page - 1 },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    for (let x = 0; x < feed.data.post.length; x++) {
      let merger = { haveIUpvoted: false, haveIDownvoted: false };
      if (feed.data.post[x].reactions.length > 0) {
        if (feed.data.post[x].reactions[0].reaction == 1) {
          merger.haveIUpvoted = true;
        } else if (feed.data.post[x].reactions[0].reaction == 0) {
          merger.haveIDownvoted = true;
        }
      }
      feed.data.post[x] = { ...feed.data.post[x], ...merger };
    }

    // console.log(feed.data.post);
    // FIXME: remove this
    if (page === 1) {
      dispatch(postActions.reset());
    }
    if (feed.data.post.length < 7) {
      setHasMore(false);
    }

    dispatch(postActions.addToList({ posts: feed.data.post }));
    // dispatch(postActions.setLoad({ load: false }));
    dispatch(postActions.setPageNo({ pageNo: page }));
    setLoading(false);
  } catch (err) {
    console.error("err fetching feed");
  }
};

const ListPosts = (props) => {
  const loggedUser = useSelector((state) => state.user.userObj);
  const token = useSelector((state) => state.user.token);
  const posts = useSelector((state) => state.posts.posts);
  const pageSaved = useSelector((state) => state.posts.page);
  const [showCollab, setShowCollab] = useState({ show: false, postID: null, index: null });

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

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
    if (!loggedUser || !token) {
      return;
    }

    if (page > pageSaved || posts.length < 1) {
      getFeed(token, dispatch, setLoading, page, setHasMore);
    }

    // getFeed(token, dispatch, setLoading, page, setHasMore);
  }, [page, props.token]);

  if (!loggedUser) {
    return <div>loading</div>;
  }

  const nextFunction = () => {
    // console.log("iam the next function");
    setPage((p) => p + 1);
  };

  const setShowMore = (id, length) => {
    dispatch(postActions.setShowMore({ showMore: length, id: id }));
  };

  const downvoteHandler = (id, vote) => {
    dispatch(postActions.setDownvote({ id: id, vote: vote }));
  };
  const upvoteHandler = (id, vote) => {
    dispatch(postActions.setUpvote({ id: id, vote: vote }));
  };

  const showCollabHandler = (postID, collabReaction, index, withDraw) => {
    if (collabReaction.length === 0) {
      setShowCollab({ show: true, postID, index: index });
    } else {
      // with draw request
      if (withDraw) {
        withdrawRequest(withdrawCollabRequestURL, props.token, collabReaction[0]._id, notify, toast, update);
        dispatch(postActions.removeCollabRequest({ index: index }));
      }
    }
  };

  const hideCollabHandler = () => {
    setShowCollab((p) => ({ show: !p.show, postID: p.postID }));
  };

  return (
    <div id="listOfPosts" className={classes.listPosts}>
      {showCollab.show ? (
        <SendCollabRequest
          postID={showCollab.postID}
          index={showCollab.index}
          token={token}
          userID={loggedUser._id}
          showCollabHandler={hideCollabHandler}
        />
      ) : (
        ""
      )}
      <InfiniteScroll dataLength={posts.length} next={nextFunction} hasMore={hasMore}>
        {posts.map((e, i) => {
          return (
            <PostV2
              key={e._id}
              index={i}
              post={e}
              token={token}
              loggedUser={loggedUser}
              setShowMore={setShowMore}
              upvote={upvoteHandler}
              downvote={downvoteHandler}
              usedAs="post"
              showCollabHandler={showCollabHandler}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default ListPosts;
