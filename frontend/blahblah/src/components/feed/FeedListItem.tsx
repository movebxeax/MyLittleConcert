import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { getFeedFileAction } from "../../redux/modules/feed/feed-action";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Divider from "@mui/material/Divider";
import FeedProfileImage from "./FeedProfileImage";
import CommentSection from "./CommentSection";
import parse from "html-react-parser";
import FeedSettingButton from "./FeedSettingButton";
import EditorModal from "./EditorModal";
import FeedRemoveDialog from "./FeedRemoveDialog";
import { useEffect, useState } from "react";
import { FeedType } from "../../model/feed/feedType";
import { AppDispatch } from "../../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/configStore";
import { likeFeedAction } from "../../redux/modules/feed";
import { likeCancelAction } from "../../redux/modules/feed";
import { useAppDispatch, useAppSelector } from "../../redux/configStore.hooks";
import { url } from "inspector";

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

const FeedListItem: React.FC<{ feed: any }> = (props) => {
  const loggedUserId = useAppSelector((state) => state.user.userData.userId);
  const [expanded, setExpanded] = React.useState(false);
  const [image, setImage] = React.useState<string>();
  const getFeedFile = useAppSelector((state) => state.feed.getFeedFile);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (props.feed.filePath) {
  // console.log("props.feed.filePath!!!!", props.feed.filePath);
      dispatch(getFeedFileAction(props.feed.filePath)).then(({ data }: any) => {
        // setImage(data);
  // console.log("data!!!!", data);
  // console.log("redux", getFeedFile.data);
        const file = new File([getFeedFile.data], props.feed.filePath);
        const reader = new FileReader();
        reader.onload = (event) => {
          const previewImage = String(event.target?.result);
          setImage(previewImage);
        };
        reader.readAsDataURL(file);
  // console.log(image);
      });
    }
  }, []);

  // 수정 모달 조작
  const [openEditorModal, setOpenEditorModal] = useState<boolean>(false);
  const onClickEditor = () => {
    setOpenEditorModal((prev) => !prev);
  };

  // 삭제 다이얼로그 조작
  const [openRemoveDialog, setopenRemoveDialog] = useState<boolean>(false);
  const handleClickOpen = () => {
    setopenRemoveDialog(true);
  };
  const handleCloseDialog = () => {
    setopenRemoveDialog(false);
  };

  // 피드 좋아요
  const [heartColor, setHeartColor] = useState<any>(false);
  const [likeCnt, setLikeCnt] = useState<number>(props.feed.likeCnt);
  useEffect(() => {
    if (props.feed.like) {
      setHeartColor(true);
    }
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const likeFeedHandler = () => {
    if (!heartColor) {
      setLikeCnt(likeCnt + 1);
    } else {
      setLikeCnt(likeCnt - 1);
    }
    const articleId = props.feed.id;
    dispatch(likeFeedAction(articleId));
    setHeartColor(!heartColor);
    // console.log(heartColor);
  };
  const likeCancelHandler = () => {
    if (!heartColor) {
      setLikeCnt(likeCnt + 1);
    } else {
      setLikeCnt(likeCnt - 1);
    }
    const articleId = props.feed.id;
    dispatch(likeCancelAction(articleId));
    setHeartColor(!heartColor);
    // console.log(heartColor);
  };

  // 날짜 조작
  let dateList = props.feed.createDate.slice(0, 6);
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
    <div>
      <Card sx={{ width: "100%" }}>
        <CardHeader
          avatar={
            <FeedProfileImage
              avatar={props.feed.avatar}
              userPK={props.feed.userPK}
            />
          }
          action={
            props.feed.userId === loggedUserId && (
              <FeedSettingButton
                onClickEditor={onClickEditor}
                handleClickOpen={handleClickOpen}
              />
            )
          }
          title={props.feed.nickName}
          subheader={String(koreaDate)}
        />

        <CardContent>
          <Typography variant="h5">{props.feed.title}</Typography>
          {props.feed.filePath && <div>{props.feed.filePath}</div> && (
            <img src={image} alt="" style={{ width: "250px" }} />
          )}
          <div>{parse(props.feed.content)}</div>
        </CardContent>
        <CardActions disableSpacing>
          {/* 좋아요  */}

          <IconButton aria-label="add to favorites">
            {props.feed.like ? (
              <FavoriteIcon
                color={heartColor ? "error" : "inherit"}
                onClick={likeCancelHandler}
              />
            ) : (
              <FavoriteIcon
                color={heartColor ? "error" : "inherit"}
                onClick={likeFeedHandler}
              />
            )}
          </IconButton>
          <Typography variant="subtitle2" color={"grey"}>
            {likeCnt}
          </Typography>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <Typography sx={{ ml: "auto" }}>
            덧글 {props.feed.commentList.content.length}개
          </Typography>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{ ml: 0 }}
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <CommentSection
              comments={props.feed.commentList.content}
              articleId={props.feed.id}
            />
          </CardContent>
        </Collapse>
      </Card>
      <br />
      <br />

      {openEditorModal && (
        <EditorModal
          open={openEditorModal}
          setOpen={setOpenEditorModal}
          feed={props.feed}
          isEdit={true}
        />
      )}

      <FeedRemoveDialog
        open={openRemoveDialog}
        handleClose={handleCloseDialog}
        feed={props.feed}
      />
    </div>
  );
};

export default FeedListItem;
