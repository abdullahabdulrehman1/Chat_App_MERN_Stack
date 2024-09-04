import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Stack } from "@mui/material";
import { dashboardData } from "../../components/constants/sampleData";
import { transformImage } from "../../lib/features";
import AvatarCard from "../../components/shared/AvatarCard";

const ChatManagement = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      headerClassName: "table-header",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      headerClassName: "table-header",
    },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 150,

      headerClassName: "table-header",
      renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
    },
    {
      field: "totalMembers",
      headerName: "Total Members",
      width: 150,
      headerClassName: "table-header",
    },
    {
      field: "members",
      headerName: "Members",
      width: 200,
      headerClassName: "table-header",
      renderCell: (params) => (
        <AvatarCard max={100} avatar={params.row.members} />
      ),
    },
    {
      field: "totalMesseges",
      headerName: "Total Messeges",
      width: 230,
      headerClassName: "table-header",
    },
    {
      field: "creator",
      headerName: "Created By",
      width: 250,
      headerClassName: "table-header",
      renderCell: (params) => (
        <Stack direction="row" alignItems={"center"} spacing={"1rem"}>
          {params.row.creator && (
            <>
              <Avatar
                alt={params.row.creator.name}
                src={params.row.creator.avatar}
              />
              <span>{params.row.creator.name}</span>
            </>
          )}
        </Stack>
      ),
    },
  ];
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      dashboardData().chats.map((i) => ({
        ...i,
        id: i._id,
        name: i.name,
        avatar: i.avatar.map((i) => transformImage(i, 50)),
        members: i.members.map((i) => transformImage(i.avatar, 50)),
        creator: {
          name: i.creator.name,
          avatar: transformImage(i.creator.avatar, 50),
        },
      }))
    );
  }, []);
  return (
    <AdminLayout>
      <Table headings={"All Chats"} rows={rows} columns={columns} />
    </AdminLayout>
  );
};

export default ChatManagement;
