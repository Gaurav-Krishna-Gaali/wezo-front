import classes from "./projectPatch.module.css";
// import { useHorizontalScroll } from "../useSideScroll";
import { useEffect, useRef, useState } from "react";

function useHorizontalScroll2() {
  const elRef = useRef();
  useEffect(() => {
    const el = elRef.current;

    if (el) {
      const onWheel = (e) => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 4,
          behavior: "smooth",
        });
      };

      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);
  return elRef;
}

const BuiltWith = (props) => {
  const builtArray = props.builtWith;
  const scrollRef = useHorizontalScroll2();
  return (
    <div className={classes.techContainer} ref={scrollRef}>
      {builtArray.map((el, i) => {
        return (
          <div key={i} className={classes.techCard}>
            <img
              onError={(e) => (e.target.src = "/images/skill.svg")}
              src={"https://wezo-media.s3.ap-south-1.amazonaws.com/icons/" + el.toLowerCase() + ".svg"}
              alt=""
            />
          </div>
        );
      })}
    </div>
  );
};

export default BuiltWith;
