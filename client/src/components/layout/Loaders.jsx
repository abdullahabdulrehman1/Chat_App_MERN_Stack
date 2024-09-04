import { Grid, Skeleton, Stack } from "@mui/material";
import React from "react";

export const LayoutLoaders = () => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={"1rem"}
    >
      <Grid
        item
        height={"100%"}
        sm={4}
        md={3}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
      <Grid
        item
        xs={12}
        md={5}
        sm={8}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
        height={"100%"}
      >
        <Stack spacing={"1rem"}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={"5rem"} />
          ))}
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
        lg={3}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
    </Grid>
  );
};
