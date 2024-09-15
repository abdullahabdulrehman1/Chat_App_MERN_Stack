import { KeyboardBackspace } from "@mui/icons-material";
import { Drawer, Grid, IconButton, Skeleton, Tooltip } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useErrors } from "../../hooks/hooks";
import { useMyChatsQuery } from "../../redux/api/api";
import { setIsMobileMenu } from "../../redux/reducer/misc";
import { matBlack } from "../constants/color";
import Title from "../shared/Title";
import ChatList from "../specific/Chatlist";
import Profile from "../specific/Profile";
import Header from "./Header";
import { getSocket } from "../../../socket";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const dispatch = useDispatch();
    const chatId = params.chatId;
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery();

    const { isMobileMenu } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    useErrors([{ isError, error }]);
    const handleMobileClose = () => dispatch(setIsMobileMenu(false));
    const handleDeleteChat = (e, _id, groupChat) => {};
    const socket = getSocket();
    console.log(socket.id);
    return (
      <>
        <Title />
        <Header />
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
                newMessegesAlert={[{ chatId, count: 5 }]}
                onlineUsers={["1", "2"]}
                chatId={chatId}
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
                newMessegesAlert={[{ chatId, count: 5 }]}
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
            <WrappedComponent  user = {user} chatId={chatId} {...props} />{" "}
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
