import { Box, Typography } from "@mui/material";
import moment from "moment";
import React, { memo } from "react";
import { fileFormat } from "../../lib/features";
import { lightBlue } from "../constants/color";
import RenderAttachments from "./RenderAttachments";
import { motion } from "framer-motion";
const MessegeComponent = ({ messege, user }) => {
  const { sender, content, attachments = [], createdAt } = messege;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        width: "fit-content",
        padding: "0.5rem",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant="caption">
          {sender.name}
        </Typography>
      )}
      {content && <Typography>{content}</Typography>}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (
            <Box key={index}>
              <a
                href={url}
                key={index}
                target="_blank"
                download
                style={{ color: "black" }}
              >
                {RenderAttachments(file, url)}
              </a>
            </Box>
          );
        })}
      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessegeComponent);
