import { axiosInstance } from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUsersThunk = createAsyncThunk(
  "users/getUsers",
  async (params: { searchTerm?: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/user", { params });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch users");
    }
  }
);
