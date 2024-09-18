import { useInfiniteScrollTop } from "6pp";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getSocket } from "../../socket";
import { grayColor, orange } from "../components/constants/color";
import {
  ALERT,
  NEW_MESSAGE,
  STARTTYPING,
  STOPTYPING,
} from "../components/constants/event";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessegeComponent from "../components/shared/MessegeComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { useErrors, useSocketEvents } from "../hooks/hooks";
import { useChatsDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducer/misc";
import { removeNewMessagesAlert } from "../redux/reducer/chat";
import { TypingLoaders } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";
const Chats = ({ chatId, user }) => {
  const [message, setMessages] = useState("");
  const [messages, setMessagess] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchorEl, setFileMenuAnchorE1] = useState(null);
  const [iAmTyping, setIAmTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  // console.log(userTyping);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const chatDetails = useChatsDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page: page });
  const navigate = useNavigate();
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.message
  );
  // console.log(oldMessages);
  const members = chatDetails?.data?.chat?.members;
  const messageOnChange = (e) => {
    setMessages(e.target.value);
    if (!iAmTyping) {
      socket.emit(STARTTYPING, { members, chatId });
      setIAmTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOPTYPING, { members, chatId });
      setIAmTyping(false);
    }, 2000);
  };
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
  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessagess("");
      setMessages("");
      setPage(1);
      setOldMessages([]);
    };
  }, [chatId]);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef?.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    if (chatDetails.isError) {
      navigate("/");
    }
  }, [chatDetails.isError]);
  const newMessagesHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessagess((prev) => [...prev, data.message]);
    },
    [chatId]
  );
  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      // console.log("Start typing", data);
      setUserTyping(true);
    },
    [chatId]
  );
  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      // console.log("Not Typing", data);
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chat !== chatId) return;
      const messageForAlert = {
        content: data.message,

        chat: chatId,
        sender: {
          _id: "afadasd",
          name: "Admin",
        },

        createdAt: new Date().toISOString(),
      };
      setMessagess((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk?.isError, error: oldMessagesChunk?.error },
  ];

  const socketEventHandler = {
    [NEW_MESSAGE]: newMessagesHandler,
    [ALERT]: alertListener,
    [STARTTYPING]: startTypingListener,
    [STOPTYPING]: stopTypingListener,
  };
  useSocketEvents(socket, socketEventHandler);
  useErrors(errors);
  const allMessages = [...oldMessages, ...messages];

  const handleOnFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchorE1(e.currentTarget);
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
        {userTyping && <TypingLoaders />}
        <div ref={bottomRef} />
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
            onChange={messageOnChange}
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
      <FileMenu anchoE1={fileMenuAnchorEl} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chats);
