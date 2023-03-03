import { ReduxStateType } from "../reduxStateType";
import { SubscriberType } from "../subscribe/subscriberType";
import { UserType } from "./userType";

export type UserStateType = {
  userData: UserType;
  subscribers: SubscriberType[];
  signup: ReduxStateType;
  checkDuplicate: ReduxStateType;
  checkDupNickName: ReduxStateType;
  checkDupEmail: ReduxStateType;
  signin: ReduxStateType;
  getMe: ReduxStateType;
  refreshToken: ReduxStateType;
  updateUser: ReduxStateType;
  deleteUser: ReduxStateType;
  getSubscribers: ReduxStateType;
  getIsOnAir: ReduxStateType;
  checkEmail: ReduxStateType;
};

