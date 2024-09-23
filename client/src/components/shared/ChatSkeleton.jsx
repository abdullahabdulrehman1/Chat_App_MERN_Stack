import { Box, Stack, Skeleton } from "@mui/material";
import React from "react";

const ChatSkeleton = () => {
  return (
    <Stack
      boxSizing={"border-box"}
      padding={"1rem"}
      spacing={"1rem"}
      sx={{
        height: "90%",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {Array.from(new Array(10)).map((_, index) => (
        <Box
          key={index}
          sx={{
            alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
            backgroundColor: "white",
            color: "black",
            borderRadius: "5px",
            width: "fit-content",
            padding: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <Skeleton
            variant="text"
            width={100}
            height={20}
            sx={{ bgcolor: "grey.800" }}
          />
          <Skeleton
            variant="text"
            width={200}
            height={20}
            sx={{ bgcolor: "grey.800" }}
          />
          <Skeleton
            variant="rectangular"
            width={300}
            height={150}
            sx={{ bgcolor: "grey.800" }}
          />
          <Skeleton
            variant="text"
            width={50}
            height={20}
            sx={{ bgcolor: "grey.800" }}
          />
        </Box>
      ))}
    </Stack>
  );
};

export default ChatSkeleton;
