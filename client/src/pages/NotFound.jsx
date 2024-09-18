import React from "react";
import { Container, Stack, Typography } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container maxWidth="lg" sx={{ height: "100vh" }}>
      <Stack
        height={"100%"}
        alignItems={"center"}
        spacing={"2rem"}
        justifyContent={"center"}
      >
        <ErrorIcon sx={{ fontSize: "10rem" }} />
        <Typography variant="h1">404</Typography>
        <Typography variant="h3">Not Found</Typography>
        <Link to="/">Go back to Home</Link>
      </Stack>
    </Container>
  );
};

export default NotFound;
