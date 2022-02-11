import SignUp from "./pages/signUP/Signup";
import { Switch, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/LoginPage/Login";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "./Store/user-slice";
import { themeActions } from "./Store/theme-slice";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import Feed from "./pages/Feed/Feed";
import Profile from "./pages/Profile/Profile";
import Bio from "./pages/signUP/afterSignUp/Bio";
import AddSkills from "./pages/signUP/afterSignUp/AddSkills";
import UserName from "./pages/signUP/afterSignUp/UserName";

import { useSelector } from "react-redux";
import UploadProfile from "./pages/signUP/afterSignUp/UploadProfile";
import LoadingSpinner from "./UI/LoadingSpinner";

import ProfielV2 from "./pages/Profile/V2/ProfileV2";
import NavBar from "./pages/Feed/navbar/Navbar";
import { useHistory } from "react-router";
import Redirecort from "./tools/Redirector";
import CollabMain from "./pages/collab/CollabMain";

import MultipartTest from "./tools/MultipartTest";
import Messages from "./pages/Chat/Messages";
import Chats from "./pages/Chat/Chats";
const loadingSavedData = (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user_Obj"));
    const darkMode = localStorage.getItem("darkMode");

    if (user !== null || token !== null) {
      dispatch(userActions.signUp({ user, token }));
    }
    if (darkMode !== null) {
      dispatch(
        themeActions.setTheme({
          darkMode: darkMode === "false" ? false : true,
        })
      );
    }

    // console.log(token, user);
  } catch (err) {
    console.log(err);
  }
};

function App() {
  // for updating the redux state

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // loading from local storage
    loadingSavedData(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dark theme
  // const isDarkMode = useSelector((state) => state.theme.darkMode);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const token = useSelector((state) => state.user.token);

  console.log("main app");
  return (
    <Switch>
      {isLoading ? <LoadingSpinner /> : ""}
      <Route path="/" exact>
        <LandingPage />
      </Route>
      <Route exact path="/signup">
        <SignUp />
      </Route>

      <Route path="/login">
        <Login />
      </Route>
      <Route path="/verifyEmail/:EmailToken">
        <VerifyEmail />
      </Route>
      <Route path="/forgotPassword">
        <ForgotPassword />
      </Route>
      <Route path="/changePassword/:RestToken">
        <ChangePassword />
      </Route>
      <Route path="/feed">
        <Feed />
      </Route>
      <Route path="/collab">
        <CollabMain />
      </Route>
      <Route path="/profile/:userID">
        {/* <Profile token={token} /> */}

        <ProfielV2 token={token} />
      </Route>
      <Route exact path="/signup/uploadProfile">
        <UploadProfile />
      </Route>
      <Route path="/signup/addskills">
        <AddSkills usedAs="addSkills" />
      </Route>
      <Route path="/signup/addusername">
        <UserName />
      </Route>
      <Route exact path="/signup/addbio">
        <Bio />
      </Route>
      <Route exact path="/playground">
        <MultipartTest token={token} />
      </Route>
      <Route exact path={"/redirect/git/addproject"}>
        <Redirecort token={token} />
      </Route>

      <Route path="/messages">
        <Messages />
      </Route>
      <Route exact path="/Chats">
        <Chats />
      </Route>

      <Route path="*">
        <h1>foul path </h1>
      </Route>
    </Switch>
  );
}

export const loadFromStorage = loadingSavedData;
export default App;

// signup --> verify email
//            |
//            |
//            - - - upload profile  -- bio  -- skills --- username
