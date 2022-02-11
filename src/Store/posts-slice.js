import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    posts: [],
    page: 1,
  },
  reducers: {
    addPostToTop(state, action) {
      const newPost = action.payload.post;
      state.posts = [newPost, ...state.posts];
    },

    addToList(state, action) {
      const newList = action.payload.posts;

      // console.log("heres the new list ", newList);

      state.posts = [...state.posts, ...newList];
    },
    reset(state, action) {
      state.page = 1;
      state.posts = [];
    },
    setPageNo(state, action) {
      state.page = action.payload.pageNo;
    },
    setShowMore(state, action) {
      const length = action.payload.showMore;
      const id = action.payload.id;

      state.posts[id] = { ...state.posts[id], showMore: length };

      // console.log(length, id);
    },
    setUpvote(state, action) {
      let id = action.payload.id;

      // if type then search id
      if (action.payload.type) {
        for (let x = 1; x <= state.posts.length; x++) {
          if (state.posts.at(-x)._id == id) {
            id = state.posts.length - x;
            break;
          }
        }
      }
      const vote = action.payload.vote;

      // console.log("id", id, "vote", vote);

      // state.posts[id] = {
      //   ...state.posts[id],
      //   like: state.posts[id].like + vote,
      //   haveIUpvoted: vote === 1 ? true : false,
      //   haveIDownvoted: false,
      // };

      state.posts[id] = {
        ...state.posts[id],
        likes:
          state.posts[id].likes.length > 0 ? [{ count: state.posts[id].likes[0].count + vote }] : [{ count: vote }],
        haveIUpvoted: vote === 1 ? true : false,
        haveIDownvoted: false,
      };
    },
    setDownvote(state, action) {
      let id = action.payload.id;

      // if type then search id
      if (action.payload.type) {
        for (let x = 1; x <= state.posts.length; x++) {
          if (state.posts.at(-x)._id == id) {
            id = state.posts.length - x;
            break;
          }
        }
      }

      const vote = action.payload.vote;

      state.posts[id] = {
        ...state.posts[id],

        dislikes:
          state.posts[id].dislikes.length > 0
            ? [{ count: state.posts[id].dislikes[0].count + vote }]
            : [{ count: vote }],
        haveIDownvoted: vote === 1 ? true : false,
        haveIUpvoted: false,
      };
    },
    incrementComment(state, action) {
      const id = action.payload.id;
      for (let x = 1; x <= state.posts.length; x++) {
        if (state.posts.at(-x)._id == id) {
          state.posts.at(-x).comments = state.posts.at(-x).comments + 1;
          break;
        }
      }
    },

    deletePost(state, action) {
      const id = action.payload.id;
      state.posts.splice(id, 1);

      // state.comments.splice(commentIndex, 1);
    },

    detailedDelete(state, action) {
      const id = action.payload.id;
      for (let x = 1; x <= state.posts.length; x++) {
        if (state.posts.at(-x)._id == id) {
          state.posts.splice(state.posts.length - x, 1);
          break;
        }
      }
    },

    addCollabRequest(state, action) {
      console.log("payload", action.payload);

      const index = action.payload.index;

      state.posts[index] = { ...state.posts[index], collabReaction: [action.payload.collabRequest] };
    },

    removeCollabRequest(state, action) {
      const index = action.payload.index;
      // state.posts.posts[index].collabReaction = [];

      // state.posts[index].collabReaction = [];

      state.posts[index] = { ...state.posts[index], collabReaction: [] };

      // state.posts.posts[index].collabReaction = [];
    },
  },
});

export const postActions = postSlice.actions;
export default postSlice;
