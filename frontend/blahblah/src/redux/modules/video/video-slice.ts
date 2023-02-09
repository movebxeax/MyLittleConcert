import { createSlice } from "@reduxjs/toolkit";
import { SessionType } from "../../../model/broadcast/sessionType";
import { VideoStateType } from "../../../model/video/VideoStateType";

const initialState: VideoStateType = {
  allVideoList: [
    {
      id: 1,
      userPK: 33,
      userId: "seoda0000",
      nickName: "seoda0000",
      avatar:
        '{"body":["rounded"],"clothingColor":["54d7c7"],"eyes":["happy"],"facialHair":[""],"facialHairProbability":100,"hair":["bobcut"],"hairColor":["e16381"],"mouth":["smile"],"nose":["smallRound"],"skinColor":["d78774"]}',
      title: "동영상제목1",
      views: 1000,
      pathUrl: "동영상경로여1",
      createDate: "2023-02-06T16:58:06.093775",
      hashtags:
        '[{"key":6,"label":"재즈","selected":true},{"key":7,"label":"클래식","selected":true},{"key":11,"label":"레게","selected":true},{"key":12,"label":"댄스","selected":true}]',
      // comments: {
      //   content: [],
      // },
    },
    {
      id: 2,
      userPK: 23,
      userId: "ssafy12",
      nickName: "ssafy12",
      avatar:
        '{"body":["rounded"],"clothingColor":["f3b63a"],"eyes":["glasses"],"facialHair":[""],"facialHairProbability":100,"hair":["fade"],"hairColor":["6c4545"],"mouth":["bigSmile"],"nose":["smallRound"],"skinColor":["d78774"]}',
      title: "동영상제목2",
      views: 340,
      pathUrl: "동영상경로여2",
      createDate: "2023-02-06T16:58:06.093775",
      hashtags: '[{"key":0,"label":"K-POP","selected":true}]',
      // comments: {
      //   content: [],
      // },
    },
    {
      id: 3,
      userPK: 13,
      userId: "abcde",
      nickName: "abcde",
      avatar:
        '{"body":["rounded"],"clothingColor":["54d7c7"],"eyes":["wink"],"facialHair":[""],"facialHairProbability":100,"hair":["long"],"hairColor":["6c4545"],"mouth":["bigSmile"],"nose":["smallRound"],"skinColor":["d78774"]}',
      title: "동영상제목3",
      views: 232402,
      pathUrl: "동영상경로여3",
      createDate: "2023-02-06T16:58:06.093775",
      hashtags:
        '[{"key":3,"label":"트로트","selected":true},{"key":22,"label":"그룹","selected":true}]',
      // comments: {
      //   content: [],
      // },
    },
  ],
  followingVideoList: [
    {
      id: 1,
      userPK: 33,
      userId: "seoda0000",
      nickName: "seoda0000",
      avatar:
        '{"body":["rounded"],"clothingColor":["000000"],"eyes":["happy"],"facialHair":["pyramid"],"facialHairProbability":100,"hair":["extraLong"],"hairColor":["6c4545"],"mouth":["bigSmile"],"nose":["smallRound"],"skinColor":["d78774"]}',
      title: "구독동영상제목1",
      views: 5435,
      pathUrl: "구독동영상경로여1",
      createDate: "2023-02-06T16:58:06.093775",
      hashtags:
        '[{"key":14,"label":"통기타","selected":true},{"key":16,"label":"밴드","selected":true}]',
      // comments: {
      //   content: [],
      // },
    },
    {
      id: 2,
      userPK: 23,
      userId: "ssafy12",
      nickName: "ssafy12",
      avatar:
        '{"body":["squared"],"clothingColor":["54d7c7"],"eyes":["happy"],"facialHair":[""],"facialHairProbability":100,"hair":["beanie"],"hairColor":["6c4545"],"mouth":["bigSmile"],"nose":["smallRound"],"skinColor":["d78774"]}',
      title: "구독동영상제목2",
      views: 430,
      pathUrl: "동영상경로여",
      createDate: "2023-02-06T16:58:06.093775",
      hashtags: '[{"key":13,"label":"EDM","selected":true}]',
      // comments: {
      //   content: [],
      // },
    },
    {
      id: 3,
      userPK: 13,
      userId: "abcde",
      nickName: "abcde",
      avatar:
        '{"body":["rounded"],"clothingColor":["54d7c7"],"eyes":["happy"],"facialHair":[""],"facialHairProbability":100,"hair":["curlyHighTop"],"hairColor":["6c4545"],"mouth":["bigSmile"],"nose":["smallRound"],"skinColor":["d78774"]}',
      title: "구독동영상제목3",
      views: 658,
      pathUrl: "동영상경로여",
      createDate: "2023-02-06T16:58:06.093775",
      hashtags:
        '[{"key":18,"label":"팬미팅","selected":true},{"key":17,"label":"리코더","selected":true}]',
      // comments: {
      //   content: [],
      // },
    },
  ],
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    replaceAllVideos(state, action) {
      state.allVideoList = action.payload.allVideoList;
    },
  },
});

export const videoActions = videoSlice.actions;

export default videoSlice.reducer;