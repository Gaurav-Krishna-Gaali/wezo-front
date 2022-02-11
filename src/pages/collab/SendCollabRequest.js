import Card from "../../UI/Card";
import classes from "./sendCollabRequest.module.css";
import closeIcon from "../../UI/imgs/close.svg";
import { useState, useRef, useEffect } from "react";
import { autosize } from "../signUP/afterSignUp/Bio";
import InfiniteScroll from "react-infinite-scroll-component";
import { GuardSpinner } from "react-spinners-kit";
import Button from "../../UI/Button";
import { loadProjects } from "../Profile/V2/Projects";
import { loadProjectsURL } from "../../URL/signUpURL";
import { sendCollabRequestURL } from "../../URL/signUpURL";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { postActions } from "../../Store/posts-slice";
import { detailedPostActions } from "../../Store/detailed-post-slice";

export const myOwnIncludes = (mainArray, element) => {
  for (let i = 0; i < mainArray.length; i++) {
    if (mainArray[i] === element) {
      return { contains: true, foundAt: i };
    }
  }

  return { contains: false, foundAt: null };
};

const sendCollabRequest = async (
  url,
  token,
  postID,
  refProjects,
  comment,
  notify,
  update,
  closeDialouge,
  dispatch,
  index
) => {
  try {
    notify("sending request", { type: toast.TYPE.INFO, autoClose: false });
    const res = await axios.post(
      url,
      {
        postID,
        refProjects,
        comment,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    let typingTimer;
    let doneTypingInterval = 1000;

    dispatch(postActions.addCollabRequest({ index: index, collabRequest: res.data.collabRequest }));
    dispatch(detailedPostActions.addCollabRequest({ collabRequest: res.data.collabRequest }));
    // console.log("dataaaaaaaaaaa", res.data.collabRequest);

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      update("request sent");
      closeDialouge();
    }, doneTypingInterval);
  } catch (err) {
    let typingTimer;
    let doneTypingInterval = 1000;

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      update("err sending request", {
        type: toast.TYPE.ERROR,
        autoClose: 1000,
        style: { border: "none", color: "#f91880" },
      });
      closeDialouge();
    }, doneTypingInterval);
  }
};

const SendCollabRequest = (props) => {
  const textArea = useRef();
  const [text, setText] = useState("");
  const [projectsList, setProjectsList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedList, setSelectedList] = useState([]);
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

  const typingHandler = (e) => {
    if (e.target.value.length < 180) {
      setText(e.target.value);
    } else {
      setText(e.target.value.substring(0, 180));
    }
  };

  useEffect(() => {
    loadProjects(loadProjectsURL, props.token, props.userID, page, setProjectsList, setLoading, setHasMore, 15);
  }, [props.token, page]);

  const selectHandler = (id) => {
    let res = myOwnIncludes(selectedList, id);

    if (res.contains) {
      setSelectedList((p) => {
        const temp = [...p].filter((el) => el !== id);

        return temp;
      });
    } else {
      setSelectedList((p) => {
        if (p.length < 3) {
          return [...p, id];
        } else {
          return [p[1], p[2], id];
        }
      });
    }
  };

  const submitHandler = () => {
    sendCollabRequest(
      sendCollabRequestURL,
      props.token,
      props.postID,
      selectedList,
      text,
      notify,
      update,
      props.showCollabHandler,
      dispatch,
      props.index
    );
  };

  return (
    <div className={classes.container}>
      <Card custom={classes.card}>
        <div className={classes.heading}>
          <h3 className={classes.headingH3}>Send Collab Request</h3>
          <img onClick={props.showCollabHandler} src={closeIcon} alt="" className={classes.closeIcon} />
        </div>
        <hr />
        <p className={classes.label}>Add something</p>
        <div className={classes.textareaContainer}>
          <textarea
            rows={props.usedAs === "addReply" ? "2" : "4"}
            cols="4"
            ref={textArea}
            className={`${classes.collabTextArea}`}
            onChange={typingHandler}
            onKeyDown={autosize}
            placeholder={"use this space to show your expertise"}
            value={text}
          ></textarea>
          <p className={classes.count}>{180 - text.length}</p>
        </div>

        <div className={classes.attachProject}>
          <p className={classes.label}>Attach projects</p>
          <img
            className={classes.paperClip}
            src="https://wezo-media.s3.ap-south-1.amazonaws.com/UI/paper-clip.svg"
            alt=""
          />
        </div>
        <div className={classes.scrollable} id="scrollProfiles">
          <InfiniteScroll
            dataLength={
              projectsList.length
              // props.type == "following"
              //   ? props.user.followingCnt
              //   : props.user.followersCnt
            }
            next={() => setPage((p) => p + 1)}
            hasMore={hasMore}
            scrollableTarget="scrollProfiles"
          >
            {loading ? (
              <div className={classes.loader}>
                <GuardSpinner color={"#2ba272"} loading={loading} />
              </div>
            ) : (
              ""
            )}
            {projectsList.map((e, i) => {
              // return <ProjectComponent onClick={selectHandler} id={e._id} title={e.title} key={i} />;

              return (
                <div
                  key={i}
                  onClick={() => {
                    selectHandler(e._id);
                  }}
                  className={`${classes.projectItem} ${
                    selectedList[0] == e._id || selectedList[1] === e._id || selectedList[2] === e._id
                      ? classes.selected
                      : ""
                  }`}
                >
                  {e.title}
                </div>
              );
            })}
          </InfiniteScroll>
        </div>

        <Button onClick={submitHandler} custom={classes.btn} name="send request"></Button>
      </Card>
    </div>
  );
};

export default SendCollabRequest;
