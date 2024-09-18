import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../components/constants/config";

export const adminLogin = createAsyncThunk(
  "admin/verify",
  async (secretkey, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${server}/api/v1/admin/verify`,
        {
          secretKey: secretkey, // Use the correct parameter name
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    } catch (err) {
      console.error("Error response:", err.response);
      const errorMessage =
        err.response?.data?.error || "An unknown error occurred";
      //   toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
export const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
  try {
    const { data } = await axios.get(`${server}/api/v1/admin/`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || "An unknown error occurred";
    console.error("Error response:", err.response);
    return rejectWithValue(errorMessage);
  }
});

export const adminLogout = createAsyncThunk("admin/logout", async () => {
  try {
    const { data } = await axios.get(`${server}/api/v1/admin/logout`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.error || "An unknown error occurred";
    console.error("Error response:", err.response);
    return rejectWithValue(errorMessage);
  }
});
