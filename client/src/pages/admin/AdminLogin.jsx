import { useInputValidation } from "6pp";
import {
  Button,
  Container,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { bgGradiant } from "../../components/constants/color";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";
import axios from "axios";
import { server } from "../../components/constants/config";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const secretKey = useInputValidation("");
  const { isAdmin, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };
  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);
  useEffect(() => {
    if (error === "Unauthorized") {
      navigate("/");
    }
  }, [error, navigate]);
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" />;
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
