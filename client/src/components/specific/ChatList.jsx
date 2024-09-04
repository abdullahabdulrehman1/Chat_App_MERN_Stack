import { Stack } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers,
  newMessegesAlert = [{ chatId: "", count: 0 }],
  handleDeleteChat,
}) => {
  return (
    <Stack width={w} overflow={"auto"} height={"100%"} direction={"column"}>
      {chats?.map((data, index) => {
        const { _id, name, sameSender, avatar, groupChat, members } = data;
        const newMessegeAlert = newMessegesAlert.find(
          ({ chatId }) => chatId === _id
        );
        const isOnline = onlineUsers.includes(_id);
        return (
          <ChatItem
            index={index}
            newMessegeAlert={newMessegeAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
