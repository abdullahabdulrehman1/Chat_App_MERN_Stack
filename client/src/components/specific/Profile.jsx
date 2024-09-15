import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import FaceIcon from "@mui/icons-material/Face";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
import { transformImage } from "../../lib/features";
const Profile = ({ user }) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: "10rem",
          height: "10rem",
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid black",
        }}
      />
      <ProfileCard
        Icon={<FaceIcon />}
        heading={"Name"}
        text={user?.name || "No Name"}
      />

      <ProfileCard
        Icon={<EmailIcon />}
        heading={"bio"}
        text={user?.bio || "No Bio"}
      />
      <ProfileCard
        Icon={<CalendarMonthIcon />}
        heading={"Joined"}
        text={moment(`${user?.createdAt}`).fromNow()}
      />
    </Stack>
  );
};
const ProfileCard = ({ text, Icon, heading }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      textAlign={"center"}
      color={"white"}
    >
      {Icon && Icon}
      <Stack>
        <Typography variant="body1">{text}</Typography>
        <Typography color={"gray"} variant="caption">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};
export default Profile;
