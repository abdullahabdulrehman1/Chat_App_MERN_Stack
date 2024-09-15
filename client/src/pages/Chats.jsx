import { useInfiniteScrollTop } from "6pp";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, { Fragment, useCallback, useRef, useState } from "react";
import { getSocket } from "../../socket";
import { grayColor, orange } from "../components/constants/color";
import { NEW_MESSAGE } from "../components/constants/event";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessegeComponent from "../components/shared/MessegeComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { useErrors, useSocketEvents } from "../hooks/hooks";
import { useChatsDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useDispatch } from "react-redux";
const Chats = ({ chatId, user }) => {
  const [message, setMessages] = useState("");
  const [messages, setMessagess] = useState([]);
  const [page, setPage] = useState(1);

  const containerRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const chatDetails = useChatsDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page: page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.message
  );
  console.log(oldMessages);
  const members = chatDetails?.data?.chat?.members;

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim() === "") return;
    socket.emit(NEW_MESSAGE, {
      chatId,
      message,
      members,
    });
    setMessages("");
  };
  const newMessagesHandler = useCallback((data) => {
    setMessagess((prev) => [...prev, data.message]);
  }, []);
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk?.isError, error: oldMessagesChunk?.error },
  ];

  const socketEventHandler = { [NEW_MESSAGE]: newMessagesHandler };
  useSocketEvents(socket, socketEventHandler);
  useErrors(errors);
  const allMessages = [...oldMessages, ...messages];
  const handleOnFileOpen = (e) => {
    dispatch(setIsFileMenuOpen(true));
    // socket.emit("file", { chatId });
  };
  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
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

        {allMessages.map((i) => {
          return <MessegeComponent messege={i} user={user} key={i._id} />;
        })}
      </Stack>
      <form style={{ height: "10%" }} onSubmit={submitHandler}>
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
            onClick={handleOnFileOpen}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            value={message}
            onChange={(e) => setMessages(e.target.value)}
            placeholder="Type Messege Here..."
          />
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
