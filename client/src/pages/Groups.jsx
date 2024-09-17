import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import React, { lazy, memo, Suspense, useEffect, useState } from "react";
import { bgGradiant, matBlack, orange } from "../components/constants/color";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChats, sampleUsers } from "../components/constants/sampleData";
import UserItem from "../components/shared/UserItem";
import Header from "../components/layout/Header";
import {
  useAddGroupMemberMutation,
  useChatsDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { useAsyncMutation, useErrors } from "../hooks/hooks";
import { LayoutLoaders } from "../components/layout/Loaders";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducer/misc";
const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const dispatch = useDispatch();
  const { isAddMember } = useSelector((state) => state.misc);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const navigate = useNavigate();
  const myGroups = useMyGroupsQuery();
  const chatId = useSearchParams()[0].get("group");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdated, setGroupNameUpdated] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const groupDetails = useChatsDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );
  const [members, setMembers] = useState([]);

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);
  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails?.data?.chat?.name);
      setGroupNameUpdated(groupDetails?.data?.chat?.name);
      setMembers(groupDetails?.data?.chat?.members);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdated("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);
  const navigateBack = () => {
    navigate("/");
  };
  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const removeMemberHandler = (id) => {
    removeMember("Removing Member", { chatId, members: [id] });
  };
  const handleMobileClose = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (chatId) {
      setGroupName("Group Name");
      setGroupNameUpdated(`Group Name ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdated("");
      setIsEdit(false);
    };
  }, [chatId]);
  const confirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
    console.log("confirm delete");
  };
  const openAddHandler = () => {
    dispatch(setIsAddMember(true));
  };
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
    console.log("close delete");
  };

  const IconBtns = () => {
    return (
      <>
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            position: "fixed",
            right: "1rem",
            top: "1rem",
          }}
        >
          <IconButton
            onClick={handleMobile}
            sx={{
              position: "absolute",
              top: "1rem",
              right: "2rem",
              bgcolor: matBlack,
              color: "white",
              ":hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
            size={"medium"}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Tooltip title="back">
          <IconButton
            size={matches ? "medium" : "small"}
            sx={{
              position: "absolute",
              top: "2rem",
              left: "2rem",
              bgcolor: matBlack,
              color: "white",
              ":hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
            }}
            onClick={navigateBack}
          >
            <KeyboardBackspaceIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  };
  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name", { chatId, name: groupNameUpdated });
    console.log(groupNameUpdated);
  };
  const deletehandler = () => {
    console.log("delete handler");
    closeConfirmDeleteHandler();
  };
  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"2rem"}
    >
      {isEdit ? (
        <>
          <TextField
            label="Group Name"
            variant="outlined"
            value={groupNameUpdated}
            onChange={(e) => setGroupNameUpdated(e.target.value)}
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton
            onClick={() => setIsEdit(true)}
            disabled={isLoadingGroupName}
          >
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
  const ButtonGroup = (
    <Stack
      direction={{
        sm: "row",
        xs: "column-reverse",
      }}
      spacing={"1rem"}
      p={{
        xs: "0rem",
        sm: "2rem",
        md: "1rem 4rem",
      }}
    >
      <Button
        size={"large"}
        color="error"
        variant={"text"}
        startIcon={<DeleteIcon />}
        onClick={confirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size={"large"}
        variant={"contained"}
        onClick={openAddHandler}
        startIcon={<AddIcon />}
      >
        Add Member
      </Button>
    </Stack>
  );
  return myGroups.isLoading ? (
    <LayoutLoaders />
  ) : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sm={4}
        sx={{
          display: { xs: "none", sm: "block" },
          backgroundImage: bgGradiant,
        }}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns()}
        {groupName && (
          <>
            {GroupName}
            <Typography textAlign={"center"} variant="h5">
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"70vw"}
              direction={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"1"}
              padding={{ xs: "0rem", sm: "2rem", md: "4rem" }}
              boxSizing={"border-box"}
              height={"50vh"}
              overflow={"auto"}
              marginX={"1rem"}
            >
              {isLoadingRemoveMember ? (
                <CircularProgress />
              ) : (
                members.map((i) => (
                  <UserItem
                    user={i}
                    isAdded
                    key={i._id}
                    handler={removeMemberHandler}
                    styling={{
                      display: "flex",
                      alignItems: "center",
                      padding: "1rem 2rem",
                      backgroundColor: "unset",
                      color: "unset",
                      position: "relative",
                      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                      borderRadius: "1rem",
                    }}
                  />
                ))
              )}
            </Stack>
            {ButtonGroup}
          </>
        )}
      </Grid>
      {isAddMember && (
        <Suspense fallback={<Backdrop open={"true"} />}>
          <AddMemberDialog chatId={chatId} />{" "}
        </Suspense>
      )}
      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open={"true"} />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            chatId={chatId}
          />
        </Suspense>
      )}
      <Drawer
        sx={{
          display: { xs: "block", sm: "none" },
          // bgcolor: orange,
          backgroundImage: bgGradiant,
          zIndex: 1000,
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        {/* Group LIST */}
        <GroupsList
          w={"70vw"}
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
        />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack
      sx={{ backgroundImage: bgGradiant, height: "100vh", overflow: "auto" }}
      width={w}
      direction={"column"}
    >
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Typography textAlign={"center"} padding="1rem">
          No Groups
        </Typography>
      )}
    </Stack>
  );
};
const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) {
          e.preventDefault();
        }
      }}
    >
      <Stack
        direction={"row"}
        overflow={"auto"}
        height={"100%"}
        spacing={"1rem"}
        alignItems={"center"}
      >
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});
export default Groups;
