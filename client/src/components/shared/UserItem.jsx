import { Add as AddIcon,Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import { color } from "chart.js/helpers";
import React, { memo } from "react";

const UserItem = ({ user,handler, handlerIsLoading,isAdded,styling}) => {
  const { name, _id, avatar } = user;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
        
      >
        <Avatar src="https://picsum.photos/200"/>
        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {name}
        </Typography>
        <IconButton
          size="small"
          sx={{
            color: "white",
            bgcolor: `${isAdded ? "error.main" : "primary.main"}`,
            "&:hover": {
              bgcolor: `${isAdded ? "error.dark" : "primary.dark"}`,
            },
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
         
          {
            !isAdded ? (<AddIcon/>): (<RemoveIcon/>)
          }
        </IconButton>
      </Stack>
    </ListItem>
  );
  
};

export default memo(UserItem);
