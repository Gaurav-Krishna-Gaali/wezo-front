import Navbar from "../Feed/navbar/Navbar";
import { Fragment, useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, useHistory, Link, useParams, useLocation } from "react-router-dom";
import NavBar from "../Feed/navbar/Navbar";
import navBarClasses from "../Feed/feed.module.css";
import classes from "./collabMain.module.css";
import { NavLink } from "react-router-dom";
import ListCollabs from "./ListCollabs";

const CollabMain = (props) => {
  let user = useSelector((state) => state.user.userObj);
  const token = useSelector((state) => state.user.token);
  const [currentRoute, setCurrentRoute] = useState();
  const location = useLocation();

  useEffect(() => {
    const arr = location.pathname.split("/");
    setCurrentRoute(arr[arr.length - 1]);
  }, [location.pathname]);

  const subNavArray = [
    { title: "Requests received", to: "/collab" },
    { title: "Requests sent", to: "/collab/sent" },
    { title: "My collabs", to: "/collab/mine" },
  ];

  return (
    <Fragment>
      <Route path="/collab">
        <div className={navBarClasses.feed}>
          <div className={navBarClasses.navbar}>
            <NavBar userID={user.userID} />
          </div>
          <div className={`${navBarClasses.posts} ${classes.contentArea}`}>
            <div className={classes.topArea}>
              <div className={classes.subNav}>
                {subNavArray.map((e, i) => (
                  <NavLink key={i + "navbar"} to={e.to}>
                    <div
                      className={`${
                        currentRoute === e.to.split("/")[e.to.split("/").length - 1] ? classes.active : ""
                      }`}
                    >
                      {e.title}
                    </div>
                  </NavLink>
                ))}
              </div>
              <ListCollabs loggedUser={user} token={token} />
            </div>

            <Route exact path="/collab/sent">
              <div>sent</div>
            </Route>

            <Route exact path="/collab/mine">
              <div>my successfull collabs</div>
            </Route>
          </div>
          <div className={navBarClasses.suggested}></div>
        </div>
      </Route>
    </Fragment>
  );
};

export default CollabMain;
