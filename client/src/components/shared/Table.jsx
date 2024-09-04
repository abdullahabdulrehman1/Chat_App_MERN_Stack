import { Container, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { matBlack } from "../constants/color";

const Table = ({ rows, columns, headings, rowHeight = 52 }) => {
  return (
    <Container sx={{ height: "100vh" }}>
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "1rem 4rem",
          borderRadius: "1rem",
          boxShadow: "none",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ textTransform: "uppercase", margin: "2rem" }}
          gutterBottom
        >
          {headings}
        </Typography>
        <div style={{ flexGrow: 1, width: "100%" }}>
          {" "}
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowHeight={rowHeight}
            style={{
              height: "80%",
            }}
            sx={{
              // position: "absolute",
              // overflow: "auto",
              border: "none",
              ".table-header": { bgcolor: matBlack, color: "white" },
            }}
          />
        </div>
      </Paper>
    </Container>
  );
};

export default Table;
