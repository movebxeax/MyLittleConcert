import Box from "@mui/material/Box";
import { Paper } from "@mui/material";
import VideoCard from "../components/video/VideoCard";
import Grid from "@mui/material/Grid";
import FeedList from "../components/feed/FeedList";
import EditorModal from "../components/feed/EditorModal";
import Button from "@mui/material/Button";
import CreateIcon from "@mui/icons-material/Create";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchFeedData,
  getFeedsAction,
} from "../redux/modules/feed/feed-action";
import { useEffect, useState } from "react";
import { AppDispatch } from "../redux/configStore";
import { RootState } from "../redux/configStore";
import RightVideoSection from "../components/video/RightVideoSection";
import InfiniteScroll from "../components/ui/InfiniteScroll";
import { useAppSelector } from "../redux/configStore.hooks";
import { ProfileFeedType } from "../model/profile/profileFeedType";
import { useNavigate } from "react-router-dom";

const drawerWidth = 300;
let isInitial = true;

export default function FeedPage() {
  const dispatch = useDispatch<AppDispatch>();
  const feed = useSelector((state: RootState) => state.feed);
  const feeds = useAppSelector((state) => state.feed.feedData);
  const newest = useAppSelector((state) => state.feed.newest);
  const isLoggedIn = useAppSelector((state) => state.user.userData.isLoggedIn);
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log("하...........", feeds);

  //   console.log("첫글", newest);
  //   if (isInitial) {
  //     isInitial = false;
  //     // console.log("하...........", feeds);
  //     // dispatch(getFeedsAction({ size: 5, page: 0 }));

  //     return;
  //   }
  // }, [feeds, dispatch]);

  // 모달 조작
  const [openEditorModal, setOpenEditorModal] = useState<boolean>(false);
  const onClickEditor = () => {
    if (isLoggedIn) setOpenEditorModal((prev) => !prev);
  };

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     alert("로그인 되지 않은 사용자입니다. 메인페이지로 돌아갑니다.");
  //     navigate("/main");
  //   }
  //   // dispatch(getFeedsAction({ size: 5, page: 0 })).then(() => {
  //   //   console.log("feeds!!!!!!!!!!!!!!", feeds);
  //   // });
  //   if (isInitial) {
  //     isInitial = false;
  //   }
  // }, []);

  return (
    <Box sx={{ display: "flex" }}>
      {/* 메인 페이지 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)`, md: "100%" },
        }}
      >
        {isLoggedIn && (
          <Button
            onClick={onClickEditor}
            variant="outlined"
            startIcon={<CreateIcon />}
            sx={{ marginLeft: "40px" }}
          >
            새 피드
          </Button>
        )}

        <br />
        <br />
        <InfiniteScroll feedPage={true} actionFunc={getFeedsAction} />
        {openEditorModal && (
          <EditorModal
            open={openEditorModal}
            setOpen={setOpenEditorModal}
            feed={{ title: "", content: "", feedId: null }}
            isEdit={false}
          />
        )}
      </Box>

      {/* 우측 컴포넌트 */}
      <RightVideoSection drawerWidth={drawerWidth} />
    </Box>
  );
}
