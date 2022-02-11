import classes from "../Profile.module.css";
import Card from "../../../UI/Card";
import { Fragment } from "react";
import { useSelector } from "react-redux";

const projects = [
  {
    title: "Controls calculator",
    oneLiner:
      "It is an android application that can make various control system plots",
    buildWith: ["#android_development", "#java", "#python", "#flask", "#numpy"],
  },
  {
    title: "ElectricalPy",
    oneLiner:
      "It is a python library that could simulate electrical circuits and make various plots",
    buildWith: ["#scipy", "#matplotlib", "#numpy", "#python"],
  },
];

const Projects = (props) => {
  const isDarkMode = useSelector((state) => state.theme.darkMode);

  const imageLoadFailed = function (e) {
    e.target.style.display = "None";
    console.log("failed to load image", e);
  };
  return (
    <Card custom={`${classes.skillsCard} ${classes.projects}`}>
      <h1 style={isDarkMode ? { color: "#838383" } : {}}>PROJECTS</h1>
      {projects.map((p, i) => (
        <Fragment key={p.title + i}>
          <h2 key={p.title} style={isDarkMode ? { color: "#d9d9d9" } : {}}>
            {i + 1 + ". " + p.title}
          </h2>
          <div key={i}>
            <p
              key={p.oneLiner.split(5)}
              style={isDarkMode ? { color: "#d9d9d9" } : {}}
            >
              {p.oneLiner}
            </p>
            <h3 key={i}>built with</h3>
            {p.buildWith.map((t, ind) => {
              let tech = t.substring(1).replace("_", " ");

              return (
                <img
                  key={tech}
                  alt={t + "icon"}
                  src={
                    "https://wezo-media.s3.ap-south-1.amazonaws.com/icons/" +
                    tech +
                    ".svg"
                  }
                  onError={(e) => (e.target.src = "/images/profile.png")}
                />
              );
            })}
            {i < projects.length - 1 ? <hr></hr> : ""}
          </div>
        </Fragment>
      ))}
    </Card>
  );
};

export default Projects;
