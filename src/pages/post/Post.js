import { Route, useHistory, Link, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
import Card from "../../UI/Card";
import { getPostURL } from "../../URL/signUpURL";
import axios from "axios";
import classes from "./post.module.css";
import P from "../../UI/P";
import testImage from "./download.png";
import testImage2 from "./download 2.png";
import arrow from "../../UI/imgs/arrow.svg";
import upvote from "../../UI/imgs/upvote.svg";
import upvoteGreen from "../../UI/imgs/upvoteGreen.svg";
import upvoteRed from "../../UI/imgs/upvoteRed.svg";
import upvoteFilled from "../../UI/imgs/upvoteFilled.svg";
import downvoteFilled from "../../UI/imgs/downvoteFilled.svg";
import comment from "../../UI/imgs/comment.svg";
import commentGreen from "../../UI/imgs/commentGreen.svg";
import colab from "../../UI/imgs/colab.svg";
import colabGreen from "../../UI/imgs/colabGreen.svg";
import share from "../../UI/imgs/share.svg";
import shareGreen from "../../UI/imgs/shareGreen.svg";
import { postActions } from "../../Store/posts-slice";
import { useDispatch } from "react-redux";
function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

const calculatePostTime = (date) => {
  const endDate = new Date();
  const startDate = new Date(date);
  let postDate;

  let diff = endDate.getTime() - startDate.getTime();
  const hours = diff / 1000 / 60 / 60;

  console.log("hrs ,", date);

  // diff -= hours * 1000 * 60 * 60;
  const minutes = hours * 60;
  if (minutes < 1) {
    postDate = round(minutes * 60) + "s";
  } else if (minutes < 60) {
    postDate = round(minutes) + "m";
    // postDate = minutes + " m";
  } else if (hours < 24) {
    postDate = round(hours) + "h";
  } else if (hours > 24) {
    postDate = round(hours / 24) + "d";
  } else {
    postDate = "10s";
  }

  return postDate;
};

const loadPost = async (
  getPostURL,
  id,
  token,
  setLoading,
  dispatch,
  setErr,
  setPostDate,
  setShowMore
) => {
  try {
    setLoading(true);
    const post = await axios.get(getPostURL + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (post.data.post.imgUrl.length > 0) {
      setShowMore(165);
    } else {
      setShowMore(500);
    }
    setPostDate(calculatePostTime(post.data.post.created_at));

    // setPost(post.data);
    // console.log({ ...post.data });

    dispatch(postActions.addToList({ posts: [{ ...post.data }] }));

    setLoading(false);
  } catch (err) {
    console.log("err in showing post, ", err);
    setErr("err in fetching post");
  }
};

const Post = (props) => {
  const params = useParams();
  const postID = params.postID;
  const history = useHistory();
  const dispatch = useDispatch();
  //   const loggedUser = useSelector((state) => state.user.userObj);
  const post = useSelector((state) => state.posts.posts);

  const [loading, setLoading] = useState(true);
  // const [post, setPost] = useState();
  const [err, setErr] = useState(false);
  const [showMore, setShowMore] = useState();
  const [postDate, setPostDate] = useState("10s");

  // FIXME: temp for testing as aws is not working remove later
  // const listOfImages = [];
  const [upvoteSrc, setUpvoteSrc] = useState(upvote);
  const [downvoteSrc, setDownvoteSrc] = useState(upvote);

  //
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    if (props.token) {
    } else {
      return;
    }

    loadPost(
      getPostURL,
      postID,
      props.token,
      setLoading,
      dispatch,
      setErr,
      setPostDate,
      setShowMore
    );
  }, [props.token]);

  // console.log("logging post ", post);
  if (post === undefined) {
    return <Card>Loading</Card>;
  }

  console.log("posts are here", post);

  let profile;
  if (!loading && post) {
    profile =
      "https://wezo-media.s3.ap-south-1.amazonaws.com/users/profile/" +
      post.author.profile.replace("$", "%24");
  }

  return <Card>done</Card>;
};
// const profileClickHandler = () => {
//   history.push("/profile/" + post.author.userID);
// };
// const dotClickHandler = (indx) => {
//   setMainImage(indx);
// };

// const arrowLeftClickHandler = () => {
//   if (mainImage === 0) {
//     setMainImage(listOfImages.length - 1);
//   } else {
//     setMainImage((p) => p - 1);
//   }
// };

// const arrowRightClickHandler = () => {
//   if (mainImage === listOfImages.length - 1) {
//     setMainImage(0);
//   } else {
//     setMainImage((p) => p + 1);
//   }
// };

// const upvoteHandler = (e) => {
//   // if there is a downvote remove it
//   if (downvoteSrc === downvoteFilled) {
//     setDownvoteSrc(upvote);
//     setPost((p) => {
//       return { ...p, post: { ...p.post, dislike: p.post.dislike - 1 } };
//     });
//   }

//   setUpvoteSrc((p) => {
//     if (p === upvote) {
//       setPost((p) => {
//         console.log("post o post", p);
//         return { ...p, post: { ...p.post, like: p.post.like + 1 } };
//       });
//       return upvoteFilled;
//     } else if (p === upvoteFilled) {
//       setPost((p) => {
//         console.log("post o post", p);
//         return { ...p, post: { ...p.post, like: p.post.like - 1 } };
//       });
//       return upvote;
//     }
//   });
// };

