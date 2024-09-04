import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { grayColor } from "../components/constants/color";

const Home = () => {
  return (
    <Box sx={{ bgcolor: grayColor, height: "100%" }}>
      <Typography variant="h5" textAlign={"center"} p={"2rem"}>
        Select a friend to chat
      </Typography>
    </Box>
  );
};

export default AppLayout()(Home);
