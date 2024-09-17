import { Box, Menu, Stack } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducer/misc";

export const DeleteChatMenu = ({ dispatch, deleteOptionAnchor }) => {
  const { isDeleteMenu } = useSelector((state) => state.misc);
  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
  };

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteOptionAnchor}
    >
      <Stack
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
          maxHeight: "200px",
          overflowY: "auto",
        }}
        direction={"row"}
        alignContent={"center"}
        spacing={"0.5rem"}
      >
        <Box> Delete Chat</Box>
      </Stack>
    </Menu>
  );
};

export default DeleteChatMenu;
