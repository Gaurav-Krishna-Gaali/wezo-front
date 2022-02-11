import classes from "./listCollabs.module.css";
import { postActions } from "../../Store/posts-slice";
import { collabActions } from "../../Store/collab-posts-slice";
import axios from "axios";
import { getListOfCollabPostsURL } from "../../URL/signUpURL";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GuardSpinner } from "react-spinners-kit";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import PostV2 from "../post/PostV2";

const getFeed = async (url, token, dispatch, setLoading, page, setHasMore) => {
  try {
    setLoading(true);
    const feed = await axios.post(
      url,
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
      dispatch(collabActions.reset());
    }
    if (feed.data.post.length < 7) {
      setHasMore(false);
    }

    console.log(feed.data.post);

    dispatch(collabActions.addToList({ posts: feed.data.post }));
    // dispatch(postActions.setLoad({ load: false }));
    dispatch(collabActions.setPageNo({ pageNo: page }));
    setLoading(false);
  } catch (err) {
    console.error("err fetching feed", err);
  }
};

const ListCollabs = (props) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.collabPosts.posts);
  const [loading, setLoading] = useState(false);
  const pageSaved = useSelector((state) => state.collabPosts.page);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (props.token) {
      if (page > pageSaved || posts.length < 1) {
        getFeed(getListOfCollabPostsURL, props.token, dispatch, setLoading, page, setHasMore);
      }
    }
  }, [props.token]);

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

  const nextFunction = () => {
    setPage((p) => p + 1);
  };

  const setShowMore = (id, length) => {
    dispatch(collabActions.setShowMore({ showMore: length, id: id }));
  };

  const downvoteHandler = (id, vote) => {
    dispatch(collabActions.setDownvote({ id: id, vote: vote }));
  };
  const upvoteHandler = (id, vote) => {
    dispatch(collabActions.setUpvote({ id: id, vote: vote }));
  };

  const showCollabHandler = (postID, collabReaction, index, withDraw) => {
    // if (collabReaction.length === 0) {
    //   setShowCollab({ show: true, postID, index: index });
    // } else {
    //   // with draw request
    //   if (withDraw) {
    //     withdrawRequest(withdrawCollabRequestURL, props.token, collabReaction[0]._id, notify, toast, update);
    //     dispatch(postActions.removeCollabRequest({ index: index }));
    //   }
    // }
  };

  const hideCollabHandler = () => {
    // setShowCollab((p) => ({ show: !p.show, postID: p.postID }));
  };

  return (
    <div id="listOfCollabPosts" className={classes.listPosts}>
      <InfiniteScroll dataLength={posts.length} next={nextFunction} hasMore={hasMore}>
        {posts.map((e, i) => {
          return (
            <PostV2
              key={e._id}
              index={i}
              post={e}
              token={props.token}
              loggedUser={props.loggedUser}
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

export default ListCollabs;
