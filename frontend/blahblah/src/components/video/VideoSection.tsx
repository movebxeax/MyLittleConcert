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
import { VideoDetailType } from "../../model/video/VideoDetailType";
import { RootState } from "../../redux/configStore";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { getVideoById } from "../../redux/modules/video";
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

const VideoSection: React.FC<{ videoId: number }> = (props) => {
  const video = useSelector((state: RootState) => state.video);
  const dispatch = useDispatch<AppDispatch>();

  const [expanded, setExpanded] = React.useState(false);
  const currentVideo = video.currentVideo;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ width: "100%" }}>
      <CardMedia
        component="img"
        // height=""
        image="https://i.ytimg.com/vi/JtFI8dtPvxI/maxresdefault.jpg"
        alt="Paella dish"
      />

      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ mr: 1 }}>
            {currentVideo.title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* 해시태그 표시 */}
            {JSON.parse(currentVideo.hashtags).map((data: any, index: any) => {
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
            })}
          </Box>
          <Typography
            variant="caption"
            sx={{ fontSize: "sm", fontWeight: "sm", ml: 1 }}
          >
            {currentVideo?.createDate}
          </Typography>

          {/* 좋아요 표시 */}
          <IconButton aria-label="add to favorites" sx={{ ml: "auto" }}>
            <FavoriteIcon />
          </IconButton>
          <Typography variant="body2">{currentVideo.likeCnt}</Typography>

          {/* 조회수 표시 */}
          <IconButton aria-label="add to favorites" sx={{ ml: 1 }}>
            <VisibilityIcon />
          </IconButton>
          <Typography variant="body2">{currentVideo.views}</Typography>
        </Box>

        {/* =================== */}

        <Box sx={{ display: "flex", gap: 1, mt: 1.5, alignItems: "center" }}>
          {/* 아바타 */}

          <FeedProfileImage avatar={currentVideo?.avatar} />

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
              sx={{ fontSize: "sm", fontWeight: "lg" }}
            >
              {currentVideo.nickName}
            </Typography>

            {/* 팔로우 버튼 */}
            <Button sx={{ ml: 2 }} variant="outlined" size="small">
              Follow
            </Button>
            <IconButton aria-label="share" sx={{ ml: "auto" }}>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>
        {/* ============= */}
      </CardContent>
      <CardActions disableSpacing>
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
            comments={currentVideo.comments}
            videoId={currentVideo.id}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default VideoSection;
