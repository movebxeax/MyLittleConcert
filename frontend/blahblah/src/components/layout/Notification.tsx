import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box/Box";
import Popover from "@mui/material/Popover/Popover";
import List from "@mui/material/List/List";
import ListItem from "@mui/material/ListItem/ListItem";
import Avatar from "@mui/material/Avatar/Avatar";
import Badge from "@mui/material/Badge/Badge";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { UserType } from "../../model/user/userType";
import { axiosInitializer } from "../../redux/utils/axiosInitializer";
import { getAccessToken } from "../../redux/modules/user/token";
import { createAvatar } from "@dicebear/core";
import { personas } from "@dicebear/collection";

interface iUserData {
  userData: UserType;
}

interface iNotification {
  msgId: number;
  timestamp: number;
  msg: string;
  read: boolean;
  avatar: string;
}

function Notification(userData: iUserData) {
  //alarm
  const [anchorAl, setAnchorAl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClickAlarm = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorAl(event.currentTarget);
  };

  const handleCloseAlarm = () => {
    setAnchorAl(null);
  };

  const onClickHandler = (e: React.MouseEvent) => {
    e.preventDefault();
    const eventTarget = e.target as HTMLElement;
    // console.log(eventTarget.parentElement);
  };

  const tempAvatar = JSON.stringify({
    body: ["rounded"],
    clothingColor: ["54d7c7"],
    eyes: ["happy"],
    facialHair: [""],
    facialHairProbability: 100,
    hair: ["curlyHighTop"],
    hairColor: ["6c4545"],
    mouth: ["bigSmile"],
    nose: ["smallRound"],
    skinColor: ["d78774"],
  });

  function avatarStringToUri(avatarStr : string | null) {
    return createAvatar(personas, {
    ...JSON.parse(avatarStr ? avatarStr : tempAvatar),
    backgroundColor: ["ffffff"],
  }).toDataUriSync()
}

  const [notifications, setNotifications] = useState<iNotification[]>();

  const openAlarm = Boolean(anchorAl);
  const idAl = openAlarm ? "simple-popover" : undefined;

  async function fetchNotifications() {
    const axios = axiosInitializer();

    await axios
      .get("/api/notifications", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Baerer " + getAccessToken(),
        },
      })
      .then((data) => setNotifications(data.data));
  }

  async function removeNotification(msgId: number) {
    const axios = axiosInitializer();

    await axios
      .delete(`/api/notifications/${msgId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Baerer " + getAccessToken(),
        },
      })
      .then(() =>
        setNotifications(notifications?.filter((item) => item.msgId !== msgId))
      )
      .catch();
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div>
      {/* 알림 아이콘 */}
      <IconButton
        className="badge-alert"
        size="large"
        aria-label="show 17 new notifications"
        color="inherit"
        onClick={handleClickAlarm}
        aria-describedby={idAl}
      >
        <Badge badgeContent={notifications?.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* 알림창 팝오버 */}

      <Popover
        id={idAl}
        open={openAlarm}
        anchorEl={anchorAl}
        onClose={handleCloseAlarm}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ m: 3 }}>
          <h4 style={{ fontFamily: "NanumSquareRound" }}>
            {notifications?.length}개의 방송 알림이 있습니다.
          </h4>
          <Divider />

          <List dense={true}>
            {notifications?.map((notification) => {
  // console.log(notification.avatar);
  // console.log(avatarStringToUri(notification.avatar))
              return (
                <ListItem>
                  {<Avatar alt="Sample" src={avatarStringToUri(notification.avatar)}/>}
                         {/* sx={{ width: props.small ? 30 : 40, height: props.small ? 30 : 40 }} */}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "NanumSquareRound",
                        fontSize: 14,
                        margin: 0,
                      }}
                    >
                      {notification.msg}
                    </p>
                    <p
                      style={{
                        fontFamily: "NanumSquareRound",
                        margin: 0,
                        fontSize: 5,
                        color: "grey",
                      }}
                    >
                      {new Date(notification.timestamp).toDateString()}
                    </p>
                  </div>
                  <CloseIcon
                    fontSize="small"
                    sx={{
                      width: 12,
                      height: 12,
                      alignSelf: "flex-start",
                      justifySelf: "flex-start",
                      mt: 0.4,
                      ml: 2,
                    }}
                    onClick={() => {
                      removeNotification(notification.msgId);
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Popover>
    </div>
  );
}

export default Notification;
