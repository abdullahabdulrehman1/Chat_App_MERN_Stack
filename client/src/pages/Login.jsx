import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { bgGradiant } from "../components/constants/color";
import { server } from "../components/constants/config";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { userExist } from "../redux/reducer/auth,js";
import { usernameValidation } from "../utils/validators";
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleLogin = () => setIsLogin((prev) => !prev);
  const name = useInputValidation("", usernameValidation);
  const password = useStrongPassword();
  const username = useInputValidation("", usernameValidation);
  const bio = useInputValidation("");
  const avatar = useFileHandler("single");
  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("login", username.value, password.value);
    const config = {
      withCredentials: true,
      header: {
        "Content-Type": "application/json",
      },
    };
    try {
      const data = await axios.post(
        `${server}/api/v1/users/login`,
        { username: username.value, password: password.value },
        config
      );
      dispatch(userExist(true));

      toast.success(data.data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("avatar", avatar.file);
    formData.append("username", username.value);
    formData.append("bio", bio.value);
    formData.append("password", password.value);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };
    try {
      const { data } = axios
        .post(`${server}/api/v1/users/newUser`, formData)
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          toggleLogin();
        }, config);
      dispatch(userExist(true));
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

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
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{
                  width: "100%",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Useranme"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
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
                <Typography textAlign="center">OR</Typography>
                <Button
                  variant="text"
                  fullWidth
                  // fullWidth
                  // color="primary"
                  onClick={toggleLogin}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
            <span>
              {" "}
              <Typography textAlign={"center"} variant="h5">
                Sign Up
              </Typography>
              <form
                style={{
                  width: "100%",
                }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    src={avatar.preview}
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(255,255,255,0.5)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />{" "}
                    </>
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography
                    textAlign={"justify"}
                    variant="caption"
                    color="error"
                    m={"1rem auto"}
                    display={"block"}
                  >
                    {avatar.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  // required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  // required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                {username.error && (
                  <Typography
                    variant="caption"
                    textAlign={"justify"}
                    color="error"
                  >
                    {username.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                {password.error && (
                  <Typography
                    textAlign={"justify"}
                    variant="caption"
                    color="error"
                  >
                    {password.error}
                  </Typography>
                )}

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  SIGN UP
                </Button>
                <Typography textAlign="center">OR</Typography>
                <Button
                  variant="text"
                  fullWidth
                  // color="primary"
                  onClick={toggleLogin}
                >
                  Sign In Instead
                </Button>
              </form>
            </span>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
