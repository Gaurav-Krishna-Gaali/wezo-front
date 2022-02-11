import LinkButton from "../../UI/LinkButton";
import { Fragment, useRef } from "react";
import { useSelector } from "react-redux";
import Hls from "hls.js";
import { Route, useHistory, Link, useParams } from "react-router-dom";
import VideoJS from "../Player/VideoJS";

import ListPosts from "../post/ListPosts";
import DetailedPost from "../post/DetailedPost";
import AddComment from "../post/AddComment";
import classes from "./feed.module.css";
import NavBar from "./navbar/Navbar";

const Feed = (props) => {
  let user = useSelector((state) => state.user.userObj);
  const token = useSelector((state) => state.user.token);

  // video player

  const playerRef = useRef(null);

  const videoJsOptions = {
    // lookup the options in the docs for more options
    autoplay: true,
    controls: true,
    responsive: true,

    html5: {
      vhs: {
        // withCredentials: true,
      },
    },

    sources: [
      {
        src: "https://wezo-video.s3.ap-south-1.amazonaws.com/test1.m3u8",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
    console.log(playerRef);
    // you can handle player events here
    player.on("waiting", () => {
      console.log("player is waiting");
    });

    player.on("dispose", () => {
      console.log("player will dispose");
    });
  };

  // video player

  return (
    <Fragment>
      <Route exact path="/feed">
        {/* <p>This is the feed i was talking about :D</p>
        <LinkButton text="Profile" to={"/Profile/" + user.userID} />
        <LinkButton text="video" to={"feed/watch/videoID"} />
        <LinkButton
          text="show post"
          to={"feed/showPost/61977db660a0d37e3c374a8a"}
        />
      </Route>

      <Route exact path={`/feed/watch/videoID`}>
        <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      </Route>
      <Route exact path={`/feed/showPost/:postID`}>
        <Post token={token} /> */}
        <div className={classes.feed}>
          <div className={classes.navbar}>
            <NavBar userID={user.userID} />
          </div>
          <div className={classes.posts}>
            <AddComment usedAs="addPost" token={token} loggedUser={user} />
            <ListPosts token={token} />
          </div>
          <div className={classes.suggested}></div>
        </div>
      </Route>
      {/* <Route exact path="/feed/viewPost/:postID/:index">
        <DetailedPost token={token} />
      </Route> */}

      <Route exact path="/feed/viewPost/:postID">
        <div className={classes.feed}>
          <div className={classes.navbar}>
            <NavBar userID={user.userID} />
          </div>
          <div className={classes.posts}>
            <DetailedPost token={token} />
          </div>
          <div className={classes.suggested}></div>
        </div>
      </Route>
    </Fragment>
  );
};

export default Feed;
