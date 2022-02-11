import Card from "../../../UI/Card";
import classes from "./addProject.module.css";
import closeIcon from "../../../UI/imgs/close.svg";
import { autosize } from "../../signUP/afterSignUp/Bio";
import { useState, useRef, Fragment } from "react";
import Button from "../../../UI/Button";
import ProjectsGitHub from "./ProjectsGitHub";
import axios from "axios";
import { Route, Switch, useHistory, Link, useParams } from "react-router-dom";
import { skillAutoURL, gitRepoURL, addProjectURL } from "../../../URL/signUpURL";
import { useEffect } from "react";
import { GuardSpinner } from "react-spinners-kit";
import { ToastContainer, toast } from "react-toastify";

var validUrl = require("valid-url");

const loadRepo = async (
  url,
  github_username,
  repo,
  setTitle,
  setText,
  setTech,
  setLink,
  setLoading,
  history,
  notify,
  userID
) => {
  try {
    setLoading(true);
    const result = await axios.get(url + github_username + "/" + repo);
    // console.log(result.data);

    const languages = await axios.get(result.data.languages_url);
    // console.log("langa", Object.keys(languages.data));

    if (languages.data) {
      // setTech(languages);
      // console.log(languages.data);
      setTech([...Object.keys(languages.data)]);
    }

    setTitle(result.data.name);
    if (result.data.description) {
      setText(result.data.description.substring(0, 1024));
    }
    setLink(result.data.html_url);
    setLoading(false);
  } catch (err) {
    // console.error("err getting repo", err);
    notify("err in loading repos try later...!");
    history.replace("/profile/" + userID);
  }
};

