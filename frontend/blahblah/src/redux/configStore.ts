import { configureStore } from "@reduxjs/toolkit";
import user from "./modules/user";
import feed from "./modules/feed";
import profile from "./modules/profile";
import broadcast from "./modules/broadcast";
import video from "./modules/video";
const store = configureStore({
  reducer: {
    user,
    feed,
    profile,
    broadcast,
    video,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

