import Card from "../../../UI/Card";
import classes from "../Profile.module.css";
import editIcon from "../../../UI/imgs/edit icon.svg";
import editIconWhite from "../../../UI/imgs/edit icon dark.svg";
import { useHorizontalScroll } from "../useSideScroll";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
const Skills = (props) => {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const scrollRef = useHorizontalScroll();
  const history = useHistory();

  const editSkillsHandler = () => {
    history.push(`/profile/${props.user.userID}/editSkills`);
  };

  return (
    <Card custom={classes.skillsCard}>
      <h1 style={isDarkMode ? { color: "#838383" } : {}}>SKILLS</h1>
      {props.showEditButton ? (
        <img
          src={isDarkMode ? editIcon : editIconWhite}
          alt="edit skills"
          id={classes.editSkillsIcon}
          onClick={editSkillsHandler}
        />
      ) : (
        ""
      )}

      <div className={classes.skills} ref={scrollRef}>
        {props.user.skills
          ? props.user.skills.map((e, i) => {
              return (
                <Card
                  inLine={
                    isDarkMode
                      ? { backgroundColor: "#fefefe" }
                      : { backgroundColor: "#f1f1f1" }
                  }
                  custom={classes.skillCard}
                  key={i}
                >
                  <img
                    src={
                      "https://wezo-media.s3.ap-south-1.amazonaws.com/icons/" +
                      e +
                      ".svg"
                    }
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
  );
};

export default Skills;
