import { AttachFile as AttachFileIcon, Send as SendIcon } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import React, { Fragment, useRef } from "react";
import { grayColor, orange } from "../components/constants/color";
import { sampleMesseges } from "../components/constants/sampleData";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessegeComponent from "../components/shared/MessegeComponent";
import { InputBox } from "../components/styles/StyledComponents";
const Chats = () => {
  const containerRef = useRef(null);
  const user = {
    _id: "asdsdf",
    name: "John Doe",
  };
  return (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        sx={{
          height: "90%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {/* {/render messeges} */}
        {sampleMesseges.map((i) => {
          return <MessegeComponent messege={i} user={user} key={i._id} />;
        })}
      </Stack>
      <form style={{ height: "10%" }}>
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          // alignItem={"center"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",

              rotate: "30deg",
            }}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox placeholder="Type Messege Here..." />
          <IconButton
            type="submit"
            sx={{
              bgcolor: orange,
              color: "white",
              padding: "0.5rem",
              marginLeft: "1rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu />
    </Fragment>
  );
};

export default AppLayout()(Chats);
