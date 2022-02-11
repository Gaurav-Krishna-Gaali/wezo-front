import classes from "./projectPatch.module.css";
import P from "../../../UI/P";
import upvote from "../../../UI/imgs/upvote.svg";
import upvoteGreen from "../../../UI/imgs/upvoteGreen.svg";
import upvoteRed from "../../../UI/imgs/upvoteRed.svg";
import upvoteFilled from "../../../UI/imgs/upvoteFilled.svg";
import downvoteFilled from "../../../UI/imgs/downvoteFilled.svg";
import deleteIcon from "../../../UI/imgs/delete.svg";
import flagIcon from "../../../UI/imgs/flag.svg";
import moreMenu from "../../../UI/imgs/moreMenu.svg";
import close from "../../../UI/imgs/close.svg";
import { useState, useRef } from "react";

import BuiltWith from "./BuiltWith";

const ProjectPatch = (props) => {
  const project = props.project;
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const linkRef = useRef();

  const [likesCnt, setLikesCnt] = useState(project.likes[0].count);
  const [dislikesCnt, setDislikesCnt] = useState(project.dislikes[0].count);

  const [upvoteSrc, setUpvoteSrc] = useState(project.haveIUpvoted === true ? upvoteFilled : upvote);
  const [downvoteSrc, setDownvoteSrc] = useState(project.haveIDownvoted === true ? downvoteFilled : upvote);

  const upvoteHandler = () => {
    if (downvoteSrc === downvoteFilled) {
      setDownvoteSrc(upvote);
      setDislikesCnt((p) => p - 1);
    }

    setLikesCnt((p) => {
      if (upvoteSrc === upvoteFilled) {
        return p - 1;
      } else if (upvoteSrc === upvote) {
        return p + 1;
      }
    });

    setUpvoteSrc((p) => {
      if (p === upvote) {
        return upvoteFilled;
      } else if (p === upvoteFilled) {
        return upvote;
      }
    });

    props.projectReactHandler(props.index, 1, project._id);
  };

  const downvoteHandler = () => {
    if (upvoteSrc === upvoteFilled) {
      setUpvoteSrc(upvote);
      setLikesCnt((p) => p - 1);
    }

    setDislikesCnt((p) => {
      if (downvoteSrc === downvoteFilled) {
        return p - 1;
      } else if (downvoteSrc === upvote) {
        return p + 1;
      }
    });

    setDownvoteSrc((p) => {
      if (p === upvote) {
        return downvoteFilled;
      } else if (p === downvoteFilled) {
        return upvote;
      }
    });

    props.projectReactHandler(props.index, 0, project._id);
  };

  const deleteHandler = () => {
    props.deleteProjectHandler(props.index, project._id);
  };
  const moreMenuHandler = () => {
    setShowMoreMenu((p) => !p);
  };

  const linkClickHandler = () => {
    linkRef.current.click();
  };

  return (
    <div className={classes.project}>
      <h3 className={classes.no}>{props.index + 1 + "."}&nbsp;</h3>
      <div className={classes.content}>
        <div className={classes.next}>
          <h3 className={classes.title}>{project.title}</h3>
          <P className={classes.description} text={project.description}></P>
          <div className={classes.statusDiv}>
            <p className={classes.statusP}>
              Status: <span className={classes.statusSpan}>{project.status}</span>
            </p>
            <img
              className={classes.statusIcon}
              src={
                project.status === "Finished"
                  ? "https://wezo-media.s3.ap-south-1.amazonaws.com/UI/finished.svg"
                  : "https://wezo-media.s3.ap-south-1.amazonaws.com/UI/pending.svg"
              }
              alt=""
            />
          </div>
          <p className={classes.tech}>Built with:</p>
          <BuiltWith builtWith={project.tech} />

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
                {likesCnt}
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
                {dislikesCnt}
              </p>
            </div>

            <div
              style={{ cursor: "pointer" }}
              onClick={linkClickHandler}
              className={`${classes.reaction} ${classes.downvoteDiv}`}
            >
              <img src="https://wezo-media.s3.ap-south-1.amazonaws.com/UI/external+link.svg" alt="downvote" />

              <a ref={linkRef} className={classes.reactLink} href={project.link}>
                Visit
              </a>
            </div>

            <div className={classes.moreMenu}>
              <img
                className={classes.moreIcon}
                onClick={moreMenuHandler}
                src={showMoreMenu ? close : moreMenu}
                alt=""
              />
              {showMoreMenu ? (
                <div className={classes.floatingMenu}>
                  {project.u_id === props.loggedu_id ? (
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
        </div>
      </div>
    </div>
  );
};

export default ProjectPatch;
