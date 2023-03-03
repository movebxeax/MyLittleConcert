import { createSlice } from "@reduxjs/toolkit";
import { UserStateType } from "../../../model/user/userStateType";
import {
  checkDuplicateAction,
  checkDupNickNameAction,
  checkDupEmailAction,
  deleteUserAction,
  getIsOnAirAction,
  getMeWithTokenAction,
  getSubscribersAction,
  refreshTokenAction,
  signinAction,
  signupAction,
  updateUserAction,
  sendEmailAction,
} from "./thunk";

const initialState: UserStateType = {
  userData: {
    id: null,
    userId: "",
    nickName: "",
    email: "",
    phoneNumber: null,
    avatar: null,
    lightStick: null,
    aboutMe: "",
    isLoggedIn: false,
    subscribers: 0,
  },
  subscribers: [],
  signup: { loading: false, data: null, error: null },
  checkDuplicate: { loading: false, data: null, error: null },
  checkDupNickName: { loading: false, data: null, error: null },
  checkDupEmail: { loading: false, data: null, error: null },
  signin: { loading: false, data: null, error: null },
  getMe: { loading: false, data: null, error: null },
  refreshToken: { loading: false, data: null, error: null },
  updateUser: { loading: false, data: null, error: null },
  deleteUser: { loading: false, data: null, error: null },
  getSubscribers: { loading: false, data: null, error: null },
  getIsOnAir: { loading: false, data: null, error: null },
  checkEmail: { loading: false, data: null, error: null },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupAction.pending, (state) => {
        state.signup.loading = true;
        state.signup.data = null;
        state.signup.error = null;
      })
      .addCase(signupAction.fulfilled, (state, { payload }) => {
        state.signup.loading = false;
        state.signup.data = payload;
        state.signup.error = null;
      })
      .addCase(signupAction.rejected, (state, { payload }) => {
        state.signup.loading = false;
        state.signup.data = null;
        state.signup.error = payload;
      })
      .addCase(checkDuplicateAction.pending, (state) => {
        state.checkDuplicate.loading = true;
        state.checkDuplicate.data = null;
        state.checkDuplicate.error = null;
      })
      .addCase(checkDuplicateAction.fulfilled, (state, { payload }) => {
        state.checkDuplicate.loading = false;
        state.checkDuplicate.data = payload;
        state.checkDuplicate.error = null;
      })
      .addCase(checkDuplicateAction.rejected, (state, { payload }) => {
        state.checkDuplicate.loading = false;
        state.checkDuplicate.data = null;
        state.checkDuplicate.error = payload;
      })
      .addCase(checkDupNickNameAction.pending, (state) => {
        state.checkDupNickName.loading = true;
        state.checkDupNickName.data = null;
        state.checkDupNickName.error = null;
      })
      .addCase(checkDupNickNameAction.fulfilled, (state, { payload }) => {
        state.checkDupNickName.loading = false;
        state.checkDupNickName.data = payload;
        state.checkDupNickName.error = null;
      })
      .addCase(checkDupNickNameAction.rejected, (state, { payload }) => {
        state.checkDupNickName.loading = false;
        state.checkDupNickName.data = null;
        state.checkDupNickName.error = payload;
      })
      .addCase(checkDupEmailAction.pending, (state) => {
        state.checkDupEmail.loading = true;
        state.checkDupEmail.data = null;
        state.checkDupEmail.error = null;
      })
      .addCase(checkDupEmailAction.fulfilled, (state, { payload }) => {
        state.checkDupEmail.loading = false;
        state.checkDupEmail.data = payload;
        state.checkDupEmail.error = null;
      })
      .addCase(checkDupEmailAction.rejected, (state, { payload }) => {
        state.checkDupEmail.loading = false;
        state.checkDupEmail.data = null;
        state.checkDupEmail.error = payload;
      })
      .addCase(signinAction.pending, (state) => {
        state.signin.loading = true;
        state.signin.data = null;
        state.signin.error = null;
      })
      .addCase(signinAction.fulfilled, (state, { payload }) => {
        state.signin.loading = false;
        state.signin.data = payload;
        state.signin.error = null;
      })
      .addCase(signinAction.rejected, (state, { payload }) => {
        state.signin.loading = false;
        state.signin.data = null;
        state.signin.error = payload;
      })
      .addCase(getMeWithTokenAction.pending, (state) => {
        state.getMe.loading = true;
        state.getMe.data = null;
        state.getMe.error = null;
      })
      .addCase(getMeWithTokenAction.fulfilled, (state, { payload }) => {
        state.getMe.loading = false;
        state.getMe.data = payload;
        state.getMe.error = null;

        state.userData.id = payload.id;
        state.userData.userId = payload.userId;
        state.userData.email = payload.email;
        state.userData.nickName = payload.nickName;
        state.userData.phoneNumber = payload.phoneNumber;
        state.userData.avatar = payload.avatar;
        state.userData.lightStick = payload.lightStick;
        state.userData.isLoggedIn = true;
        state.userData.subscribers = payload.subscribers;
      })
      .addCase(getMeWithTokenAction.rejected, (state, { payload }) => {
        state.getMe.loading = false;
        state.getMe.data = null;
        state.getMe.error = payload;
      })
      .addCase(refreshTokenAction.pending, (state) => {
        state.refreshToken.loading = true;
        state.refreshToken.data = null;
        state.refreshToken.error = null;
      })
      .addCase(refreshTokenAction.fulfilled, (state, { payload }) => {
        state.refreshToken.loading = false;
        state.refreshToken.data = payload;
        state.refreshToken.error = null;
      })
      .addCase(refreshTokenAction.rejected, (state, { payload }) => {
        state.refreshToken.loading = false;
        state.refreshToken.data = null;
        state.refreshToken.error = payload;
      })
      .addCase(updateUserAction.pending, (state) => {
        state.updateUser.loading = true;
        state.updateUser.data = null;
        state.updateUser.error = null;
      })
      .addCase(updateUserAction.fulfilled, (state, { payload }) => {
        state.updateUser.loading = false;
        state.updateUser.data = payload;
        state.updateUser.error = null;
      })
      .addCase(updateUserAction.rejected, (state, { payload }) => {
        state.updateUser.loading = false;
        state.updateUser.data = null;
        state.updateUser.error = payload;
      })
      .addCase(deleteUserAction.pending, (state) => {
        state.deleteUser.loading = true;
        state.deleteUser.data = null;
        state.deleteUser.error = null;
      })
      .addCase(deleteUserAction.fulfilled, (state, { payload }) => {
        state.deleteUser.loading = false;
        state.deleteUser.data = payload;
        state.deleteUser.error = null;

        state.userData = initialState.userData;
      })
      .addCase(deleteUserAction.rejected, (state, { payload }) => {
        state.deleteUser.loading = false;
        state.deleteUser.data = null;
        state.deleteUser.error = payload;
      })
      .addCase(getSubscribersAction.pending, (state) => {
        state.getSubscribers.loading = true;
        state.getSubscribers.data = null;
        state.getSubscribers.error = null;
      })
      .addCase(getSubscribersAction.fulfilled, (state, { payload }) => {
        state.getSubscribers.loading = false;
        state.getSubscribers.data = payload;
        state.getSubscribers.error = null;

        state.subscribers = payload;
      })
      .addCase(getSubscribersAction.rejected, (state, { payload }) => {
        state.getSubscribers.loading = false;
        state.getSubscribers.data = null;
        state.getSubscribers.error = payload;
      })
      .addCase(getIsOnAirAction.pending, (state) => {
        state.getIsOnAir.loading = true;
        state.getIsOnAir.data = null;
        state.getIsOnAir.error = null;
      })
      .addCase(getIsOnAirAction.fulfilled, (state, { payload }) => {
        state.getIsOnAir.loading = false;
        state.getIsOnAir.data = payload;
        state.getIsOnAir.error = null;

        state.subscribers.map((subscriber, idx) => {
          if (subscriber.userId === payload.streamer.userId) {
            state.subscribers[idx].isOnAir = payload;
          }
        });
      })
      .addCase(getIsOnAirAction.rejected, (state, { payload }) => {
        state.getIsOnAir.loading = false;
        state.getIsOnAir.data = null;
        state.getIsOnAir.error = payload;
      })
      .addCase(sendEmailAction.pending, (state) => {
        state.checkEmail.loading = true;
        state.checkEmail.data = null;
        state.checkEmail.error = null;
      })
      .addCase(sendEmailAction.fulfilled, (state, { payload }) => {
        state.checkEmail.loading = false;
        state.checkEmail.data = payload;
        state.checkEmail.error = null;
      })
      .addCase(sendEmailAction.rejected, (state, { payload }) => {
        state.checkEmail.loading = false;
        state.checkEmail.data = null;
        state.checkEmail.error = payload;
      });
  },
});

export default userSlice.reducer;
