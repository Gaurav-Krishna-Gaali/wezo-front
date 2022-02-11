const production = "https://wezo-backend.herokuapp.com/";
const dev = "http://localhost:3000/";

// let env = production;
let env=dev;

export const signUpURL = env + "api/v1/users/signup";
export const loginURL = env + "api/v1/users/login";
export const verifyEmailURL = env + "api/v1/users/verifyEmail/"; // here token
export const sendVerificationURL = env + "api/v1/users/sendVerificationEmail";
export const forgotPasswordURL = env + "api/v1/users/forgotPassword";
export const resetPasswordURL = env + "api/v1/users/resetPassword/"; // send token
export const profilePreURL = env + "api/v1/users/uploadProfile";
export const profileStatus = env + "api/v1/users/profileStatus/"; //send token

export const addBio = env + "api/v1/users/addBio";
export const skillAutoURL = env + "api/v1/skill/auto/"; //entered skill as token
export const addSkillsURL = env + "api/v1/users/addSkills";
export const checkUserNameURL = env + "api/v1/users/checkUserName/"; // send uname as token
export const setUsernameURL = env + "api/v1/users/setUsername";
export const updateNameURL = env + "api/v1/users/updateName";
export const viewProfileURL = env + "api/v1/users/viewProfile/"; // send the userID
export const followURL = env + "api/v1/users/follow"; // send post with follow id
export const amIFollowingURL = env + "api/v1/users/amIfollowing"; // post id
export const getFollowingURL = env + "api/v1/users/getFollowing"; // u id, page no

export const getFollowersURL = env + "api/v1/users/getFollowers"; // u id, page no

export const getPostURL = env + "api/v1/posts/showPost/"; //send post as param
export const feedURL = env + "api/v1/posts/feed";

export const createPostURL = env + "api/v1/posts/create";
export const postStatusURL = env + "api/v1/posts/status/"; //send id of post

export const reactURL = env + "api/v1/posts/reactPost";
export const addCommentURL = env + "api/v1/posts/comment";
export const commentsFeedURL = env + "api/v1/posts/commentsFeed";
export const commentStatusURL = env + "api/v1/posts/comment/status/"; // send comment id as params
export const commentReactionURL = env + "api/v1/posts/comment/reaction";
export const deleteCommentURL = env + "api/v1/posts/comment/"; //send comment id

export const replyReactionURL = env + "api/v1/posts/reply/reaction";
export const getRepliesURL = env + "api/v1/posts/getReplies";
export const addReplyURL = env + "api/v1/posts/addReply";
export const replyStatusURL = env + "api/v1/posts/reply/status/";
export const deleteReplyURL = env + "api/v1/posts/reply/";

export const giphyTrendingURL = "https://api.giphy.com/v1/gifs/trending?api_key=rs40lGAaQGDam6kxgXlV6ZAR4srLUYVh";
export const giphySearchURL = "https://api.giphy.com/v1/gifs/search?api_key=rs40lGAaQGDam6kxgXlV6ZAR4srLUYVh";
export const giphyFromIDURL = "http://api.giphy.com/v1/gifs?api_key=rs40lGAaQGDam6kxgXlV6ZAR4srLUYVh&ids="; //send id

export const deletePostURL = env + "api/v1/posts/delete/"; //send post id;

export const startUploadURL = env + "api/v1/posts/startUpload";
export const getUploadURL = env + "api/v1/posts/getUploadURL";
export const finishUploadURL = env + "api/v1/posts/completeUpload";

export const githubCodeURL = env + "api/v1/users/github/oauth/"; // append the code

export const gitLoadReposURL = "https://api.github.com/users/";
export const gitRepoURL = "https://api.github.com/repos/"; //send user/repo

export const addProjectURL = env + "api/v1/users/addProject";
export const loadProjectsURL = env + "api/v1/users/listProjects";
export const reactOnProjectURL = env + "api/v1/users/project/react";
export const deleteProjectURL = env + "api/v1/users/project/"; // send project id

export const sendCollabRequestURL = env + "api/v1/posts/collabRequest";
export const withdrawCollabRequestURL = env + "api/v1/posts/collabRequest/"; // attach request id
export const getListOfCollabPostsURL = env + "api/v1/posts/collabPosts";