const AddProjects = (props) => {
  const history = useHistory();
  const params = useParams();
  const repo = params.repo;

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const textArea = useRef();
  const [stopSearch, setStopSearch] = useState({ att: 0, val: false });
  const [sugg, setSugg] = useState([]);
  const [techArray, setTechArray] = useState([]);
  const [focus, setFocus] = useState(0);
  const [enteredTech, setEnteredTech] = useState();
  const [title, setTitle] = useState();

  const [status, setStatus] = useState("Finished");

  const [link, setLink] = useState();
  const inputTechRef = useRef();

  const toastId = useRef(null);

  const notify = (message, details = null) =>
    (toastId.current = toast(message, {
      autoClose: 2000,
      bodyClassName: classes.bodyToast,
      className: classes.containerToast,
      progressClassName: classes.progressBar,

      ...details,
    }));

  const update = (message, autoClose, details = null) =>
    toast.update(toastId.current, {
      render: message,
      type: toast.TYPE.SUCCESS,
      autoClose: 1000 || autoClose,
      pauseOnFocusLoss: false,
      pauseOnHover: false,
      ...details,
    });

  // this is only if repo param exists
  useEffect(() => {
    if (repo) {
      loadRepo(
        gitRepoURL,
        props.github_username,
        repo,
        setTitle,
        setText,
        setTechArray,
        setLink,
        setLoading,
        history,
        notify,
        props.userID
      );
    }
  }, [props.github_username, repo]);

  const closeHandler = () => {
    history.replace("/profile/" + props.userID);
  };

  if (loading) {
    return (
      <div className={`${classes.cnt}`}>
        <Card custom={`${classes.card}`}>
          <div className={classes.topSection}>
            <h1 className={classes.title}>Add Project</h1>
            <img onClick={closeHandler} className={classes.closeIcon} src={closeIcon} alt="" />
          </div>
          <hr />
          <div className={classes.loader}>
            <GuardSpinner color={"#2ba272"} loading={loading} />
          </div>
        </Card>
      </div>
    );
  }

  const typingHandler = (e) => {
    if (e.target.value.length <= 1024) {
      setText(e.target.value);
    } else {
      setText(e.target.value.substring(0, 1024));
      notify("description should be shorter than 1000 chars");
    }
  };

  let typingTimer;
  let doneTypingInterval = 500;

  const techTyping = (ee) => {
    setEnteredTech(ee.target.value.trim());

    if (stopSearch.val && stopSearch.att > ee.target.value.length) {
      setStopSearch({ att: 0, val: false });
    }

    // to prevent typing lag on last sugg while stopsearch val===true
    if (stopSearch.val) {
      techHandler(ee);
    } else {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(function () {
        techHandler(ee);
      }, doneTypingInterval);
    }
  };

  const statusHandler = (e) => {
    setStatus(e.target.value);
  };

  const techHandler = async (e) => {
    if (e.target.value.length >= 2 && !stopSearch.val) {
      const suggestions = await axios.get(skillAutoURL + e.target.value, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      });

      if (suggestions.data.search.length === 0) {
        setStopSearch({ att: e.target.value.length, val: true });
      }

      setSugg([...suggestions.data.search, { name: e.target.value.trim() }]);
    } else if (e.target.value.length < 2) {
      setFocus(0);
      setSugg([]);
      setStopSearch({ att: 0, val: false });
    }

    if (stopSearch.val) {
      setSugg([{ name: e.target.value.trim() }]);
    }
  };

  const arrowkeyHandlers = (e) => {
    // arrow down
    if (e.keyCode === 40) {
      if (focus === sugg.length) {
        setFocus(0);
      } else {
        setFocus((p) => p + 1);
      }
    } else if (e.keyCode === 38) {
      e.preventDefault();
      if (focus === 0) {
        setFocus(sugg.length);
      } else {
        setFocus((p) => p - 1);
      }
    } else if (e.keyCode === 13) {
      setTechArray((p) => [...p, e.target.value.trim()]);
      setFocus(0);
      setStopSearch({ att: 0, val: false });
      setSugg([]);
      setEnteredTech("");
    } else if (e.keyCode === 8 && focus !== 0) {
      // setTechArray((p) => [...p, e.target.value.trim()]);
      // setTechArray(sugg[focus - 1].name);
      // setStopSearch({ att: 0, val: false });
      setEnteredTech(sugg[focus - 1].name);
      setSugg([]);
      setFocus(0);
    }
  };

  const addByClick = (tech) => {
    inputTechRef.current.focus();
    setTechArray((p) => [...p, tech]);
    setFocus(0);
    setStopSearch({ att: 0, val: false });
    setSugg([]);
    setEnteredTech("");
  };

  const removeTech = (tech) => {
    // const temp = [...techArray].filter((el) => el !== tech);

    // setTechArray([...temp]);

    inputTechRef.current.focus();
    setTechArray((p) => {
      const temp = [...p].filter((el) => el !== tech);

      return temp;
    });
  };

  const addFromGitHandler = () => {
    if (props.github_username) {
      history.push("/profile/" + props.userID + "/addFromGithub");
    }
  };

  const titleHandler = (e) => {
    if (e.target.value.trim().length < 100) {
      setTitle(e.target.value);
    } else {
      notify("use title shorter than 100 chars");
    }
  };

  const linkHandler = (e) => {
    if (e.target.value.trim().length < 100) {
      setLink(e.target.value.trim());
    } else {
      notify("add links shorter than 100 chars");
    }
  };

  const submitProjectHandler = async (e, s) => {
    if (link && !validUrl.isUri(link)) {
      notify("Please add a valid URL");
      return;
    }

    if (title.length > 0) {
      notify("Adding project", {
        autoClose: false,
        type: toast.TYPE.INFO,
        bodyClassName: classes.bodyToastSuccess,
        className: classes.containerToastSuccess,
        progressClassName: classes.progressBarSuccess,
      });

      const body = { title: title, description: text, link: link, repo: repo, tech: techArray, status: status };

      const result = await axios.post(addProjectURL, body, {
        headers: {
          Authorization: "Bearer " + props.token,
        },
      });

      let project = { ...result.data.project, likes: [{ count: 0 }], dislikes: [{ count: 0 }] };

      props.addedProjectHandler(project);
      history.replace("/profile/" + props.userID);

      update("Project added successfully", { autoClose: 1000, type: toast.TYPE.SUCCESS });
    }
  };

  return (
    <Fragment>
      <div className={classes.cnt}>
        <Card custom={classes.card}>
          <div className={classes.topSection}>
            <h1 className={classes.title}>Add Project</h1>
            <img onClick={closeHandler} className={classes.closeIcon} src={closeIcon} alt="" />
          </div>
          <hr />
          <p className={classes.field}>Title</p>
          <textarea
            // placeholder="eg: Translator bot"
            onChange={titleHandler}
            className={classes.textarea}
            name="title"
            cols="1"
            rows="1"
            value={title}
          ></textarea>
          {/* 
              <p className={classes.field}>One liner</p>
              <textarea
                // placeholder="eg: Translates text from one language to other"
                className={classes.textarea}
                name="title"
                cols="1"
                rows="1"
              ></textarea> */}

          <p className={classes.field}>Description</p>
          <div className={classes.desCnt}>
            <textarea
              ref={textArea}
              value={text}
              onChange={typingHandler}
              onKeyDown={autosize}
              className={classes.textarea}
              name="title"
              cols="3"
              rows="4"
            ></textarea>
            <p className={classes.count}>{1024 - text.length}</p>
          </div>

          <p className={classes.field}>Tech stack</p>
          <div className={classes.tech}>
            <div className={classes.suggestions}>
              {sugg.map((e, i) => (
                <div
                  style={i + 1 === focus ? { backgroundColor: "#656565" } : {}}
                  className={classes.suggestionsItem}
                  onClick={() => {
                    addByClick(e.name);
                  }}
                  key={i}
                  onMouseMove={() => {
                    setFocus(i + 1);
                  }}
                >
                  {e.name}
                </div>
              ))}
            </div>

            {techArray.map((el, ind) => (
              <span key={ind + "added tech"} className={classes.item}>
                <p>{el}</p>{" "}
                <img
                  onClick={() => {
                    removeTech(el);
                  }}
                  src={closeIcon}
                  alt=""
                />
              </span>
            ))}

            {/* <span className={classes.item}>
                hello <img src={closeIcon} alt="" />
              </span> */}

            <input
              value={focus === 0 ? enteredTech : sugg[focus - 1].name}
              onKeyDown={arrowkeyHandlers}
              className={classes.input}
              onChange={techTyping}
              type="text"
              ref={inputTechRef}
              autoFocus={techArray.length > 0 ? (focus === 0 ? true : false) : ""}
            />

            {/* <div className={classes.rest}>aa</div> */}
          </div>

          <p className={classes.field}>Link</p>
          <textarea
            value={link}
            onChange={linkHandler}
            className={classes.textarea}
            name="title"
            cols="1"
            rows="1"
          ></textarea>

          {/* <div className={classes.status}>
            <p className={`${classes.field} ${classes.fieldP}`}>Status</p>
            <div className={classes.circle}>
              <div className={classes.filled}></div>
            </div>
            <div className={classes.circle}></div>
          </div> */}
          <div className={classes.status}>
            <p className={`${classes.field} ${classes.fieldP}`}>Status</p>
            <select className={classes.select} name="sort_repos" id="" value={status} onChange={statusHandler}>
              <option value="Finished">Finished</option>
              <option value="In development">In development</option>
            </select>
          </div>

          <Button custom={classes.btn} name="Add Project" onClick={submitProjectHandler} />
          {!repo ? (
            <Fragment>
              <div className={classes.or}>
                <hr />
                <span>or</span>
                <hr />
              </div>
              <div className={classes.gitDiv}>
                {!props.github_username ? (
                  <a
                    href={
                      "https://github.com/login/oauth/authorize?client_id=491398f9a595f2bf1b88&state=/profile/" +
                      props.userID
                    }
                  >
                    {" "}
                    <span>import from </span>github
                  </a>
                ) : (
                  <Fragment>
                    <span className={classes.notFirstTime}>
                      import from <span onClick={addFromGitHandler}>github</span>
                    </span>
                  </Fragment>
                )}

                <img src="https://wezo-media.s3.ap-south-1.amazonaws.com/icons/github.svg" alt="" />
              </div>
            </Fragment>
          ) : (
            ""
          )}
        </Card>
      </div>
    </Fragment>
  );
};
export default AddProjects;
