import { useParams } from "react-router-dom";
import VideoSection from "../components/video/VideoSection";
import RightVideoSection from "../components/video/RightVideoSection";
import { Box } from "@mui/system";
import { RootState } from "../redux/configStore";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { AppDispatch } from "../redux/configStore";
import { getVideoById } from "../redux/modules/video";

const drawerWidth = 300;
let isInitial = true;

export default function VideoPage() {
  const { videoId } = useParams();
  const video = useSelector((state: RootState) => state.video);
  const dispatch = useDispatch<AppDispatch>();
  let currentVideo = video.currentVideo;
  useEffect(() => {
    if (isInitial) {
      dispatch(getVideoById(Number(videoId))).then(() => {
        currentVideo = video.currentVideo;
      });
      isInitial = false;

      return;
    }
  }, [video, dispatch]);

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <VideoSection video={currentVideo} />
      </Box>
      <RightVideoSection drawerWidth={drawerWidth} />
    </Box>
  );
}
