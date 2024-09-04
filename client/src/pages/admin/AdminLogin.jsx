import { useInputValidation } from "6pp";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";
import { bgGradiant } from "../../components/constants/color";

const AdminLogin = () => {
  const secretKey = useInputValidation("");
  const isAdmin = true;
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submit");
  };
  if(isAdmin){
    return <Navigate to="/admin/dashboard"/>
  }
  return (
    <div
      style={{
        backgroundImage: bgGradiant,
      }}
    >
      {" "}
      <Container
        component={"main"}
        maxWidth={"sm"}
        hidden
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <>
            <Typography variant="h5">Admin Login</Typography>
            <form
              style={{
                width: "100%",
              }}
              onSubmit={submitHandler}
            >
              <TextField
                required
                fullWidth
                label="password"
                type="password"
                margin="normal"
                variant="outlined"
                value={secretKey.value}
                onChange={secretKey.changeHandler}
              />
              <Button
                sx={{
                  marginTop: "1rem",
                }}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Login
              </Button>
            </form>
          </>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
