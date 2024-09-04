import React from "react";
import { transformImage } from "../../lib/features";
import { FileOpen } from "@mui/icons-material";

const RenderAttachments = (file, url) => {
  switch (file) {
    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          width="200px"
          height="150px"
          alt="attachment"
          style={{ objectFit: "contain" }}
        />
      );

    case "video":
      return (
        <video src={url} controls style={{ width: "100px", height: "100px" }} />
      );
    case "audio":
      return <audio src={url} controls />;
    default:
      return <FileOpen />;
  }
};

export default RenderAttachments;
