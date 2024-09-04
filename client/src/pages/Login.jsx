import {
  Avatar,
  Button,
  Container,
  Stack,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { usernameValidation } from "../utils/validators";
import { bgGradiant } from "../components/constants/color";
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleLogin = () => setIsLogin((prev) => !prev);
  const name = useInputValidation("", usernameValidation);
  const password = useStrongPassword();
  const email = useInputValidation("");
  const avatar = useFileHandler("single");
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("login", email.value, password.value);
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("signup", email.value, password.value, name.value, avatar.file);
  };

  return (
    <div
      style={{
        backgroundImage:bgGradiant
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
                  label="email"
                  margin="normal"
                  variant="outlined"
                  value={email.value}
                  onChange={email.changeHandler}
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
                  label="email"
                  margin="normal"
                  variant="outlined"
                  value={email.value}
                  onChange={email.changeHandler}
                />
                <TextField
                  // required
                  fullWidth
                  label="username"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                {name.error && (
                  <Typography
                    variant="caption"
                    textAlign={"justify"}
                    color="error"
                  >
                    {name.error}
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
