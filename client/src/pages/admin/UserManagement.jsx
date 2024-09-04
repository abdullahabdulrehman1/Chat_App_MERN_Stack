import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar } from "@mui/material";
import { dashboardData } from "../../components/constants/sampleData";
import { transformImage } from "../../lib/features";

const UserManagement = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      headerClassName: "table-header",
    },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 150,
      headerClassName: "table-header",
      renderCell: (params) => (
        <Avatar alt={params.row.name} src={params.row.avatar} />
      ),
    },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      headerClassName: "table-header",
    },
    {
      field: "friends",
      headerName: "Friends",
      width: 200,
      headerClassName: "table-header",
    },
    {
      field: "groups",
      headerName: "Groups",
      width: 200,
      headerClassName: "table-header",
    },
  ];
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      dashboardData().users.map((i) => ({
        ...i,
        id: i._id,
        avatar: transformImage(i.avatar, 50),
      }))
    );
  }, []);
  return (
    <AdminLayout>
      <Table headings={"All Users"} rows={rows} columns={columns} />
    </AdminLayout>
  );
};

export default UserManagement;
