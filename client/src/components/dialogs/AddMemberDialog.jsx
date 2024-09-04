import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../constants/sampleData";
import UserItem from "../shared/UserItem";
const AddMemberDialog = ({ addMember, isLoadingAddMember, chatId }) => {
  const [members, setMembers] = useState(sampleUsers);
  const [open, setOpen] = useState(true);

  const [selectedMembers, setSelectedMembers] = useState([]);
  const selectMemberHandler = (_id) => {
    setMembers((prev) =>
      prev.map((user) =>
        user._id === _id ? { ...user, isAdded: !user.isAdded } : user
      )
    );
    setSelectedMembers((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };

  const addMemberSubmitHandler = () => {
    closeHandler();
  };
  const closeHandler = () => {
    setSelectedMembers([]);
    setMembers([]);
  };
  return (
    <Dialog open={open} onClose={closeHandler}>
      <Stack p={"1rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
      </Stack>
      <Stack spacing={"1rem"} p={"2rem"}>
        {members.length > 0 ? (
          members.map((user) => (
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
    </Dialog>
  );
};

export default AddMemberDialog;
