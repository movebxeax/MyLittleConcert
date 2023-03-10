import React, { useEffect, useState } from "react";
import {
  styled,
  useTheme,
  Theme,
  CSSObject,
  css,
  keyframes,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import List from "@mui/material/List";
// import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import FeedIcon from "@mui/icons-material/Feed";
import { ReactNode } from "react";
import Menu from "@mui/material/Menu";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useNavigate } from "react-router-dom";
import AvatarShortcutButton from "./AvatarShortcutButton";
// import ProfileAvatar from "../auth/ProfileAvatar";
import { getAccessToken, removeToken } from "../../redux/modules/user/token";
import { useAppDispatch, useAppSelector } from "../../redux/configStore.hooks";
import {
  getMeWithTokenAction,
  getSubscribersAction,
} from "../../redux/modules/user";
import SigninModal from "../auth/SigninModal";
import SignupModal from "../auth/SignupModal";
import ProfileImage from "../common/ProfileImage";
import { auto } from "@popperjs/core";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { BoldKoreanFont } from "../../theme/font";
import { ThemeProvider } from "@mui/material/styles";
import SubscriberItem from "../auth/SubscriberItem";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import FaceIcon from "@mui/icons-material/Face";
import BroadcastModal from "../broadcast/BroadcastModal";
import CloseIcon from "@mui/icons-material/Close";
import VideoRoomComponent from "../openvidu/VideoRoomComponent";
import { RootState } from "../../redux/configStore";
import { useSelector } from "react-redux";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountModal from "../auth/AccountModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import SendIcon from "@mui/icons-material/Send";
import { Face6Rounded, Favorite, PersonRounded } from "@mui/icons-material";
import Popover from "@mui/material/Popover";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import { LightKoreanFont } from "../../theme/font";
import Notification from "./Notification";
import { getAboutMeAction } from "../../redux/modules/profile";
import BubbleNickName from "../../assets/chat_icon/chat_2.png";
import BubbleAlert from "../../assets/chat_icon/chat_3.png";
import BubbleId from "../../assets/chat_icon/chat_4.png";
import BubbleSubscribers from "../../assets/chat_icon/chat_1.png";

const AlertKeyFrame = keyframes`
  0% {
    opacity: 0;
    z-index: -1;
  }
  40% {
    opacity:0;
  }
  100% {
    top: 50%;
    left: 50%;
    transform: translate(35px, -64px);
    opacity: 1;
    z-index: 2;
  }
`;

const NickNameKeyFrame = keyframes`
  0% {
    opacity: 0;
    z-index: -1;
  }
  40% {
    opacity:0;
  }
  100% {
    top: 50%;
    left: 50%;
    transform: translate(-114px, -107px);
    opacity: 1;
    z-index: 1;
  }
`;

const IdKeyFrame = keyframes`
  0% {
    opacity: 0;
    z-index: -1;
  }
  40% {
    opacity:0;
  }
  100% {
    top: 50%;
    left: 50%;
    transform: translate(-5px, -115px);
    opacity: 1;
    z-index: 1;
  }
`;

const SubscribersKeyFrame = keyframes`
  0% {
    opacity: 0;
    z-index: -1;
  }
  40% {
    opacity:0;
  }
  100% {
    top: 50%;
    left: 50%;
    transform: translate(-103px, 12px);
    opacity: 1;
    z-index: 1;
  }
`;

