import "./Loading.css";
import { PushSpinner } from "react-spinners-kit";

const Loading = (props) => {
  console.log(props.addClass, typeof props.addClass);

  return <p className={props.addClass}>{props.text}</p>;
};

export default Loading;
