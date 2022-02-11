import classes from "./FormError.module.css";

const FormError = (props) => {
  let styles;
  if (props.invalid) {
    styles = classes.errorMessage + " " + classes.invalid;
  } else {
    styles = classes.errorMessage + " " + classes.valid;
  }
  return <p className={styles}>{props.message}</p>;
};

export default FormError;
