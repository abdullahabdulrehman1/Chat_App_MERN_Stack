import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
const NewGroup = () => {
  const [members, setMembers] = useState(sampleUsers);
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
  console.log(selectedMembers);
  const isLoadingSendFriendRequest = false;
  const groupName = useInputValidation("");
  const submitHandler = () => {
    console.log("submit");
  };
  const closeHandler = () => {
    console.log("close");
  }
  return (
    <Dialog open>
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
        <Stack>
          {members.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={selectMemberHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant="text" color={"primary"}>
            Cancel
          </Button>
          <Button variant="contained" color={"primary"} onClick={submitHandler}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
