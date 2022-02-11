import Card from "../../../UI/Card";
import { useSelector, useDispatch } from "react-redux";
import classes from "./AddSkills.module.css";
import Button from "../../../UI/Button";
import axios from "axios";
import React, { useState, useRef } from "react";
import del from "../../../UI/imgs/close.svg";
import { skillAutoURL, addSkillsURL } from "../../../URL/signUpURL";
import { Link } from "react-router-dom";
import { loadingActions } from "../../../Store/loading-slice";
import { userActions } from "../../../Store/user-slice";
import { useHistory } from "react-router-dom";
import closeIcon from "../../../UI/imgs/close.svg";

const AddSkills = (props) => {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  let user = useSelector((state) => state.user.userObj);
  const dispatch = useDispatch();

  // try
  let egSkills = ["eg: python"];
  if (props.skills) {
    console.log(props.skills);
    egSkills = [...props.skills];
  }

  const [skill, setSkill] = useState(egSkills);
  const token = useSelector((state) => state.user.token);
  const [sarray, setSarray] = useState([]); // suggestions array
  const [stopSearch, setStopSearch] = useState(false);
  const [index, setIndex] = useState(0);
  const history = useHistory();
  const usedAs = props.usedAs;

  if (index != 0) {
    console.log(document.getElementById(index - 1 + "sarray"));
  }

  // const [typing, setTyping] = useState(false);
  const inpSkill = useRef();

  const skillHandler = async (e) => {
    if (e.target.value.length >= 2 && !stopSearch) {
      const suggestions = await axios.get(skillAutoURL + e.target.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (suggestions.data.search.length === 0) {
        setStopSearch(true);
      }

      // console.log(suggestions.data.search.length === 0);

      setSarray([...suggestions.data.search, { name: "" }]);
    }
    if (e.target.value.length < 2) {
      setStopSearch(false); // activate search after backspacing unknown skill eg nodejs
      setSarray([]);
    }

    console.log([...sarray]);
    setSarray((prev) => {
      const temp = [...prev];
      temp[prev.length - 1] = { name: e.target.value };
      return temp;
    });

    // remove example skill
    if (skill[0] === "eg: python") {
      setSkill([]);
    }
  };

  const addSkillHandler = (e) => {
    // console.log(e.target.outerText);
    document.getElementById("searchBarForSkills").focus();

    setIndex(0);
    setStopSearch(false);

    console.log(inpSkill);
    inpSkill.current.value = "";
    setSarray([]);
    if (skill) {
      if (!skill.includes(e.target.outerText)) {
        setSkill((oldArray) => [...oldArray, e.target.outerText]);
      }
    } else {
      setSkill([e.target.outerText]);
    }
  };

  const enterHandler = (e) => {
    if (e.keyCode === 13 && index === 0) {
      addSkillHandler({ target: { outerText: e.target.value } });
    } else if (e.keyCode === 13) {
      document.getElementById(index - 1 + "sarray").click();
    }
  };

  const removeSkill = (e) => {
    // console.log(e.target.outerText);
    document.getElementById("searchBarForSkills").focus();
    const temp = [...skill].filter((el) => el !== e);

    setSkill([...temp]);
  };

  const arrowkeyHandlers = (e) => {
    // console.log(e);
    // arrow down
    if (e.keyCode === 40) {
      if (index === sarray.length) {
        setIndex(0);
      } else {
        setIndex((p) => p + 1);
      }
    } else if (e.keyCode === 38) {
      if (index === 0) {
        setIndex(sarray.length);
      } else {
        setIndex((p) => p - 1);
      }
    }
  };

  const submitSkillsHandler = async (e) => {
    if (skill.length > 0) {
      // no more old school loading
      if (usedAs === "addSkills") {
        dispatch(
          loadingActions.setLoading({
            isLoading: true,
            message: "Updating your skills",
          })
        );
      }
      // console.log(token);
      const res = await axios.post(
        addSkillsURL,
        { skills: skill },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const tempUser = { ...user, skills: skill };

      dispatch(userActions.signUp({ user: tempUser, token: token }));
      localStorage.setItem("user_Obj", JSON.stringify(tempUser));

      // TODO: check if signup is working properly
      // history.push("/profile");

      if (usedAs === "addSkills") {
        dispatch(
          loadingActions.setLoading({
            isLoading: true,
            message: "skills updated successfully",
          })
        );

        setTimeout(function () {
          dispatch(
            loadingActions.setLoading({
              isLoading: false,
            })
          );
        }, 1000);

        history.push("/signup/addbio");
      } else if (usedAs === "editSkills") {
        props.setUser({ ...tempUser });
        props.editSkillsHandler();
      }
    }
  };

  return (
    <Card custom={classes.card}>
      <div className={classes.logonstep}>
        <img
          className={classes.logo}
          alt="logo"
          src={isDarkMode ? "/images/wezo_dark.svg" : "/images/wezo_white.svg"}
        />
        {usedAs === "editSkills" ? (
          <img src={closeIcon} onClick={props.editSkillsHandler} className={classes.closeIcon} alt="" />
        ) : (
          <p className={classes.steps}>Step 3 of 4</p>
        )}
      </div>
      <h1 className={`${classes.heading} ${isDarkMode ? classes.HeadingDark : ""}`}>
        {usedAs === "editSkills" ? "Edit" : "Add"} your skill set...!
      </h1>
      {/* <h1 className={classes.subHeading}>Add a splash of personality and mention something that you love</h1> */}

      <div className={classes.searchBox}>
        <div className={classes.content}>
          <input
            id="searchBarForSkills"
            ref={inpSkill}
            autoFocus
            className={`${classes.skills} ${isDarkMode ? classes.skillsDark : ""}`}
            onChange={skillHandler}
            placeholder="Search for skills"
            onKeyUp={enterHandler}
            onKeyDown={arrowkeyHandlers}
            autoComplete="off"
          />

          <img className={classes.search} alt="search icon" src="/images/search.svg" />
        </div>

        <ul className={classes.suggestions}>
          {sarray
            ? sarray.map((s, i) => {
                if (s.name !== "") {
                  return (
                    <li className={index - 1 === i ? classes.addThisgoogle : ""} key={s.name}>
                      <p id={i + "sarray"} onClick={addSkillHandler}>
                        {s.name}
                      </p>
                    </li>
                  );
                }
              })
            : ""}
        </ul>

        <div className={classes.skillContent}>
          {skill
            ? skill.map((e) => (
                <div key={e} className={classes.addedSkills}>
                  <div key={e} className={classes.skillContainer}>
                    {e}
                  </div>
                  <img
                    className={classes.hide}
                    onClick={() => {
                      removeSkill(e);
                    }}
                    alt={e}
                    src={del}
                  />
                </div>
              ))
            : ""}
        </div>
        <hr className={classes.dashedLine} />
      </div>
      <Button
        onClick={submitSkillsHandler}
        custom={`${classes.button} ${!isDarkMode ? classes.buttonNotDark : ""}`}
        name="Submit"
      />
      {props.skills ? (
        ""
      ) : (
        <Link className={classes.link} to="/signup/addbio">
          Skip for now
        </Link>
      )}
    </Card>
  );
};

export default AddSkills;
