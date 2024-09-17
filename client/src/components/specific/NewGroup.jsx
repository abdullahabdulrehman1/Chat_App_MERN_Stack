import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import { setIsNewGroup } from "../../redux/reducer/misc";
import toast from "react-hot-toast";
const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);
  const errors = [
    {
      isError,
      error,
    },
  ];
  useErrors(errors);

  const [selectedMembers, setSelectedMembers] = useState([]);
  const selectMemberHandler = (_id) => {
    setSelectedMembers((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };
  const isLoadingSendFriendRequest = false;
  const groupName = useInputValidation("");

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 1)
      return toast.error("Select at least one member");
    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });
    closeHandler();
  };
  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} spacing={"2rem"} width={"25rem"}>
        <DialogTitle textAlign={"center"} variant="h5">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />
        <Typography variant="body1" textAlign={"center"}>
          Members
        </Typography>
        <Stack
          spacing={2}
          sx={{
            maxHeight: "300px", 
            overflowY: "auto", 
          }}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            data &&
            data?.friends?.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant="text" color={"primary"} onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={"primary"}
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
