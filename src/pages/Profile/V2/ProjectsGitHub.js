import { useLocation, useHistory, useParams } from "react-router-dom";
import { GuardSpinner } from "react-spinners-kit";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Card from "../../../UI/Card";
import classes from "./projectsGithub.module.css";
import closeIcon from "../../../UI/imgs/close.svg";
import { gitLoadReposURL } from "../../../URL/signUpURL";
import InfiniteScroll from "react-infinite-scroll-component";
import AddProjects from "./AddProjects";

const loadRepos = async (url, userID, page, setRepos, setLoading, sort) => {
  try {
    // setLoading(true);
    if (page === 1) {
      setLoading(true);
    }
    const repos = await axios.get(url + userID + "/repos?per_page=10&sort=" + sort + "&page=" + page);

    console.log(repos.data);
    setRepos((p) => [...p, ...repos.data]);

    if (page === 1) {
      setLoading(false);
    }

    // setLoading(false);
  } catch (err) {}
};

const ProjectsGitHub = (props) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState("created");

  useEffect(() => {
    loadRepos(gitLoadReposURL, props.github_username, page + 1, setRepos, setLoading, sort);
  }, [props.userID, page, sort]);

  if (loading) {
    return (
      <Card custom={classes.card}>
        <div className={classes.loader}>
          <GuardSpinner color={"#2ba272"} loading={loading} />
          <p>fetching repos...</p>
        </div>
      </Card>
    );
  }

  const closeHandler = () => {
    history.replace("/profile/" + props.userID);
  };

  const sortHandler = (e) => {
    setSort(e.target.value);
    setRepos([]);
    setPage(0);
  };

  const addThisRepoHandler = (el) => {
    history.replace("/profile/" + props.userID + "/addProject/" + el.name);
  };

  return (
    <Fragment>
      <Card custom={classes.card}>
        <div className={classes.header}>
          <h1 className={classes.title}>Import Projects</h1>
          <img className={classes.closeIcon} onClick={closeHandler} src={closeIcon} alt="" />
        </div>
        <hr />
        <div className={classes.top}>
          <label className={classes.label} htmlFor="sort_repos">
            sort by
          </label>
          <select value={sort} onChange={sortHandler} className={classes.select} name="sort_repos" id="">
            <option value="created">created</option>
            <option value="updated">updated</option>
            <option value="pushed">pushed</option>
            <option value="full_name">full name</option>
          </select>
        </div>
        <div className={classes.scrollable} id="scrollrepos">
          <InfiniteScroll
            dataLength={repos.length}
            next={() => setPage((p) => p + 1)}
            hasMore={hasMore}
            scrollableTarget="scrollrepos"
          >
            {repos.map((el, ind) => {
              return (
                <div
                  key={ind}
                  className={classes.repo}
                  onClick={() => {
                    addThisRepoHandler(el);
                  }}
                >
                  <h3 className={classes.titleOfRepo}>{el.name}</h3>
                  <p className={classes.disOfRepo}>{el.description}</p>
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </Card>
    </Fragment>
  );
};

export default ProjectsGitHub;
