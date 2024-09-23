import React from 'react';
import { Stack, Box, Skeleton } from '@mui/material';

const ChatListSkeleton = ({ w = "100%" }) => {
  return (
    <Stack
      width={w}
      overflow={"auto"}
      marginTop={"1rem"}
      height={"100%"}
      direction={"column"}
    >
      {Array.from(new Array(10)).map((_, index) => (
        <Box
          key={index}
          sx={{
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            color: "white",
            position: "relative",
            borderRadius: "1rem",
            margin: "0.4rem ",
            padding: "1rem",
          }}
        >
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'grey.800' }} />
          <Stack ml={2} width="100%">
            <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: 'grey.800' }} />
            <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'grey.800' }} />
          </Stack>
          <Skeleton
            variant="circular"
            width={10}
            height={10}
            sx={{
              bgcolor: 'grey.800',
              position: "absolute",
              top: "50%",
              right: "10px",
              transform: "translateY(-50%)",
            }}
          />
        </Box>
      ))}
    </Stack>
  );
};

export default ChatListSkeleton;