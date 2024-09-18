import { useFetchData } from "6pp";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationAddIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Container, Paper, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { matBlack } from "../../components/constants/color";
import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import {
  CurvedButton,
  SearchField,
} from "../../components/styles/StyledComponents";
import { server } from "./../../components/constants/config";
import { useErrors } from "./../../hooks/hooks";

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/admindashboardstats`,
    "dashboard-stats"
  );
  useErrors([{ isError: error, error: error }]);
  const { stats } = data || {};

  const Appbar = (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center", // Center the entire AppBar content
        alignItems: "center",
        padding: "2rem",
        margin: "2rem 0",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={{ xs: "space-evenly", lg: "space-between" }} // Adjust based on screen size
        spacing={"1rem"}
        sx={{ width: "100%" }} // Ensure Stack takes full width
      >
        <AdminPanelSettingsIcon
          sx={{
            fontSize: "3rem",
          }}
        />
        <SearchField type="text" placeholder="Search..." />
        <CurvedButton>Search</CurvedButton>
        {/* Remove the Box with flexGrow */}
        <Typography
          display={{ xs: "none", lg: "block" }} // Hide on xs screens
          color={"rgba(0,0,0,0.7)"}
          textAlign={"center"}
          sx={{ flexGrow: 1, textAlign: "center" }} // Center text
        >
          {moment().format("dddd, D MMMM YYYY")}
        </Typography>
        <NotificationAddIcon />
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={"1rem"}
      justifyContent={{ xs: "center", md: "stretch" }}
      alignItems={{ xs: "center", md: "stretch" }}
      margin={"2rem 0"}
      flexGrow={1}
    >
      <Widget
        title={"Total Users"}
        value={stats?.totalUsers}
        Icon={<PersonIcon />}
      />
      <Widget title={"Chats"} value={stats?.totalChats} Icon={<GroupIcon />} />
      <Widget
        title={"Messages"}
        value={stats?.totalMessages}
        Icon={<MessageIcon />}
      />
    </Stack>
  );
  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Container component={"main"}>
          {Appbar}

          <Stack
            direction={{ xs: "column", lg: "row" }}
            alignItems={{ xs: "center", lg: "flex-start" }}
            justifyContent={{ xs: "center", lg: "stretch" }}
            sx={{ gap: "2rem" }}
            flexWrap={"wrap"}
            margin={"2rem 0"}
          >
            <Paper
              elevation={3}
              sx={{
                padding: "1rem",
                borderRadius: "1rem",
                flexGrow: 1,
                minWidth: "20rem",
                width: { xs: "100%", lg: "50%" },
                height: "30rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography margin={"2rem 0"} variant="h4">
                Last Messages
              </Typography>
              <LineChart value={stats?.messages || []} />
            </Paper>

            <Paper
              elevation={3}
              sx={{
                padding: "1rem",
                borderRadius: "1rem",
                position: "relative",
                width: { xs: "100%", lg: "50%" },
                maxWidth: "22rem",
                height: "30rem",
                display: "flex", // Added
                flexDirection: "column", // Added
                justifyContent: "center", // Added
                alignItems: "center", // Added
              }}
            >
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                value={[
                  stats?.totalChats - stats?.groupCount || 0,
                  stats?.groupCount || 0,
                ]}
                style={{ position: "relative", zIndex: 10 }}
              />
              <Stack
                position={"absolute"}
                direction={"row"}
                top={"2%"}
                right={"0%"}
                justifyContent={"center"}
                alignItems={"center"}
                height={"100%"}
                width={"100%"}
                sx={{ zIndex: 5, pointerEvents: "none" }}
              >
                <GroupIcon />
                <Typography>VS </Typography>
                <PersonIcon />
              </Stack>
            </Paper>
          </Stack>
          {Widgets}
        </Container>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: "2rem",
        margin: "2rem 0",
        width: "100%",
        flexGrow: 1,
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        alignItems={"center"}
        justifyContent={"center"}
        spacing={"1rem"}
        padding={"1rem"}
        borderRadius={"1rem"}
        position={"relative"}
      >
        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "rgba(0,0,0,0.7)",
            width: "5rem",
            height: "5rem",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: `1px solid ${matBlack}`,
          }}
        >
          {value}
        </Typography>
        <Stack spacing={"1rem"} alignItems={"center"} direction={"row"}>
          {Icon}
          <Typography>{title}</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Dashboard;
