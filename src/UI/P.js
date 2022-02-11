import classes from "./P.module.css";
import { useSelector } from "react-redux";
import { Fragment } from "react";
var validUrl = require("valid-url");

//FIXME: remove additional dependency for validating urls
const P = (props) => {
  const result = [];
  const isDarkMode = useSelector((state) => state.theme.darkMode);

  const imageLoadFailed = function (e) {
    e.target.style.display = "None";
    // console.log("failed to load image", e);
  };

  if (props.text) {
    const words = props.text.split(" ");
    for (let x = 0; x < words.length; x++) {
      if (validUrl.isUri(words[x])) {
        if (x !== 0) {
          result.push(" ");
        }
        result.push(
          <a key={x} style={isDarkMode ? { color: "#d9d9d9" } : {}} href={words[x]}>
            {words[x]}
          </a>
        );
        result.push(" ");
      } else if (words[x][0] === "#") {
        let ret = words[x].substring(1).replace("_", " ");

        result.push(
          <span key={x + "# key"} style={{ color: "#60b2e9", fontFamily: "HelvaLight" }}>
            {" " + words[x]}
          </span>
        );

        // console.log("the words are ", words[x], typeof words[x]);

        result.push(
          <img
            className={`${classes.emoji} ${props.emoji ? props.emoji : ""}`}
            key={x + x}
            src={"https://wezo-media.s3.ap-south-1.amazonaws.com/icons/" + ret.toLowerCase() + ".svg"}
            onError={imageLoadFailed}
            alt={words[0]}
          />
        );
      } else {
        if (x === 0) {
          result.push(words[x]);
        } else {
          result.push(" " + words[x]);
        }
      }
    }
  }

  return (
    <Fragment>
      <p className={`${classes.para} ${props.className ? props.className : ""} `}>{result}</p>
      {props.children}
    </Fragment>
  );
};

export default P;

// 	https://wezo-media.s3.ap-south-1.amazonaws.com/icons/redis.svg
