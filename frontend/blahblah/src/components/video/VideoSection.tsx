import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentSection from "../feed/CommentSection";
import video from "../../redux/modules/video";
import ProfileImage from "../common/ProfileImage";
import FeedProfileImage from "../feed/FeedProfileImage";
import { Box } from "@mui/system";
import { AppDispatch } from "../../redux/configStore";
import { Button } from "@mui/material";
import { RootState } from "../../redux/configStore";
import { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector, useDispatch } from "react-redux";
import { getVideoById } from "../../redux/modules/video";
import { VideoDetailType } from "../../model/video/VideoDetailType";
import { likeVideoAction } from "../../redux/modules/video";
import { likeVideoCancelAction } from "../../redux/modules/video";
import { useAppSelector } from "../../redux/configStore.hooks";
import ButtonComp from "../common/ButtonComp";
import { PersonAddRounded } from "@mui/icons-material";
import { HowToRegRounded } from "@mui/icons-material";
import { subscribeAction } from "../../redux/modules/profile";
import { unSubscribeAction } from "../../redux/modules/profile";
import VideoPlayer from "./VideoPlayer";
import VideoAvatarSection from "./VideoAvatarSection";
import VideoBox from "./VideoBox";
import FeedSettingButton from "../feed/FeedSettingButton";
import FeedRemoveDialog from "../feed/FeedRemoveDialog";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const VideoSection: React.FC<{ video: VideoDetailType }> = (props) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // 비디오 좋아요
  const dispatch = useDispatch<AppDispatch>();
  const likeFeedHandler = () => {
    const videoId = props.video.id;
    dispatch(likeVideoAction(videoId));
  };
  const likeCancelHandler = () => {
    const videoId = props.video.id;
    dispatch(likeVideoCancelAction(videoId));
  };

  // 구독
  const isSubscribing = useAppSelector((state) => state.profile.isSubscribing);
  const userPK = useAppSelector((state) => state.user.userData.id);
  const isLoggedIn = useAppSelector((state) => state.user.userData.isLoggedIn);

  let isMine;
  if (props.video.userPK === userPK) {
    isMine = true;
  } else {
    isMine = false;
  }

  const onClickSubscribe = () => {
    if (!isSubscribing) {
      dispatch(subscribeAction(String(props.video.userPK))); // 확인필요
      // console.log("구독!!");
    } else {
      dispatch(unSubscribeAction(String(props.video.userPK)));
      // console.log("구독 취소!");
    }
  };

  // 삭제 다이얼로그 조작
  const [openRemoveDialog, setopenRemoveDialog] = useState<boolean>(false);
  const handleClickOpen = () => {
    setopenRemoveDialog(true);
  };
  const handleCloseDialog = () => {
    setopenRemoveDialog(false);
  };

  // 날짜 조작
  let dateList = props.video.createDate.slice(0, 6);
  dateList[1]--;
  // console.log(dateList);
  const utcDate = new Date(
    ...(dateList as [number, number, number, number, number, number])
  );

  const utc = utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000;
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000 * 2;
  const kr_curr = new Date(utc + KR_TIME_DIFF);
  const koreaDate = kr_curr.toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });

  return (
    <Card sx={{ width: "100%" }}>
      <VideoBox
        emotionLog={props.video.emotionLog}
        pathUrl={props.video.pathUrl}
      />

      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ mr: 1 }}>
              {props.video?.title}
            </Typography>
            <Box
              sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
            >
              {/* 해시태그 표시 */}
              {props.video?.hashtags &&
                JSON.parse(props.video.hashtags).map(
                  (data: any, index: any) => {
                    return (
                      <Box
                        sx={{
                          backgroundColor: "#dddddd",
                          // color: "white",
                          fontSize: 9,
                          borderRadius: 13,
                          px: 0.5,
                          mr: 1,
                          height: 15,
                        }}
                        key={index}
                      >
                        {data.label}
                      </Box>
                    );
                  }
                )}
            </Box>
            <Typography
              variant="caption"
              sx={{ fontSize: "sm", fontWeight: "sm", ml: 1 }}
            >
              {koreaDate}
            </Typography>
          </Box>

          {/* 좋아요 표시 */}
          <IconButton aria-label="add to favorites">
            {props.video.like ? (
              <FavoriteIcon color="error" onClick={likeCancelHandler} />
            ) : (
              <FavoriteIcon onClick={likeFeedHandler} />
            )}
          </IconButton>
          <Typography variant="body2">{props.video?.likeCnt}</Typography>

          {/* 조회수 표시 */}
          <IconButton aria-label="add to favorites" sx={{ ml: 1 }}>
            <VisibilityIcon />
          </IconButton>
          <Typography variant="body2" sx={{ mr: "auto" }}>
            {props.video?.views}
          </Typography>

          {/* 설정 버튼 */}
          <FeedSettingButton
            // onClickEditor={onClickEditor}
            handleClickOpen={handleClickOpen}
          />
        </Box>

        {/* =================== */}

        <Box sx={{ display: "flex", gap: 1, mt: 1.5, alignItems: "center" }}>
          {/* 아바타 */}

          <FeedProfileImage
            avatar={props.video.avatar}
            userPK={props.video.userPK}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* 유저 닉네임 */}
            <Typography
              variant="body1"
              sx={{ fontSize: "sm", fontWeight: "lg", mr: 2 }}
            >
              {props.video?.nickName}
            </Typography>

            {/* 팔로우 버튼 */}

            {isMine ? (
              <></>
            ) : isLoggedIn ? (
              isSubscribing ? (
                <ButtonComp
                  onClick={onClickSubscribe}
                  text="FOLLOW"
                  width={115}
                  height={39}
                  active={true}
                >
                  <HowToRegRounded />
                </ButtonComp>
              ) : (
                <ButtonComp
                  onClick={onClickSubscribe}
                  text="FOLLOW"
                  width={115}
                  height={39}
                >
                  <PersonAddRounded />
                </ButtonComp>
              )
            ) : (
              <></>
            )}
            {/* ============ */}
            <IconButton aria-label="share" sx={{ ml: "auto" }}>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
        {/* ============= */}
      </CardContent>
      <CardActions disableSpacing>
        <Typography sx={{ ml: 1 }}>
          덧글 {props.video.comments.length}개
        </Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <CommentSection
            comments={props.video?.comments}
            videoId={props.video?.id}
          />
        </CardContent>
      </Collapse>
      <FeedRemoveDialog
        open={openRemoveDialog}
        handleClose={handleCloseDialog}
        video={props.video}
      />
    </Card>
  );
};

export default VideoSection;
