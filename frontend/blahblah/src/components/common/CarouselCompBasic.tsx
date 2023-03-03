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
import React from "react";
import CarouselChips from "../broadcast/CarouselChips";
import ProfileImage from "./ProfileImage";

const CardWrapper = styled(Card)<{ nth: number }>`
  width: 100%;
  padding: 0;
  & div.float-wrapper {
    & > div {
      position: absolute;
      left: 3px;
      top: 3px;

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
              background: #54d7c7;
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

type CardCompPropsType = {
  children: React.ReactNode;
  nth: number;
  // title?: string;
  // caption?: boolean;
  // nickname?: string;
  // userAvatar?: string;
  // hashTag?: string;
  // startAt?: string;
};

export default function CarouselCompBasic({
  children,
  nth,
}: // title,
// caption,
// nickname,
// userAvatar,
// hashTag,
// startAt,
CardCompPropsType): JSX.Element {
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
            // background:
            // "linear-gradient(180deg, transparent 62%, rgba(0,0,0,0.00345888) 63.94%, rgba(0,0,0,0.014204) 65.89%, rgba(0,0,0,0.0326639) 67.83%, rgba(0,0,0,0.0589645) 69.78%, rgba(0,0,0,0.0927099) 71.72%, rgba(0,0,0,0.132754) 73.67%, rgba(0,0,0,0.177076) 75.61%, rgba(0,0,0,0.222924) 77.56%, rgba(0,0,0,0.267246) 79.5%, rgba(0,0,0,0.30729) 81.44%, rgba(0,0,0,0.341035) 83.39%, rgba(0,0,0,0.367336) 85.33%, rgba(0,0,0,0.385796) 87.28%, rgba(0,0,0,0.396541) 89.22%, rgba(0,0,0,0.4) 91.17%)",
          }}
        >
          {/* The first box acts as a container that inherits style from the CardCover */}
          <Box>
            <Box
              sx={{
                p: 2,
                display: "flex",
                gap: 1.5,
                flexGrow: 1,
                alignSelf: "flex-end",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  justifyItems: "center",
                  display: "flex",
                }}
              >
                {/* <ProfileImage userAvatar={userAvatar} /> */}
                <Typography
                  level="h3"
                  noWrap
                  sx={{ fontSize: "sm", color: "#fff", marginLeft: "5px" }}
                >
                  {/* "닉네임" */}
                </Typography>
                <Typography
                  level="h3"
                  noWrap
                  sx={{ fontSize: "sm", color: "#fff", marginLeft: "5px" }}
                >
                  {/* "날짜" */}
                </Typography>
              </Box>
              <Box
                sx={{
                  alignItems: "center",
                  justifyItems: "center",
                  display: "flex",
                }}
              >
                <Typography
                  level="h1"
                  noWrap
                  sx={{ fontSize: "lg", mr: 1 }}
                ></Typography>

                {/* <CarouselChips chipData={JSON.parse(hashTag as string)} /> */}
              </Box>
            </Box>
          </Box>
        </CardCover>
      </Box>
    </CardWrapper>
  );
}
