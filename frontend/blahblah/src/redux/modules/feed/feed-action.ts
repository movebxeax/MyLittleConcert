import { createAsyncThunk } from "@reduxjs/toolkit";
import { FeedType } from "../../../model/feed/feedType";
import { feedActions } from "./feed-slice";
import { AppDispatch } from "../../configStore";
import { useSelector, useDispatch } from "react-redux";
import { FeedPostType } from "../../../model/feed/feedPostType";
import { FeedEditType } from "../../../model/feed/feedEditType";
import { FeedRemoveType } from "../../../model/feed/feedRemoveType";
import { getAccessToken } from "../user/token";
import { axiosInitializer } from "../../utils/axiosInitializer";
import { CommentPostType } from "../../../model/feed/commentPostType copy";
import { videoActions } from "../video/video-slice";
import video from "../video";
import { getVideoById } from "../video";

import feed from ".";
import { FeedWrapType } from "../../../model/profile/feedWrapType";

// 피드 목록 가져오기 (무한스크롤 페이징 적용)
export const getFeedsAction = createAsyncThunk(
  "GET_FEEDS",
  async (reqData: { size: number; page: number }, thunkAPI) => {
    try {
      // console.log("작성 후 getfeeds", reqData.page);
      const axios = axiosInitializer();

      const { data } = await axios.get<FeedWrapType>(
        `/api/articles/${reqData.size}/${reqData.page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getAccessToken(),
          },
        }
      );
      // console.log("피드 데이터", data);

      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 피드 목록 가져오기
export const fetchFeedData = createAsyncThunk(
  "feed/fetchFeedData",
  async (_, thunkAPI) => {
    try {
      // const dispatch = useDispatch<AppDispatch>();
      const axios = axiosInitializer();

      const response = await axios.get(`/api/articles/5/0`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Baerer " + getAccessToken(),
        },
      });

      const feeds = response.data;

      thunkAPI.dispatch(
        feedActions.replaceFeed({
          feeds: feeds,
        })
      );

      return response.data;
    } catch (e: any) {
      // console.error(e.response.data);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

//피드 파일 가져오기
export const getFeedFileAction = createAsyncThunk(
  "feed/getFeedFile",
  async (filePath: string, thunkAPI) => {
    try {
      const axios = axiosInitializer();

      const { data } = await axios.get<Blob>(`/api/articles/file`, {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        responseType: "blob",
        params: {
          filePath: filePath,
        },
      });
  // console.log("!!!피드파일가져옴!!!!", data);
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 새 피드 작성하기

export const postFeedData2 = createAsyncThunk(
  "feed/postFeedData",
  async (postData: FeedPostType, thunkAPI) => {
    try {
      const axios = axiosInitializer();

      await axios
        .post<FeedPostType>(`/api/articles`, postData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Baerer " + getAccessToken(),
          },
        })
        .then(({ data }: any) => {
          // console.log("피드 작성: ", data);

          // thunkAPI.dispatch(fetchFeedData());

          thunkAPI.dispatch(getFeedsAction({ size: 5, page: 0 }));
        });

      // return data;
    } catch (e: any) {
      // console.log("작성 실패");
      // console.log(e.request);
      // console.error(e.response.data);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

export const postFeedData = createAsyncThunk(
  "feed/postFeedData",
  async (formData: FormData, thunkAPI) => {
    try {
      const axios = axiosInitializer();

      await axios
        .post<FeedPostType>(`/api/articles`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Baerer " + getAccessToken(),
          },
        })
        .then(({ data }: any) => {
          // console.log("피드 작성: ", data);

          // thunkAPI.dispatch(fetchFeedData());

          thunkAPI.dispatch(getFeedsAction({ size: 5, page: 0 }));
        });

      // return data;
    } catch (e: any) {
      // console.log("작성 실패");
      // console.log(e.request);
      // console.error(e.response.data);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 피드 삭제하기

export const removeFeedData = createAsyncThunk(
  "feed/removeFeedData",
  async (removeData: any, thunkAPI) => {
    try {
      const axios = axiosInitializer();

      const { data } = await axios.delete<FeedRemoveType>(
        `/api/articles/${removeData.id}/${removeData.userPK}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Baerer " + getAccessToken(),
          },
        }
      );
      // console.log("피드 삭제: ", data);
      // thunkAPI.dispatch(fetchFeedData());
      thunkAPI.dispatch(feedActions.resetNewest({ newest: 0 }));
      thunkAPI.dispatch(getFeedsAction({ size: 5, page: 0 })).then(() => {});

      return data;
    } catch (e) {
      // console.log("피드 삭제 실패", removeData);
      // console.error(e);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 피드 수정하기

export const editFeedData = createAsyncThunk(
  "feed/editFeedData",
  async (editData: FeedEditType, thunkAPI) => {
    try {
      const axios = axiosInitializer();

      await axios
        .put<FeedEditType>(`/api/articles`, editData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Baerer " + getAccessToken(),
          },
        })
        .then(({ data }: any) => {
          // console.log("피드 수정: ", data);
          // thunkAPI.dispatch(getFeedsAction({ size: 5, page: 0 }));
          // thunkAPI.dispatch(feedActions.resetNewest({ newest: 0 }));
        });

      // return data;
    } catch (e: any) {
      // console.log("수정 실패");
      // console.log(e.request);
      // console.error(e.response.data);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 덧글 작성

export const postCommentData = createAsyncThunk(
  "feed/postCommentData",
  async (postData: CommentPostType, thunkAPI) => {
    try {
      const axios = axiosInitializer();

      let target = "articles";
      if (postData.videoId) {
        target = "videos";
      }

      await axios
        .post<CommentPostType>(`/api/comments/${target}`, postData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Baerer " + getAccessToken(),
          },
        })
        .then(({ data }: any) => {
          // console.log("덧글 작성: ", data);

          if (postData.articleId) {
            // thunkAPI.dispatch(fetchFeedData());
            thunkAPI.dispatch(feedActions.resetNewest({ newest: 0 }));
            thunkAPI.dispatch(getFeedsAction({ size: 5, page: 0 }));
          } else {
            thunkAPI.dispatch(getVideoById(postData.videoId!));
          }
        });
    } catch (e: any) {
      // console.log("덧글 작성 실패");
      // console.error(e.response.data);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 덧글 삭제하기

export const removeCommentData = createAsyncThunk(
  "feed/removeCommentData",
  async (removeData: any, thunkAPI) => {
    try {
      const axios = axiosInitializer();

      let target = "articles";
      if (removeData.isVideo) {
        target = "videos";
      }

      await axios
        .delete(
          `/api/comments/${target}/${removeData.id}/${removeData.userPK}`,
          {
            // data: removeData,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Baerer " + getAccessToken(),
            },
          }
        )
        .then((data) => {
          // console.log("덧글 삭제: ", data);
          if (removeData.isVideo) {
            thunkAPI.dispatch(getVideoById(removeData.videoId));
          } else {
            thunkAPI.dispatch(feedActions.resetNewest({ newest: 0 }));
            thunkAPI.dispatch(getFeedsAction({ size: 5, page: 0 }));
          }
        });
    } catch (e) {
      // console.error(e);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 피드 좋아요

export const likeFeedAction = createAsyncThunk(
  "feed/likeFeedAction",
  async (articleId: number, thunkAPI) => {
    try {
      const axios = axiosInitializer();

      await axios
        .post(
          `/api/likes/articles/`,
          { articleId: articleId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Baerer " + getAccessToken(),
            },
          }
        )
        .then(({ data }: any) => {
          // console.log("피드 좋아요: ", data);

          thunkAPI.dispatch(fetchFeedData());

          // console.log("피드 리스트 갱신 완료");
        });
    } catch (e: any) {
      // console.log("피드 좋아요 실패");
      // console.error(e.response.data);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

// 피드 좋아요 취소

export const likeCancelAction = createAsyncThunk(
  "feed/likeCancelAction",
  async (articleId: number, thunkAPI) => {
    try {
      const axios = axiosInitializer();

      await axios
        .delete(`/api/likes/articles/${articleId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Baerer " + getAccessToken(),
          },
        })
        .then(({ data }: any) => {
          // console.log("피드 좋아요 취소: ", data);

          thunkAPI.dispatch(fetchFeedData());

  // console.log("피드 리스트 갱신 완료");
        });
    } catch (e: any) {
  // console.log("피드 좋아요 치소 실패");
      // console.error(e.response.data);
      return thunkAPI.rejectWithValue(e);
    }
  }
);

