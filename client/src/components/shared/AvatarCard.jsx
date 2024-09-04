import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import React from "react";
//todo Transform
const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction="row" spacing={0.5}>
      <AvatarGroup max={max} sx={{ position: "relative" }}>
        <Box width={"5rem"} height={"3rem"}>
          {" "}
          {avatar.map((src, index) => (
            <Avatar
              key={Math.random() * 100}
              src={src}
              alt={`Avatar ${index}`}
              style={{
                border: "2px solid white",
                width: "2.5rem",
                height: "2.5rem",
                position: "absolute",
                left: {
                  xs: `${index + 0.5}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
