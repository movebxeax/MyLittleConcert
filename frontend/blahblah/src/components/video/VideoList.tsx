import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import VideoCard from "./VideoCard";

const SAMPLE_VIDEO = [
  {
    id: 1,
    userPK: 33,
    userId: "seoda0000",
    nickName: "seoda0000",
    avatar: null,
    title: "동영상제목",
    views: 0,
    pathUrl: "동영상경로여",
    createDate: "2023-02-06T16:58:06.093775",
    hashtags: "해시태그다잉",
    comments: {
      content: [],
    },
  },
  {
    id: 2,
    userPK: 23,
    userId: "ssafy12",
    nickName: "ssafy12",
    avatar: null,
    title: "동영상제목",
    views: 0,
    pathUrl: "동영상경로여",
    createDate: "2023-02-06T16:58:06.093775",
    hashtags: "해시태그다잉",
    comments: {
      content: [],
    },
  },
  {
    id: 3,
    userPK: 13,
    userId: "abcde",
    nickName: "abcde",
    avatar: null,
    title: "동영상제목",
    views: 0,
    pathUrl: "동영상경로여",
    createDate: "2023-02-06T16:58:06.093775",
    hashtags: "해시태그다잉",
    comments: {
      content: [],
    },
  },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function VideoList() {
  return (
    <Grid
      container
      columnSpacing={{ xs: 2, md: 5 }}
      rowSpacing={{ xs: 2, md: 5 }}
    >
      {Array.from(Array(6)).map((_, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={index}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <VideoCard nth={index} />
        </Grid>
      ))}
    </Grid>
  );
}
