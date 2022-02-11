import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

const detailedPostSlice = createSlice({
  name: "detailedPostSlice",
  initialState: {
    post: { showMore: 1024 },
    comments: [],
  },
  reducers: {
    reset(state, action) {
      if (state.post.u_id) {
        state.post = { showMore: 1024 };
      }
    },
    resetAll(state, action) {
      if (state.post.u_id) {
        state.post = { showMore: 1024 };
      }
      state.comments = [];
    },
    setPost(state, action) {
      state.post = { ...state.post, ...action.payload.post };
    },
    appendComments(state, action) {
      // console.log("action.payload.comments", action.payload.comments);
      const array = [...state.comments, ...action.payload.comments];
      const result = [];
      const map = new Map();
      for (const item of array) {
        if (!map.has(item._id)) {
          map.set(item._id, true); // set any value to Map
          result.push(item);
        }
      }
      state.comments = [...result];
    },
    addItOnTop(state, action) {
      // state.post.comments = state.post.comments + 1;
      state.comments = [...action.payload.comments, ...state.comments];
    },
    resetComments(state, action) {
      state.comments = [];
    },
    addRepliesToTop(state, action) {
      const id = action.payload.id;

      if (!state.comments[id].replies) {
        state.comments[id] = { ...state.comments[id], replies: [] };
      }

      const replies = [...action.payload.replies, ...state.comments[id].replies];
      state.comments[id].replies = [...replies];
      state.comments[id].repliesCnt = state.comments[id].repliesCnt + 1;
    },
    appendReplies(state, action) {
      const id = action.payload.id;

      if (!state.comments[id].replies) {
        state.comments[id] = { ...state.comments[id], replies: [] };
      }

      const array = [...state.comments[id].replies, ...action.payload.replies];
      const result = [];
      const map = new Map();
      for (const item of array) {
        if (!map.has(item._id)) {
          map.set(item._id, true); // set any value to Map
          result.push(item);
        }
      }

      state.comments[id].replies = [...result];
    },

    resetReplies(state, action) {
      const id = action.payload.id;
      state.comments[id].replies = [];
    },

    upvoteReply(state, action) {
      const commentIndex = action.payload.commentIndex;
      const replyIndex = action.payload.replyIndex;
      state.comments[commentIndex].replies[replyIndex] = {
        ...state.comments[commentIndex].replies[replyIndex],
        // likes: state.comments[commentIndex].replies[replyIndex].likes + action.payload.vote,
        likes:
          state.comments[commentIndex].replies[replyIndex].likes.length > 0
            ? [{ count: state.comments[commentIndex].replies[replyIndex].likes[0].count + action.payload.vote }]
            : [{ count: action.payload.vote }],
      };
    },

    downvoteReply(state, action) {
      const commentIndex = action.payload.commentIndex;
      const replyIndex = action.payload.replyIndex;
      state.comments[commentIndex].replies[replyIndex] = {
        ...state.comments[commentIndex].replies[replyIndex],
        // dislikes: state.comments[commentIndex].replies[replyIndex].dislikes + action.payload.vote,
        dislikes:
          state.comments[commentIndex].replies[replyIndex].dislikes.length > 0
            ? [{ count: state.comments[commentIndex].replies[replyIndex].dislikes[0].count + action.payload.vote }]
            : [{ count: action.payload.vote }],
      };
    },

    deleteReply(state, action) {
      const commentIndex = action.payload.commentIndex;
      const replyIndex = action.payload.replyIndex;
      state.comments[commentIndex].repliesCnt = state.comments[commentIndex].repliesCnt - 1;
      state.comments[commentIndex].replies.splice(replyIndex, 1);
    },

    deleteComment(state, action) {
      const commentIndex = action.payload.commentIndex;

      state.post.comments = state.post.comments - 1;
      state.comments.splice(commentIndex, 1);
    },

    commentUpvote(state, action) {
      const id = action.payload.id;
      state.comments[id].likes[0].count = state.comments[id].likes[0].count + action.payload.vote;
    },
    commentDownvote(state, action) {
      const id = action.payload.id;
      state.comments[id].dislikes[0].count = state.comments[id].dislikes[0].count + action.payload.vote;
    },

    addCollabRequest(state, action) {
      // const index = action.payload.index;

      state.post = { ...state.post, collabReaction: [action.payload.collabRequest] };
    },

    removeCollabRequest(state, action) {
      // const index = action.payload.index;

      state.post = { ...state.post, collabReaction: [] };
    },
  },
});

export const detailedPostActions = detailedPostSlice.actions;
export default detailedPostSlice;
