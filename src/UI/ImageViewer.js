import classes from "./ImageViewer.module.css";
import close from "../UI/imgs/close.svg";
import arrow from "../UI/imgs/arrow.svg";
import { Fragment, useState } from "react";
const ImageViewer = (props) => {
  const [current, setCurrent] = useState(props.default);

  const leftClickHandler = () => {
    setCurrent((p) => {
      if (p === 0) {
        return props.images.length - 1;
      } else {
        return p - 1;
      }
    });
  };

  const rightClickHandler = () => {
    setCurrent((p) => {
      if (p === props.images.length - 1) {
        return 0;
      } else {
        return p + 1;
      }
    });
  };

  return (
    <div className={classes.imageViewer}>
      <div className={classes.container}>
        <img className={classes.mainImage} src={props.images[current]} alt="" />
        <div className={classes.closeButton}>
          <img src={close} onClick={props.viewHandler} alt="" />
        </div>
        {props.images.length > 1 ? (
          <Fragment>
            <img className={classes.leftArrow} onClick={leftClickHandler} src={arrow} alt="" />
            <img className={classes.rightArrow} onClick={rightClickHandler} src={arrow} alt="" />
          </Fragment>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
