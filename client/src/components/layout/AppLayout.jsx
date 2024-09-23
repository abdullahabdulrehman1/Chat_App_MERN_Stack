import {
  AccountCircle,
  Email,
  KeyboardBackspace,
  Phone,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSocket } from "../../../socket";
import { useErrors, useSocketEvents } from "../../hooks/hooks";
import { getOrSaveFromLocalStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotificationCount,
  setNewMessagesAlert,
} from "../../redux/reducer/chat";
import {
  setIsDeleteMenu,
  setIsMobileMenu,
  setSelectedDeleteChat,
} from "../../redux/reducer/misc";
import { matBlack } from "../constants/color";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE,
  REFETCH_CHAT,
} from "../constants/event";
import { DeleteChatMenu } from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";
import ProfileSkeleton from "../shared/ProfileSkeleton";
import ChatSkeleton from "../shared/ChatSkeleton";
import ChatListSkeleton from "../shared/ChatListSkeleton";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const socket = getSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const deleteMenuAnchor = useRef(null);
    const { newMessagesAlert } = useSelector((state) => state.chat);
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [name, setName] = useState("");
    // console.log(newMessagesAlert);
    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotificationCount());
    }, [dispatch]);
    const refetchHandler = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);
    const onlineUserListener = useCallback(
      (data) => {
        setOnlineUsers(data);
      },
      [refetch, navigate]
    );
    const params = useParams();

    const chatId = params.chatId;
    // const deleteMenuAnchor = useRef(null);

    const { isMobileMenu } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    useErrors([{ isError, error }]);
    const handleMobileClose = () => dispatch(setIsMobileMenu(false));

    useEffect(() => {
      getOrSaveFromLocalStorage({
        key: NEW_MESSAGE_ALERT,
        value: newMessagesAlert,
      });
    }, [newMessagesAlert]);
    const newMessagesAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) {
          return;
        } else {
          dispatch(setNewMessagesAlert(data));
        }
      },
      [chatId]
    );
    const handleDeleteChat = (e, chatId, name, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      setName(name);
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };
    const socketEventHandler = {
      [NEW_MESSAGE_ALERT]: newMessagesAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
      [REFETCH_CHAT]: refetchHandler,
      [ONLINE]: onlineUserListener,
    };
    useSocketEvents(socket, socketEventHandler);

    return (
      <>
        <Title />
        <Header />
        <DeleteChatMenu
          dispatch={dispatch}
          name={name}
          deleteMenuAnchor={deleteMenuAnchor}
        />
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobileMenu} onClose={handleMobileClose}>
            <Tooltip title="back">
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  bgcolor: matBlack,
                  color: "white",
                  ":hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                  },
                }}
                onClick={handleMobileClose}
              >
                <KeyboardBackspace />
              </IconButton>
            </Tooltip>
            <div style={{ marginTop: "2.5rem" }} onClick={handleMobileClose}>
              <ChatList
                w={"70vw"}
                chats={data?.chats}
                newMessegesAlert={newMessagesAlert}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                onlineUsers={onlineUsers}
              />
            </div>
          </Drawer>
        )}
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          height={"calc(100vh - 4rem)"}
        >
          <Grid
            item
            height={"100%"}
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            {isLoading ? (
             <ChatListSkeleton/>
            ) : (
              <ChatList
                chats={data?.chats}
                newMessegesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            sm={8}
            sx={{
              display: { xs: "block", sm: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <ChatSkeleton />
            ) : (
              <WrappedComponent user={user} chatId={chatId} {...props} />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            lg={3}
            sx={{
              display: { xs: "none", sm: "block" },
              padding: "2rem",
              backgroundColor: "black",
            }}
            height={"100%"}
          >
            {isLoading ? <ProfileSkeleton /> : <Profile user={user} />}
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
