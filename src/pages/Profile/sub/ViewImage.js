import classes from "./ViewImage.module.css";
import Card from "../../../UI/Card";
import P from "../../../UI/P";

const ViewImage = (props) => {
  return (
    <Card custom={classes.card}>
      <img
        className={classes.img}
        src={props.src.replace("$", "%24")}
        alt="profile"
      />
    </Card>
  );
};

export default ViewImage;