const LayoutContainer = styled(Box)<{ open: boolean }>`
  ${({ open }) =>
    open &&
    css`
      .badge-wrapper {
        position: relative;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        .badge-inner {
          position: absolute;
          .badge-alert {
            position: absolute;
            /* top: 50%;
            left: 50%; */
            /* transform: translate(10px, -84px); */
            width: 51px;
            height: 57px;
            border-radius: 0;
            padding: 0;
            background-image: url(${BubbleAlert});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            animation: ${AlertKeyFrame} 0.7s ease-out forwards;
            animation-delay: 0.5s;
            opacity: 0;
          }
          .badge-setting {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(25px, 25px);
          }
          .badge-subscribers {
            position: absolute;
            height: 65px;
            padding: 13px 10px 0px 10px;
            background-image: url(${BubbleSubscribers});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            animation: ${SubscribersKeyFrame} 0.7s ease-out forwards;
            animation-delay: 0.5s;
            opacity: 0;
          }
          .badge-userid {
            position: absolute;
            /* width: 75px; */
            height: 90px;
            padding: 28px 15px 0px 15px;
            background-image: url(${BubbleId});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            animation: ${IdKeyFrame} 0.7s ease-out forwards;
            animation-delay: 0.5s;
            opacity: 0;
            & > span {
              display: inline-block;
              font-size: 14px;
              color: #3f3f3f;
            }
          }
          .badge-login {
            position: absolute;
            /* width: 75px; */
            height: 90px;
            margin-top: 20px;
            padding: 28px 15px 0px 15px;
            background-image: url(${BubbleId});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            animation: ${IdKeyFrame} 0.7s ease-out forwards;
            animation-delay: 0.5s;
            opacity: 0;
            & > span {
              display: inline-block;
              font-size: 14px;
              color: #3f3f3f;
            }
          }
          .badge-nickname {
            position: absolute;
            height: 65px;
            margin-top: -8px;
            padding: 16px 15px 0px 15px;
            background-image: url(${BubbleNickName});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            animation: ${NickNameKeyFrame} 0.7s ease-out forwards;
            animation-delay: 0.5s;
            opacity: 0;
            & > span {
              display: inline-block;
              font-size: 16px;
            }
          }
          .badge-signup {
            position: absolute;
            height: 65px;
            padding: 16px 15px 0px 15px;
            background-image: url(${BubbleNickName});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            animation: ${NickNameKeyFrame} 0.7s ease-out forwards;
            animation-delay: 0.5s;
            opacity: 0;
            & > span {
              display: inline-block;
              font-size: 16px;
            }
          }
        }
      }
    `};
`;

interface LayoutProps {
  children: ReactNode;
}

