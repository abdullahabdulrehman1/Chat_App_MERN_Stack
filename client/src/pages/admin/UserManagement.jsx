import { useFetchData } from "6pp";
import { Avatar, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { server } from "../../components/constants/config";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { useErrors } from "../../hooks/hooks";
import { transformImage } from "../../lib/features";

const UserManagement = () => {
  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/users`,
    "users"
  );
  useErrors([{ isError: error, error: error }]);
  console.log(data);
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
    if (data) {
      setRows(
        data.users.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
        }))
      );
    }
  }, [data]);
  return loading ? (
    <Skeleton height={"100vh"} />
  ) : (
    <AdminLayout>
      <Table headings={"All Users"} rows={rows} columns={columns} />
    </AdminLayout>
  );
};

export default UserManagement;
