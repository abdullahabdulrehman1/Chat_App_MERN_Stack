import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid } from "@mui/material";
import Chatlist from "../specific/Chatlist";
import ChatList from "../specific/Chatlist";
import { sampleChats } from "../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const handleDeleteChat = (e, _id, groupChat) => {};
    return (
      <>
        <Title />
        <Header />
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
            <ChatList
              chats={sampleChats}
              newMessegesAlert={[{ chatId, count: 5 }]}
              onlineUsers={["1", "2"]}
              chatId={chatId}
            />
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
            <WrappedComponent {...props} />{" "}
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
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
