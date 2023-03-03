import { FeedWrapType } from "../profile/feedWrapType";
import { ReduxStateType } from "../reduxStateType";
import { FeedType } from "./feedType";
export type FeedStateType = {
  feeds: FeedType[];
  changed: boolean;
  feedData: FeedWrapType | null;
  getFeed: ReduxStateType;
  getFeedFile: ReduxStateType;
  newest: number;
};

