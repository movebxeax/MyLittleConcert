import { Avatar, css, Typography } from "@mui/material";
import { createAvatar } from "@dicebear/core";
import React, { useEffect, useState } from "react";
import { personas } from "@dicebear/collection";
import { useAppDispatch, useAppSelector } from "../../redux/configStore.hooks";
import styled from "@emotion/styled";
import { SubscriberType } from "../../model/subscribe/subscriberType";
import { useNavigate } from "react-router-dom";
import { PlayArrowRounded } from "@mui/icons-material";
import OnAirBadge from "../common/OnAirBadge";
import { getIsOnAirAction } from "../../redux/modules/user";
import { getAboutMeAction } from "../../redux/modules/profile";
import { getVideoAction } from "../../redux/modules/profile";
import { getFeedAction } from "../../redux/modules/profile";
import { SessionType } from "../../model/broadcast/sessionType";

const ItemContainer = styled.li<{ open: boolean }>`
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > div {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    & > span {
      font-size: 17px;
    }
  }
  & > span {
    padding: 1px 4px 1px 0px;
    border: 1.5px solid #e24553;
    border-radius: 5px;
    color: #e24553;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > svg {
      font-size: 1rem;
    }
    & > span {
      font-size: 11px;
    }
  }
  &:hover {
    cursor: pointer;
  }
  ${({ open }) =>
    !open &&
    css`
      & {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `}
`;

export default function SubscriberItem({
  item,
  open,
}: {
  item: SubscriberType;
  open: boolean;
}): JSX.Element {
  const getIsOnAir = useAppSelector((state) => state.user.getIsOnAir);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const [isOnAir, setIsOnAir] = useState<boolean>(false);
  const [sessionInfo, setSessionInfo] = useState<SessionType>();

  const dataUri = createAvatar(personas, {
    ...JSON.parse(item.avatar),
    backgroundColor: ["ffdfbf"],
  }).toDataUriSync();

  const onClickItem = () => {
    dispatch(getAboutMeAction(String(item.userPK))).then(() => {
      navigator(`/profile/${item.userPK}`);
    });
  };

  // console.log("item.isOnAir", item.isOnAir);

  useEffect(() => {
    dispatch(getIsOnAirAction(item.userId));
  }, []);
  return (
    <ItemContainer open={open}>
      <div onClick={onClickItem}>
        <Avatar
          src={dataUri}
          alt="profile_img"
          sx={{
            width: `${open ? "45px" : "20px"}`,
            height: `${open ? "45px" : "20px"}`,
            border: `1.5px solid ${item.isOnAir ? "#e24553" : "black"}`,
          }}
        />
        {open && <Typography>{item.nickName} </Typography>}
        {/* <span>{item.nickName}</span> */}
      </div>
      {open && item.isOnAir && <OnAirBadge sessionInfo={item.isOnAir} />}
    </ItemContainer>
  );
}

