import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Favorite, Visibility } from "@mui/icons-material";
import {
  AspectRatio,
  Avatar,
  Box,
  Card,
  CardCover,
  Chip,
  Link,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileVideoType } from "../../model/profile/profileVideoType";
import { VideoType } from "../../model/video/VideoType";
import FeedProfileImage from "../feed/FeedProfileImage";
import { AppDispatch } from "../../redux/configStore";
import { useDispatch } from "react-redux";
import { getVideoById } from "../../redux/modules/video";
import { useAppSelector } from "../../redux/configStore.hooks";
const CardWrapper = styled(Card)<{ nth: number }>`
  width: 100%;
  padding: 0;
  & div.float-wrapper {
    & > div {
      position: absolute;
      left: 3px;
      top: 3px;
      border-radius: 13px;
      border: 1.5px solid black;
      width: calc(100% - 8px) !important;
      height: calc(100% - 8px) !important;
      transition: ease-in-out 0.2s;
      overflow: hidden;
      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    &:after {
      content: "";
      display: block;
      width: calc(100% - 8px);
      height: calc(100% - 8px);
      border-radius: 13px;
      border: 1.5px solid black;
      position: absolute;
      z-index: -1;
      right: 0;
      bottom: 0;
      ${({ nth }) =>
        nth
          ? nth % 4 === 0
            ? css`
                background: #54d7c7;
              `
            : nth % 4 === 1
            ? css`
                background: #f3b63a;
              `
            : nth % 4 === 2
            ? css`
                background: #f55d81;
              `
            : css`
                background: #6dbb58;
              `
          : css`
              background: #6dbb58;
            `};
    }
  }
  &:hover {
    & div.float-wrapper {
      & > div {
        left: 0;
        top: 0;
      }
    }
  }
`;

type HashTagJSONType = {
  key: number;
  label: string;
  selected: boolean;
};

type CardCompPropsType = {
  children: React.ReactNode;
  nth: number;
  title?: string;
  caption?: boolean;
  video?: ProfileVideoType | VideoType;
  setOpenLoginAlert?: any;
};

export default function CardComp({
  children,
  nth = 0,
  title,
  caption,
  video,
  setOpenLoginAlert,
}: CardCompPropsType): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [hashtags, setHashtags] = useState<HashTagJSONType[]>();
  const isLoggedIn = useAppSelector((state) => state.user.userData.isLoggedIn);

  function onClickHandler() {
    if (isLoggedIn) {
      dispatch(getVideoById(video!.id)).then(() => {
        navigate(`/video/${video?.id}`);
      });
    } else {
      setOpenLoginAlert(true);
    }
  }

  useEffect(() => {
    if (video) {
      setHashtags(JSON.parse(video.hashtags));
    }
  }, [video]);
  return (
    <CardWrapper nth={nth}>
      <Box sx={{ position: "relative" }}>
        <AspectRatio ratio="9/5">
          <div className="float-wrapper">
            <div>{children}</div>
          </div>
        </AspectRatio>

        {/* 호버했을 때 표지에 보이는 요소 */}
        <CardCover
          className="gradient-cover ho"
          sx={{
            "&:hover, &:focus-within": {
              opacity: 1,
              left: 0,
              top: 0,
            },
            opacity: 0,
            transition: "0.1s ease-in",
            width: "calc(100% - 8px)",
            height: "calc(100% - 8px)",
            left: "3px",
            top: "3px",
            background:
              "linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)",
          }}
        >
          {/* The first box acts as a container that inherits style from the CardCover */}
          <Box>
            <Box
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexGrow: 1,
                alignSelf: "flex-end",
              }}
              onClick={onClickHandler}
            >
              <Typography level="h2" noWrap sx={{ fontSize: "lg" }}>
                <Link
                  // href={video?.pathUrl}
                  overlay
                  underline="none"
                  sx={{
                    color: "#fff",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  {title}
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardCover>
      </Box>
      {caption && (
        <Box
          sx={{ display: "flex", gap: 1, mt: 1.5, alignItems: "flex-start" }}
        >
          {/* 아바타 */}
          {video?.avatar ? (
            <FeedProfileImage avatar={video.avatar} userPK={video.userPK} />
          ) : (
            <div>아바타 없다</div>
          )}

          {/* <Avatar
            src="https://image.news1.kr/system/photos/2022/8/2/5508700/article.jpg/dims/optimize"
            size="sm"
            sx={{ "--Avatar-size": "2rem" }}
          /> */}
          <Box
            sx={{
              display: "flex",
              // gap: 1,
              mt: 1.5,
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}
            >
              {/* 유저 닉네임 */}
              <Typography sx={{ fontSize: "sm", fontWeight: "lg" }}>
                {video?.nickName}
              </Typography>

              {/* 좋아요 표시 */}
              {/* <Link
              level="body3"
              underline="none"
              startDecorator={<Favorite sx={{ width: 20 }} />}
              color="neutral"
              sx={{
                fontSize: "sm",
                fontWeight: "md",
                ml: "auto",
                "&:hover": { color: "danger.plainColor" },
              }}
              >
              {video?.likeCnt}
            </Link> */}

              {/* 조회수 표시 */}
              <Link
                level="body3"
                underline="none"
                startDecorator={<Visibility sx={{ width: 16 }} />}
                color="neutral"
                sx={{
                  fontSize: "sm",
                  fontWeight: "md",
                  ml: 2,
                  "&:hover": { color: "primary.plainColor" },
                }}
              >
                {video?.views}
              </Link>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {/* 해시태그 표시 */}
              {video &&
                hashtags &&
                hashtags.map((hashtag: HashTagJSONType, index: number) => {
                  return (
                    <Box
                      sx={{
                        backgroundColor: "#dddddd",
                        // color: "white",
                        fontSize: 9,
                        borderRadius: 13,
                        px: 0.5,
                        mr: 1,
                      }}
                    >
                      {hashtag.label}
                    </Box>
                  );
                })}
            </Box>
          </Box>
        </Box>
      )}
    </CardWrapper>
  );
}
