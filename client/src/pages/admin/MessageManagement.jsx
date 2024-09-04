import { Avatar, Box, Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { dashboardData } from "../../components/constants/sampleData";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachments from "../../components/shared/RenderAttachments";
import Table from "../../components/shared/Table";
import { fileFormat, transformImage } from "../../lib/features";

const MessageManagement = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      headerClassName: "table-header",
    },
    {
      field: "attachments",
      headerName: "Attachments",
      width: 200,
      headerClassName: "table-header",
      renderCell: (params) => {
        const { attachments } = params.row;
        return attachments?.length > 0
          ? attachments.map((i) => {
              const url = i.url;
              const file = fileFormat(url);

              return (
                <Box sx={{ m: "1rem"}}>
                  <a
                    href={url}
                    download
                    target="_blank"
                    style={{ color: "black" }}
                  >
                    {RenderAttachments(file, url)}
                  </a>
                </Box>
              );
            })
          : "No Attachments";
      },
    },
    {
      field: "content",
      headerName: "Content",
      width: 400,
      headerClassName: "table-header",
    },
    {
      field: "sender",
      headerName: "Sent BY",
      width: 200,
      headerClassName: "table-header",
      renderCell: (params) => (
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
          <span>{params.row.sender.name}</span>
        </Stack>
      ),
    },
    {
      field: "chat",
      headerName: "Chat",
      width: 200,
      headerClassName: "table-header",
    },
    {
      field: "groupChat",
      headerName: "Group Chat",
      width: 200,
      headerClassName: "table-header",
    },
    {
      field: "createdAt",
      headerName: "Time",
      width: 250,
      headerClassName: "table-header",
    },
  ];
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      dashboardData().messages.map((i) => ({
        ...i,
        id: i._id,
        sender: {
          name: i.sender.name,
          createdAt: moment(i.createdAt).format("MMMM Do YYYY,h:mm:ss a"),
          avatar: transformImage(i.sender.avatar, 50),
        },
      }))
    );
  }, []);
  return (
    <AdminLayout>
      <Table
        rowHeight={200}
        headings={"All Messeges"}
        rows={rows}
        columns={columns}
      />
    </AdminLayout>
  );
};

export default MessageManagement;
