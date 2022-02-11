import Card from "../../../UI/Card";
import classes from "./skillsv2.module.css";
import editIcon from "../../../UI/imgs/edit icon.svg";
import editIconWhite from "../../../UI/imgs/edit icon dark.svg";
import { useHorizontalScroll } from "../useSideScroll";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Fragment, useState } from "react";
import AddSkills from "../../signUP/afterSignUp/AddSkills";
const Skills = (props) => {
  //   const isDarkMode = useSelector((state) => state.theme.darkMode);
  const scrollRef = useHorizontalScroll();
  const history = useHistory();
  const [viewEdit, setViewEdit] = useState(false);

  const editSkillsHandler = () => {
    setViewEdit((p) => !p);
  };

  return (
    <Fragment>
      <Card custom={classes.skillsCard}>
        <div className={classes.headingDiv}>
          <h1>Skills</h1>
          {props.showEditButton ? (
            <img src={editIconWhite} alt="edit skills" className={classes.editSkillsIcon} onClick={editSkillsHandler} />
          ) : (
            ""
          )}
        </div>

        <div className={classes.skills} ref={scrollRef}>
          {props.user.skills
            ? props.user.skills.map((e, i) => {
                return (
                  <Card custom={classes.skillCard} key={i}>
                    <img
                      src={"https://wezo-media.s3.ap-south-1.amazonaws.com/icons/" + e + ".svg"}
                      alt={e}
                      onError={(e) => (e.target.src = "/images/skill.svg")}
                    />
                    <p>{e}</p>
                  </Card>
                );
              })
            : ""}
        </div>
      </Card>
      {viewEdit ? (
        <div className={classes.editSkills}>
          <AddSkills
            setUser={props.setUser}
            editSkillsHandler={editSkillsHandler}
            usedAs="editSkills"
            skills={props.user.skills}
          />
        </div>
      ) : (
        ""
      )}
    </Fragment>
  );
};

export default Skills;
