import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import FaceIcon from "@mui/icons-material/Face";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import moment from "moment";
const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: "10rem",
          height: "10rem",
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid black",
        }}
      ></Avatar>
      <ProfileCard Icon={<FaceIcon />} heading={"Name"} text={"Abdullah"} />

      <ProfileCard Icon={<EmailIcon />} heading={"bio"} text={"hello hello"} />
      <ProfileCard
        Icon={<CalendarMonthIcon />}
        heading={"Joined"}
        text={moment(`2023-11-04T18:30:00.000Z`).fromNow()}
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
