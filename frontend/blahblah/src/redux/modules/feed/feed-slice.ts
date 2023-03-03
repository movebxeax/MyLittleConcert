import { createSlice } from "@reduxjs/toolkit";
import { FeedStateType } from "../../../model/feed/feedStateType";
import { getFeedFileAction, getFeedsAction } from "./feed-action";
import { FeedWrapType } from "../../../model/profile/feedWrapType";
const initialState: FeedStateType = {
  feeds: [],
  changed: false,
  feedData: null,
  getFeed: { loading: false, data: null, error: null },
  getFeedFile: { loading: false, data: null, error: null },
  newest: 0,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    replaceFeed(state, action) {
      state.feedData = action.payload.feeds;
    },
    resetNewest(state, action) {
      state.newest = action.payload.newest;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsAction.pending, (state) => {
        state.getFeed.loading = true;
        state.getFeed.data = null;
        state.getFeed.error = null;
      })
      .addCase(getFeedsAction.fulfilled, (state, { payload }) => {
        state.getFeed.loading = false;
        state.getFeed.data = payload;
        state.getFeed.error = null;

        state.feedData = payload;

        if (state.newest < state.feedData.content[0].id) {
          state.newest = state.feedData.content[0].id;
        }
      })
      .addCase(getFeedsAction.rejected, (state, { payload }) => {
        state.getFeed.loading = false;
        state.getFeed.data = null;
        state.getFeed.error = payload;
      })
      .addCase(getFeedFileAction.pending, (state) => {
        state.getFeedFile.loading = true;
        state.getFeedFile.data = null;
        state.getFeedFile.error = null;
      })
      .addCase(getFeedFileAction.fulfilled, (state, { payload }) => {
        state.getFeedFile.loading = false;
        state.getFeedFile.data = payload;
        state.getFeedFile.error = null;
      })
      .addCase(getFeedFileAction.rejected, (state, { payload }) => {
        state.getFeedFile.loading = false;
        state.getFeedFile.data = null;
        state.getFeedFile.error = payload;
      });
  },
});

export const feedActions = feedSlice.actions;

export default feedSlice.reducer;

