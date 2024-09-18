import { Avatar, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { dashboardData } from "../../components/constants/sampleData";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { transformImage } from "../../lib/features";
import { useFetchData } from "6pp";
import { server } from "../../components/constants/config";
import { useErrors } from "../../hooks/hooks";

const ChatManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/allchats`,
    "allChats"
  );
  useErrors([{ isError: error, error: error }]);
  // console.log(data);
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
      field: "totalMessages",
      headerName: "Total Messages",
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
    if (data) {
      setRows(
        data.transformChats.map((i) => ({
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
    }
  }, [data]);
  return loading ? (
    <Skeleton  height={"100vh"}/>
  ) : (
    <AdminLayout>
      <Table headings={"All Chats"} rows={rows} columns={columns} />
    </AdminLayout>
  );
};

export default ChatManagement;
