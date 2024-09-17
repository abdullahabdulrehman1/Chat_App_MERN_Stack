import { KeyboardBackspace } from "@mui/icons-material";
import { Drawer, Grid, IconButton, Skeleton, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";
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
import { setIsDeleteMenu, setIsMobileMenu } from "../../redux/reducer/misc";
import { matBlack } from "../constants/color";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  REFETCH_CHAT,
} from "../constants/event";
import Title from "../shared/Title";
import ChatList from "../specific/Chatlist";
import Profile from "../specific/Profile";
import Header from "./Header";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const socket = getSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { newMessagesAlert } = useSelector((state) => state.chat);
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery();

    // console.log(newMessagesAlert);
    const newRequestHandler = useCallback(() => {
      dispatch(incrementNotificationCount());
    }, [dispatch]);
    const refetchHandler = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);
    const params = useParams();

    const chatId = params.chatId;
    // const deleteMenuAnchor = useRef(null);

    const { isMobileMenu } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    useErrors([{ isError, error }]);
    const handleMobileClose = () => dispatch(setIsMobileMenu(false));
    const handleDeleteChat = (e, chatId, isGroupChat) => {
      e.preventDefault();
      dispatch(setIsDeleteMenu(true));

      console.log(
        `Deleting chat with ID: ${chatId}, isGroupChat: ${isGroupChat}`
      );
    };
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
    const socketEventHandler = {
      [NEW_MESSAGE_ALERT]: newMessagesAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
      [REFETCH_CHAT]: refetchHandler,
    };
    useSocketEvents(socket, socketEventHandler);
    // console.log(deleteMenuAnchor.current);
    return (
      <>
        <Title />
        <Header />
        {/* <DeleteChatMenu
          dispatch={dispatch}
          deleteOptionAnchor={deleteMenuAnchor}
        /> */}
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
            <div style={{ marginTop: "2.5rem" }}>
              <ChatList
                w={"70vw"}
                chats={data?.chats}
                newMessegesAlert={newMessagesAlert}
                onlineUsers={["1", "2"]}
                // handleDeleteChat={handleDeleteChat}
                chatId={chatId}
                // deleteMenuAnchor={deleteMenuAnchor}
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
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                newMessegesAlert={newMessagesAlert}
                onlineUsers={["1", "2"]}
                chatId={chatId}
              />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            sm={8}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            <WrappedComponent user={user} chatId={chatId} {...props} />{" "}
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
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
