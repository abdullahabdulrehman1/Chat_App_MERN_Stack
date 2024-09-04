import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { sampleNotifications } from "../constants/sampleData";
import { Add as AddIcon } from "@mui/icons-material";

const Notifications = () => {
  const friendRequestHandler = ({ _id, accept }) => {
    console.log(_id);
  };
  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {sampleNotifications.length > 0 ? (
          sampleNotifications.map((notification) => (
            <NotificationItem
              notification={notification}
              sender={notification.sender}
              _id={notification._id}
              handler={friendRequestHandler}
              key={notification._id}
            />
          ))
        ) : (
          <Typography variant="body1" textAlign={"center"}>
            No Notifications
          </Typography>
        )}
      </Stack>
    </Dialog>
  );
};
const NotificationItem = ({ sender, _id, handler }) => {
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src="https://picsum.photos/200" />
        <Typography
          variant="caption"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${sender.name} sent you a friend request`}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }}>
          <Button
          size={"small"}
            color={"success"}
            onClick={() => handler({ _id, accept: true })}
          >
            Accept
          </Button>
          <Button
          size={"small"}
            color={"error"}
            onClick={() => handler({ _id, accept: false })}
          >
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
}
export default memo(Notifications);
