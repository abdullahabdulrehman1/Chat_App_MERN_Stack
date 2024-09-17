import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
} from "@mui/material";
import React from "react";
import { color } from "chart.js/helpers";
import { useDeleteChatMutation } from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";

const ConfirmDeleteDialog = ({ open, handleClose, chatId }) => {
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );
  const navigate = useNavigate();
  const deleteHandler = () => {
    deleteGroup("Deleting Chat...", { chatId });
    handleClose();
    navigate("/groups");
  };
  return isLoadingDeleteGroup ? (
    <Skeleton />
  ) : (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={deleteHandler}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