const menuWithLogin = ["???????????? ??????", "????????????"];
const menuWithLogout = ["Signup", "Login"];

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Layout(props: LayoutProps) {
  // const navigate = useNavigate();
  const loggedUser = useAppSelector((state) => state.user.userData);
  const isLoggedIn = loggedUser.isLoggedIn;
  const subscribers = useAppSelector((state) => state.user.subscribers);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const logo = require("../../assets/img/logo.png");
  const logo_small = require("../../assets/img/logo_small.png");

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openSigninModal, setOpenSigninModal] = useState<boolean>(false);
  const [openSignupModal, setOpenSignupModal] = useState<boolean>(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // ==========================

  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawer = () => {
    setOpen(!open);
  };

  const onClickSignin = () => {
    handleCloseUserMenu();
    setOpenSigninModal((prev) => !prev);
  };
  const onClickSignup = () => {
    setOpenLoginAlert(false);
    handleCloseUserMenu();
    setOpenSignupModal((prev) => !prev);
  };

  // ????????????
  const onClickLogout = () => {
    removeToken();
    // console.log("????????????");
    window.location.replace("/main");
  };

  const onClickMyProfile = () => {
    handleCloseUserMenu();
    // console.log("????????? ??????");

    dispatch(getAboutMeAction(String(loggedUser.id))).then(() => {
      navigate(`/profile/${loggedUser.id}`);
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getSubscribersAction());
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (getAccessToken()) {
      if (!loggedUser.isLoggedIn) {
        dispatch(getMeWithTokenAction());
      }
    }
  }, []);

  // ?????? ??????
  const [openBroadcastModal, setOpenBroadcastModal] = useState<boolean>(false);
  const onClickBroadcast = () => {
    setOpenBroadcastModal((prev) => !prev);
  };

  // ????????? ??????
  const isViewed = useSelector((state: RootState) => state.feed);

  // ???????????? ?????? ?????? ??????
  const [openAccountModal, setOpenAccountModal] = useState<boolean>(false);

  // alert
  const [openAlert, setOpenAlert] = React.useState({
    state: false,
    username: "",
  });

  const handleAlert = () => {
    navigate("/avatar");
    setOpenAlert({ state: !openAlert.state, username: "" });
  };

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert({ state: false, username: loggedUser.userId });
  };

  const action = (
    <Button color="inherit" size="small" onClick={handleAlertClose}>
      <CloseIcon />
    </Button>
  );

  // ???????????? ??????
  const handleBroadcastButton = () => {
    if (isLoggedIn) {
      onClickBroadcast();
    } else {
      setOpenLoginAlert(true);
    }
  };

  // Navigate ?????? ??????
  const handleNavigateButton = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate(path);
      // setOpenLoginAlert(true);
    }
  };

  // ???????????? ????????? ??????????????????.
  const [openLoginAlert, setOpenLoginAlert] = React.useState(false);

  const handleLoginAlert = () => {
    setOpenLoginAlert(!openLoginAlert);
  };

  const handleLoginAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenLoginAlert(false);
  };

  const actionLogin = (
    <Button color="inherit" size="small" onClick={handleLoginAlert}>
      <CloseIcon />
    </Button>
  );

  return (
    <LayoutContainer open={open} sx={{ display: "flex", minHeight: "100%" }}>
      <CssBaseline />

      <ThemeProvider theme={BoldKoreanFont}>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader
            sx={{
              minHeight: 48,
              // justifyContent: open ? "initial" : "center",
              justifyContent: "center",
              px: 2.5,
            }}
          >
            {!open && (
              <Box component={Link} to="/main">
                <img src={logo_small} style={{ width: "30px" }} alt="" />
              </Box>
            )}

            {open && (
              <Box
                component={Link}
                to="/main"
                sx={{
                  opacity: open ? 1 : 0,
                }}
              >
                <img src={logo} style={{ width: "150px" }} alt="" />
              </Box>
            )}
          </DrawerHeader>
          <Divider />

          <List>
            {/* Drawer ??????/?????? ?????? */}
            <Box
              sx={{
                display: {
                  xs: "flex",
                  md: "flex",
                  justifyContent: open ? "end" : "center",
                },
              }}
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawer}
                // edge="start"
                sx={{
                  Height: 24,
                  Width: 24,
                }}
              >
                {open ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
              </IconButton>
            </Box>

            {/* {open && loggedUser.isLoggedIn && (
              <MenuItem>
              </MenuItem>
            )} */}

            {/* Drawer ????????? ??? ??? ????????? */}
            {open && (
              <Box
                sx={{
                  display: {
                    xs: "flex",
                    md: "flex",
                    justifyContent: "center",
                    mr: auto,
                    marginTop: "30px",
                    marginBottom: "30px",
                  },
                }}
              >
                <div className="badge-wrapper">
                  {loggedUser.isLoggedIn ? (
                    <IconButton sx={{ mr: 1 }}>
                      <ProfileImage big={true} border={true} />
                    </IconButton>
                  ) : (
                    <IconButton sx={{ mr: 1 }}>
                      <AccountCircleRoundedIcon
                        sx={{
                          height: 120,
                          width: 120,
                        }}
                      />
                    </IconButton>
                  )}

                  {/* Drawer ????????? ??? ?????? ???????????? */}
                  {open && loggedUser.isLoggedIn && (
                    <MenuItem className="badge-inner">
                      <Notification userData={loggedUser} />

                      {/* ?????? ????????? */}
                      <IconButton
                        className="badge-setting"
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                        onClick={handleOpenUserMenu}
                      >
                        <SettingsIcon />
                      </IconButton>
                      {/* <Tooltip title="?????????">
                        <div className="badge-subscribers">
                          <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                          >
                            <PersonRounded />
                            <span>{loggedUser.subscribers}</span>
                          </IconButton>
                        </div>
                      </Tooltip> */}

                      <div
                        className="badge-userid"
                        style={{ marginLeft: "5px" }}
                      >
                        {"@" + loggedUser.userId}
                      </div>
                      <div className="badge-subscribers">
                        {/* <img src={BubbleSubscribers} alt="" /> */}
                        <Button
                          color="inherit"
                          // onClick={() => setOpenAccountModal((prev) => !prev)}
                          startIcon={<PersonRounded />}
                        >
                          <Typography sx={{ marginTop: "4px" }}>
                            {loggedUser.subscribers}
                          </Typography>
                        </Button>
                      </div>

                      <Tooltip title="??? ?????????">
                        <div
                          className="badge-nickname"
                          style={{ marginLeft: "5px" }}
                          onClick={onClickMyProfile}
                        >
                          {loggedUser.nickName}
                        </div>
                      </Tooltip>
                    </MenuItem>
                  )}

                  {/* ??????????????? ????????? ?????? ???????????? */}
                  {open && !loggedUser.isLoggedIn && (
                    <MenuItem className="badge-inner">
                      <ListItemText
                        className="badge-login"
                        primary={"?????????"}
                        sx={{ opacity: open ? 1 : 0, ml: 4 }}
                        onClick={onClickSignin}
                      />
                      <ListItemText
                        className="badge-signup"
                        primary={"????????????"}
                        sx={{ opacity: open ? 1 : 0, ml: 1 }}
                        onClick={onClickSignup}
                      />
                      {/* <div className="badge-userid">?????????</div> */}
                    </MenuItem>
                  )}
                </div>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {loggedUser.isLoggedIn &&
                    menuWithLogin.map((item) => (
                      <MenuItem
                        key={item}
                        onClick={
                          item === "????????????"
                            ? onClickLogout
                            : () => setOpenAccountModal((prev) => !prev)
                        }
                      >
                        <Typography textAlign="center">{item}</Typography>
                      </MenuItem>
                    ))}
                </Menu>
              </Box>
            )}

            {/* Drawer ????????? ??? ?????? ????????? ????????? */}
            {!open && (
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/main"
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : auto,
                      justifyContent: "center",
                    }}
                  >
                    {loggedUser.isLoggedIn ? (
                      <ProfileImage />
                    ) : (
                      <AccountCircleRoundedIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="???" sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )}

            {/* ??? ?????? */}
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to="/main"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="???" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

            {/* ?????? ?????? */}
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                // component={Link}
                // to="/feed"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={(e) => handleNavigateButton("/feed")}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <FeedIcon />
                </ListItemIcon>
                <ListItemText primary="??????" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

            {/* ???????????? ?????? */}
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={handleBroadcastButton}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <PodcastsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="????????????"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>

            {/* ????????? ?????? ?????? (??????) */}
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={(e) => handleNavigateButton("/avatar")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <FaceIcon />
                </ListItemIcon>
                <ListItemText
                  primary="??? ?????????"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>

            {/* ???????????? ?????? (??????) */}
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={(e) => handleNavigateButton("/tutorial")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <AccessibilityNewIcon />
                </ListItemIcon>
                <ListItemText
                  primary="????????????"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />

          <List sx={{ p: 2 }}>
            {subscribers.map((item) => (
              <SubscriberItem key={item.userPK} item={item} open={open} />
            ))}
          </List>
        </Drawer>
      </ThemeProvider>

      {/* ?????? ??????: ????????? ???????????? ??? */}

      <Box
        component="main"
        sx={{ flexGrow: 1, mx: "8%", pt: 5, minHeight: "100vh", pb: 3 }}
      >
        <main className="main" style={{ minHeight: "calc(100% - 10px)" }}>
          {props.children}
        </main>
        {/* <AvatarShortcutButton /> */}
      </Box>

      {/* ????????? ?????? */}
      {openSigninModal && (
        <SigninModal
          open={openSigninModal}
          setOpen={setOpenSigninModal}
          setOpenAlert={setOpenAlert}
          openAlert={openAlert}
        />
      )}

      {/* ???????????? ?????? */}
      {openSignupModal && (
        <SignupModal open={openSignupModal} setOpen={setOpenSignupModal} />
      )}

      {/* ???????????? ?????? ?????? */}
      {openAccountModal && (
        <AccountModal open={openAccountModal} setOpen={setOpenAccountModal} />
      )}

      {/* ?????? ?????? */}
      {openBroadcastModal && (
        <BroadcastModal
          open={openBroadcastModal}
          setOpen={setOpenBroadcastModal}
        />
      )}

      {/* alert */}
      <Snackbar
        open={openAlert.state}
        autoHideDuration={7000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          variant="filled"
          severity="success"
          action={action}
          onClose={handleAlertClose}
        >
          <AlertTitle>???????????????, {openAlert.username}???!</AlertTitle>
          MALICON??? ?????? ????????????? ???
          <Typography variant="button" onClick={handleAlert}>
            ????????? ?????????
          </Typography>
        </Alert>
      </Snackbar>

      {/* ???????????? ????????? ??????????????????. */}
      <Snackbar
        open={openLoginAlert}
        autoHideDuration={3000}
        onClose={handleLoginAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          variant="filled"
          severity="error"
          action={actionLogin}
          onClose={handleLoginAlertClose}
        >
          <AlertTitle>???????????? ????????? ??????????????????.</AlertTitle>
          ?????? ????????? ???????????????? ???
          <Typography variant="button" onClick={onClickSignup}>
            ???????????? ????????????
          </Typography>
        </Alert>
      </Snackbar>
    </LayoutContainer>
  );
}
