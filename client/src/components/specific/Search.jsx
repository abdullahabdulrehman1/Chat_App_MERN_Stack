import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useInputValidation } from "6pp";
import SearchIcon from "@mui/icons-material/Search";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../constants/sampleData";

const Search = () => {
  const search = useInputValidation("");
  let isLoadingSendFriendRequest = false;
  const [users, setUsers] = useState(sampleUsers);
  const addFriendHandler =(_id) =>{console.log(_id)} 
  return (
    <Dialog open>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="samll"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
<List>
  {
    users.map((user) => (
     <UserItem user={user}  key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest}/>
    )
    )
  }
</List>
      </Stack>
    </Dialog>
  );
};

export default Search;
