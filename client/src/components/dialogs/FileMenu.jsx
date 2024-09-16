import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setIsuploadingLoader } from "../../redux/reducer/misc";
import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ anchoE1, chatId }) => {
  const dispatch = useDispatch();
  const [sendAttachments] = useSendAttachmentsMutation();

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const { isFileMenu } = useSelector((state) => state.misc);
  const handleClose = () => {
    dispatch(setIsFileMenu(false));
  };
  const selectRef = (ref) => {
    ref.current?.click();
  };
  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target?.files);
    if (files.length === 0) return;
    if (files.length > 5)
      return toast.error(`You can only upload 5 ${key} at a time`);
    dispatch(setIsuploadingLoader(true));
    //fetching here
    const toastId = toast.loading(`sending ${key}...`);

    try {
      const myFormData = new FormData();

      myFormData.append("chatId", chatId);
      files.forEach((file) => {
        myFormData.append("files", file);
      });

      const res = await sendAttachments(myFormData);
      dispatch(setIsFileMenu(false));
      if (res.data) {
        toast.success(`${key} sent successfully`);
      } else {
        toast.error(`Failed to send ${key}`);
      }
    } catch (error) {
      toast.error(`Failed to send  ${key}`);
    } finally {
      dispatch(setIsuploadingLoader(false));
      toast.dismiss(toastId);
    }
  };
  return (
    <Menu anchorEl={anchoE1} open={isFileMenu} onClose={handleClose}>
      <div style={{ width: "10rem" }}>
        <MenuList>
          <MenuItem onClick={() => selectRef(imageRef)}>
            <Tooltip title={"Image"}>
              <ImageIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg,image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Images")}
              ref={imageRef}
            />
          </MenuItem>
          <MenuItem
            onClick={() => selectRef(audioRef)}
            onChange={fileChangeHandler}
          >
            <Tooltip title={"Audio"}>
              <AudioFileIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg,audio/wav, audio/mp3, audio/ogg, audio/flac"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
              ref={audioRef}
            />
          </MenuItem>
          <MenuItem
            onClick={() => selectRef(videoRef)}
            onChange={fileChangeHandler}
          >
            <Tooltip title={"Video"}>
              <VideoFileIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4,video/x-m4v,video/*,video/3gpp,video/quicktime"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
              ref={videoRef}
            />
          </MenuItem>
          <MenuItem
            onClick={() => selectRef(fileRef)}
            onChange={fileChangeHandler}
          >
            <Tooltip title={"File"}>
              <UploadFileIcon />
            </Tooltip>
            <ListItemText sx={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
