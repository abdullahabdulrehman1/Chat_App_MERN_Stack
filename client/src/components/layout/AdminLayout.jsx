import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { grayColor, matBlack } from "../constants/color";
import {
  Close as CloseIcon,
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Navigate, useLocation } from "react-router-dom";
import { adminTabs } from "../constants/route";
import { Link } from "../styles/StyledComponents";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";

const Sidebar = ({ w = "100vw" }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);
  const logoutHandler = () => {
    dispatch(adminLogout());
  };
  if (!isAdmin) {
    return <Navigate to="/admin" />;
  }
  return (
    <Stack w={w} direction={"column"} padding={"3rem"} spacing={"3rem"}>
      <Typography
        variant={"h5"}
        textAlign={"center"}
        textTransform={"uppercase"}
      >
        Admin Dashboard
      </Typography>
      <Stack spacing={"1rem"} alignContent={"end"}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={
              (location.pathname === tab.path && {
                bgcolor: matBlack,
                color: "white",
                borderRadius: "2rem",
                ":hover": {
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.8)",
                },
              }) || {
                borderRadius: "2rem",
                ":hover": {
                  color: "black",
                  bgcolor: "rgba(0,0,0,0.1)",
                },
              }
            }
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={"1rem"}
              sx={{
                backgroundColor:
                  location.pathname === tab.path ? "rgba(0,0,0,0.1)" : "",
                borderRadius: "2rem",
                padding: "1rem",
              }}
            >
              {tab.icon}
              <Typography>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}
        <Link
          onClick={logoutHandler}
          sx={{
            borderRadius: "2rem",
            ":hover": {
              color: "black",
              bgcolor: "rgba(0,0,0,0.1)",
            },
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={"1rem"}
            sx={{
              borderRadius: "1rem",
              padding: "1rem",
            }}
          >
            <ExitToAppIcon />
            <Typography>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};
const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const handleMobile = () => {
    setIsMobile(!isMobile);
  };
  const handleClose = () => {
    setIsMobile(false);
  };
  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          top: "5%",
          right: "2%",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar />
      </Grid>
      <Grid item xs={12} md={8} lg={9} bgcolor={grayColor}>
        {children}
      </Grid>
      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w={"50vw"} />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
