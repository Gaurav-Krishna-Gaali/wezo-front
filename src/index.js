import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./Store/index";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./index.css";
import App from "./App";
import classes from "./App.module.css";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <ToastContainer
        bodyClassName={classes.toastBody}
        toastClassName={classes.toastClass}
        pauseOnHover={true}
        pauseOnFocusLoss={false}
        position="bottom-center"
        className={classes.toastContainer}
      />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
