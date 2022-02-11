import axios from "axios";
import classes from "./projects.module.css";
import Card from "../../../UI/Card";
import editIcon from "../../../UI/imgs/edit icon dark.svg";
import { useState, useEffect, Fragment } from "react";
import AddProjects from "./AddProjects";
import { useLocation, useHistory, Route, Switch, Link, useParams } from "react-router-dom";
import ProjectsGitHub from "./ProjectsGitHub";
import { loadProjectsURL, reactOnProjectURL, deleteProjectURL } from "../../../URL/signUpURL";
import { GuardSpinner } from "react-spinners-kit";
import ProjectPatch from "./ProjectPatch";
export const loadProjects = async (url, token, user_id, page, setProjects, setLoading, setHasMore, perPage = 3) => {
  try {
    if (page === 0) {
      setLoading(true);
    }
    const body = { user_id: user_id, page: page, perPage };

    const projects = await axios.post(url, body, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (projects.data.projects.length < 3) {
      setHasMore(false);
    }

    for (let x = 0; x < projects.data.projects.length; x++) {
      let merger = { haveIUpvoted: false, haveIDownvoted: false };
      if (projects.data.projects[x].reactions.length > 0) {
        if (projects.data.projects[x].reactions[0].reaction == 1) {
          merger.haveIUpvoted = true;
        } else if (projects.data.projects[x].reactions[0].reaction == 0) {
          merger.haveIDownvoted = true;
        }

        projects.data.projects[x] = { ...projects.data.projects[x], ...merger };
      }
    }

    for (let y = 0; y < projects.data.projects.length; y++) {
      if (projects.data.projects[y].likes.length < 1) {
        projects.data.projects[y].likes = [{ count: 0 }];
      }
      if (projects.data.projects[y].dislikes.length < 1) {
        projects.data.projects[y].dislikes = [{ count: 0 }];
      }
    }

    setProjects((p) => [...p, ...projects.data.projects]);
    setLoading(false);
    // console.log(projects.data);
  } catch (err) {
    console.error("err loading projects of user", err);
  }
};

const deleteProject = async (url, projectID, token, setProject, index) => {
  try {
    await axios.delete(url + projectID, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    // console.log("delete trigger");

    setProject((p) => {
      // const a = [...p.splice(index, 1)];
      // console.log("p", p);
      // console.log("a", a);
      return p.filter((el, i) => {
        if (i !== index) {
          return el;
        }
      });
    });
  } catch (err) {
    console.error("error deleting project", err);
  }
};

const reactOnProject = async (url, projectID, reaction, token, setProject, index) => {
  try {
    const reactionResult = await axios.post(
      url,
      { reaction: reaction, projectID: projectID },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    // TODO: this looks like garbage but will change it soon

    console.log("project reaction response ", reactionResult.data);
  } catch (err) {
    console.error("can't react on project err", err);
  }
};

const Projects = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (props.user_id && props.token) {
      loadProjects(loadProjectsURL, props.token, props.user_id, page, setProjectList, setLoading, setHasMore);
    }
  }, [props.user_id, page]);

  const addProjectHandler = () => {
    history.replace("/profile/" + props.userID + "/addProject");
  };

  const projectReactHandler = (index, reaction, projectID) => {
    reactOnProject(reactOnProjectURL, projectID, reaction, props.token, setProjectList, index);
  };

  const deleteProjectHandler = (index, projectID) => {
    deleteProject(deleteProjectURL, projectID, props.token, setProjectList, index);
  };

  const addedProjectHandler = (project) => {
    setProjectList((p) => [...p, project]);
  };

  const showMoreHandler = () => {
    if (hasMore) {
      setPage((p) => p + 1);
    }
  };

  if (loading) {
    return (
      <Card custom={classes.card}>
        <div className={classes.topDiv}>
          <h1 className={classes.title}>Projects</h1>
          {/* <img src={editIcon} alt="" /> */}
          <h1 onClick={addProjectHandler} className={classes.noProjectsH1}>
            +
          </h1>
        </div>
        <div className={classes.loader}>
          <GuardSpinner color={"#2ba272"} loading={loading} />
        </div>
      </Card>
    );
  }

  return (
    <Card custom={classes.card}>
      <div className={classes.topDiv}>
        <h1 className={classes.title}>Projects</h1>
        {/* <img src={editIcon} alt="" /> */}
        <h1 onClick={addProjectHandler} className={classes.noProjectsH1}>
          +
        </h1>
      </div>
      {projectList.length < 1 ? (
        <div className={classes.noProjects}>
          <img src="https://wezo-media.s3.ap-south-1.amazonaws.com/UI/no-projects.png" alt="" />
        </div>
      ) : (
        ""
      )}

      <div className={classes.projectsCnt}>
        {projectList.map((el, i) => {
          return (
            <Fragment key={i}>
              <ProjectPatch
                projectReactHandler={projectReactHandler}
                index={i}
                project={el}
                key={i}
                loggedu_id={props.loggedu_id}
                deleteProjectHandler={deleteProjectHandler}
              />
              <hr className={classes.hr} />
              {i === projectList.length - 1 ? (
                <div onClick={showMoreHandler} className={classes.showMoreDiv}>
                  {hasMore ? <p>show more</p> : <p>End</p>}
                </div>
              ) : (
                ""
              )}
            </Fragment>
          );
        })}
      </div>

      <Route exact path={"/profile/" + props.userID + "/addProject"}>
        <AddProjects
          addedProjectHandler={addedProjectHandler}
          github_username={props.github_username}
          userID={props.userID}
          token={props.token}
        />
      </Route>

      <Route exact path={"/profile/" + props.userID + "/addProject/:repo"}>
        <AddProjects
          addedProjectHandler={addedProjectHandler}
          github_username={props.github_username}
          userID={props.userID}
          token={props.token}
        />
      </Route>

      <Route exact path={"/profile/" + props.userID + "/addFromGithub"}>
        <div className={classes.cnt}>
          <ProjectsGitHub userID={props.userID} github_username={props.github_username} />
        </div>
      </Route>
    </Card>
  );
};

export default Projects;
