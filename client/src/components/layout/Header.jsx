import React, { Suspense, useState, lazy } from "react";
import Box from "@mui/material/Box";
import {
  AppBar,
  Backdrop,
  Badge,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { orange } from "./../constants/color";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Add as AddIcon } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { server } from "../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExist } from "../../redux/reducer/auth,js";
import {
  setIsMobileMenu,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducer/misc";
import { decrementNotificationCount } from "../../redux/reducer/chat";
const Search = lazy(() => import("./../specific/Search"));
const Notifications = lazy(() => import("./../specific/Notifications"));
const NewGroup = lazy(() => import("./../specific/NewGroup"));

const Header = () => {
  // const [isNewGroup, setIsNewGroup] = useState(false);
  const dispatch = useDispatch();
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const handleMobile = () => dispatch(setIsMobileMenu(true));
  const openSearchDialog = () => dispatch(setIsSearch(true));
  const openNewGroup = () => {
    // setIsNewGroup((prev) => !prev);
    dispatch(setIsNewGroup(true));
  };
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(decrementNotificationCount());
  };
  const NavigateToGroup = () => navigate("/groups");
  const LogoutHandler = () => {
    const { data } = axios
      .get(`${server}/api/v1/users/logout`, { withCredentials: true })
      .then(() => {
        dispatch(userNotExist());
        navigate("/login");
      })
      .catch((e) => {
        toast.error(e?.response?.data?.message || "Something went wrong");
      });
  };
  return (
    <>
      <Box flexGrow={1}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Chat App
            </Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconBtn
                title={"Search"}
                Icon={<SearchIcon />}
                onClick={openSearchDialog}
              />

              <IconBtn
                title={"New Group"}
                Icon={<AddIcon />}
                onClick={openNewGroup}
              />

              <IconBtn
                title={"Manage Group"}
                Icon={<GroupIcon />}
                onClick={NavigateToGroup}
              />
              <IconBtn
                title={"Notifications"}
                Icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />

              <IconBtn
                title={"LogOut"}
                Icon={<LogoutIcon />}
                onClick={LogoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {isSearch && (
        <Suspense fallback={<Backdrop open={"true"} />}>
          <Search />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open={"true"} />}>
          <Notifications />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open={"true"} />}>
          <NewGroup />
        </Suspense>
      )}
    </>
  );
};
const IconBtn = ({ Icon, onClick, title, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color={"error"}>
            {Icon}
          </Badge>
        ) : (
          Icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
