import React, { Component } from "react";
import classes from "./Toggle.module.css";

class ToggleSwitch extends Component {
  render() {
    return (
      <div className={classes["toggle-switch"]}>
        <input type="checkbox" className={classes["toggle-switch-checkbox"]} name={this.props.Name} id={this.props.Name} />
        <label className={classes["toggle-switch-label"]} htmlFor={this.props.Name}>
          <span className={classes["toggle-switch-inner"]} />
          <span className={classes["toggle-switch-switch"]} />
        </label>
      </div>
    );
  }
}

export default ToggleSwitch;
