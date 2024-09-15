import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { sampleNotifications } from "../constants/sampleData";
import { Add as AddIcon } from "@mui/icons-material";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { useErrors } from "./../../hooks/hooks";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setIsNotification } from "../../redux/reducer/misc";

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  useErrors([{ isError, error }]);
  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    try {
      const res = await acceptRequest({ requestId: _id, accept });
      if (res?.data?.success) {
        console.log("would use socket here");
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  const closeHandler = () => dispatch(setIsNotification(false));
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequest.length > 0 ? (
              data?.allRequest?.map((notification) => (
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
          </>
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
};
export default memo(Notifications);