// const downvoteHandler = () => {
//   // if there is a upvote remove it
//   if (upvoteSrc === upvoteFilled) {
//     setUpvoteSrc(upvote);
//     setPost((p) => {
//       return { ...p, post: { ...p.post, like: p.post.like - 1 } };
//     });
//   }

//   setDownvoteSrc((p) => {
//     if (p === upvote) {
//       setPost((p) => {
//         // console.log("post o post", p);
//         return { ...p, post: { ...p.post, dislike: p.post.dislike + 1 } };
//       });
//       return downvoteFilled;
//     } else if (p === downvoteFilled) {
//       setPost((p) => {
//         // console.log("post o post", p);
//         return { ...p, post: { ...p.post, dislike: p.post.dislike - 1 } };
//       });
//       return upvote;
//     }
//   });
// };

//   return (
//     <Card custom={classes.card}>
//       <div className={classes.topSection}>
//         <img
//           onClick={profileClickHandler}
//           className={classes.profile}
//           alt="profile pic"
//           src={profile}
//           onError={(e) => (e.target.src = "/images/profile.png")}
//         />
//         <div onClick={profileClickHandler} className={classes.nameContainer}>
//           <h1 className={classes.name}>{post.author.name}</h1>
//           <p className={classes.postTime}> &#183;</p>
//           <p className={classes.time}>{postDate}</p>
//         </div>

//         <h3 className={classes.userID}>{post.author.userID}</h3>
// <p className={classes.moreMenu}>&#183;&#183;&#183;</p>
//       </div>
//       <hr />
// <div>
//   <P
//     className={classes.content}
//     text={post.post.postContent.substring(0, showMore)}
//   >
//     {post.post.postContent.length > 165 && showMore === 165 ? (
//       <p
//         onClick={() => {
//           setShowMore(post.post.postContent.length);
//         }}
//         className={classes.showMore}
//       >
//         ...more
//       </p>
//     ) : (
//       ""
//     )}
//   </P>
// </div>
// {/* render only if there are images */}
// {listOfImages.length > 0 ? (
//   <div className={classes.imageSection}>
//     <img
//       className={`${classes.image}`}
//       src={listOfImages[mainImage]}
//       alt="post pic"
//     />
//     <img
//       onClick={arrowRightClickHandler}
//       className={` ${classes.rightArrow} ${classes.arrow}`}
//       src={arrow}
//       alt="click to see next pic"
//     />
//     <img
//       onClick={arrowLeftClickHandler}
//       className={`${classes.leftArrow} ${classes.arrow}`}
//       src={arrow}
//       alt="click to see next pic"
//     />
//     <div className={classes.dotContainer}>
//       {listOfImages.map((img, indx) => {
//         return (
//           <div
//             key={indx}
//             className={`${classes.dot} ${
//               mainImage === indx ? classes.dotActive : ""
//             }`}
//             onClick={() => {
//               dotClickHandler(indx);
//             }}
//           ></div>
//         );
//       })}
//     </div>
//   </div>
// ) : (
//   ""
// )}

// <div
//   className={`${classes.reactionSection} ${
//     listOfImages.length > 0 ? "" : classes.onlyTxt
//   }`}
// >
//   <div className={classes.reaction}>
//     <img
//       src={upvoteSrc}
//       alt="upvote"
//       onClick={upvoteHandler}
//       onMouseOver={(e) =>
//         upvoteSrc === upvoteFilled
//           ? ""
//           : (e.currentTarget.src = upvoteGreen)
//       }
//       onMouseLeave={(e) => (e.currentTarget.src = upvoteSrc)}
//     />
//     &nbsp;
//     <p
//       style={{ color: upvoteSrc === upvoteFilled ? "#2ba272" : "" }}
//       className={classes.reactTxt}
//     >
//       {post.post.like}
//     </p>
//   </div>

//   <div className={`${classes.reaction}`}>
//     <img
//       onClick={downvoteHandler}
//       className={classes.downVote}
//       src={downvoteSrc}
//       alt="downvote"
//       onMouseOver={(e) =>
//         downvoteSrc === downvoteFilled
//           ? ""
//           : (e.currentTarget.src = upvoteRed)
//       }
//       onMouseLeave={(e) => (e.currentTarget.src = downvoteSrc)}
//     />
//     &nbsp;
//     <p
//       style={{ color: downvoteSrc === downvoteFilled ? "#F91880" : "" }}
//       className={classes.reactTxt}
//     >
//       {post.post.dislike}
//     </p>
//   </div>

//   <div className={`${classes.reaction}`}>
//     <img
//       src={comment}
//       alt="comment"
//       onMouseOver={(e) => (e.currentTarget.src = commentGreen)}
//       onMouseLeave={(e) => (e.currentTarget.src = comment)}
//     />
//     &nbsp;
//     <p className={classes.reactTxt}>{post.post.comments}</p>
//   </div>

//   {post.post.postType === "collab" ? (
//     <div className={`${classes.reaction}`}>
//       <img
//         src={colab}
//         alt="share"
//         onMouseOver={(e) => (e.currentTarget.src = colabGreen)}
//         onMouseLeave={(e) => (e.currentTarget.src = colab)}
//       />
//     </div>
//   ) : (
//     ""
//   )}

//   <div className={`${classes.reaction}`}>
//     <img
//       src={share}
//       alt="share"
//       onMouseOver={(e) => (e.currentTarget.src = shareGreen)}
//       onMouseLeave={(e) => (e.currentTarget.src = share)}
//     />
//   </div>
// </div>
//     </Card>
//   );
// };

export default Post;
