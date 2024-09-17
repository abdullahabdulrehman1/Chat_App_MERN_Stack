import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../constants/sampleData";
import UserItem from "../shared/UserItem";
import {
  useAddGroupMemberMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducer/misc";
const AddMemberDialog = ({ chatId }) => {
  const [open, setOpen] = useState(true);

  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [addMember, isLoadingAddMember] = useAsyncMutation(
    useAddGroupMemberMutation
  );
  const { isAddMember } = useSelector((state) => state.misc);
  const { isLoading, data, error, isError } = useAvailableFriendsQuery(chatId);
  const errors = [
    {
      isError,
      error,
    },
  ];
  const selectMemberHandler = (_id) => {
    setSelectedMembers((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };

  const addMemberSubmitHandler = () => {
    addMember("Adding Members...", { chatId, members: selectedMembers });
    closeHandler();
  };
  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };
  useErrors(errors);
  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"1rem"} width={"30rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Members</DialogTitle>

        <Stack
          p={"2rem"}
          spacing={2}
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {isLoading ? (
            <Skeleton />
          ) : data?.friends.length > 0 ? (
            data?.friends.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends Found</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button onClick={closeHandler} variant="text" color="error">
            Cancel
          </Button>
          <Button
            disabled={isLoadingAddMember}
            onClick={addMemberSubmitHandler}
            variant="contained"
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
