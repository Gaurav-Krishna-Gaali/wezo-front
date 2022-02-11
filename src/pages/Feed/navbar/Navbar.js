import { navElements } from "./navElements";
import classes from "./navbar.module.css";
import logoIcon from "../../../UI/imgs/navIcons/logoDarkTransparent.svg";
import Button from "../../../UI/Button";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
const NavBar = (props) => {
  const user = useSelector((state) => state.user.userObj);

  const toLinks = {
    Home: "/feed",
    Profile: "/profile/" + user.userID,
    Collab: "/collab",

    Search: "/search",
    Notifications: "/notifications",
    Messages: "/messages",
  };

  return (
    <div className={classes.navWrapper}>
      <div className={classes.navContainer}>
        <div className={classes.logo}>
          <img src={logoIcon} alt="" />
          <h1>WeZo.club</h1>
        </div>
        {navElements.map((e, i) => (
          // <div className={classes.navItem} key={"navbarDiv" + i}>
          //   <div className={classes.inside}>
          //     <img src={e.icon} alt="" />
          //     {/* <h2>{e.title}</h2> */}
          //     <NavLink className={classes.navLink} to={toLinks[e.title]}>
          //       {e.title}
          //     </NavLink>
          //   </div>
          // </div>
          <NavLink key={i + "navbar"} className={classes.navLink} to={toLinks[e.title]}>
            <div className={classes.navItem} key={"navbarDiv" + i}>
              <div className={classes.inside}>
                <img src={e.icon} alt="" />
                {/* <h2>{e.title}</h2> */}
                {e.title}
              </div>
            </div>
          </NavLink>
        ))}
        <Button custom={classes.btn} name="signout"></Button>
      </div>
    </div>
  );
};

export default NavBar;
