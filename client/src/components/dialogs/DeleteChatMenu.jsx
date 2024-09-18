import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducer/misc";
import { useAsyncMutation } from "../../hooks/hooks";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";
import { useNavigate } from "react-router-dom";
import {
  ChatBubbleOutlineOutlined,
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";

export const DeleteChatMenu = ({ dispatch, name, deleteMenuAnchor }) => {
  const navigate = useNavigate();

  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );
  console.log(deleteMenuAnchor);
  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  const isGroup = selectedDeleteChat.groupChat;

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor = null;
  };

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
  };

  const deleteChatHandler = () => {
    closeHandler();
    deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
  };

  useEffect(() => {
    if (deleteChatData || leaveGroupData) navigate("/");
  }, [deleteChatData, leaveGroupData]);

  return (
    <Dialog open={isDeleteMenu} onClose={closeHandler}>
      <Stack p={"1rem"} width={"30rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>
          Delete {name} {isGroup ? "Group" : "Chat"}
        </DialogTitle>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button onClick={closeHandler} variant="outlined">
            Cancel
          </Button>

          {isGroup ? (
            <Button
              variant="oulined"
              sx={{
                color: "red",
              }}
              onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
            >
              <ExitToAppIcon />
              <Typography>Leave Group</Typography>
            </Button>
          ) : (
            <Button
              variant="oulined"
              sx={{
                color: "red",
              }}
              onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
            >
              <DeleteIcon />
              <Typography>Delete Chat</Typography>
            </Button>
          )}
        </Stack>
      </Stack>
    </Dialog>
    // </Menu>
  );
};

export default DeleteChatMenu;
