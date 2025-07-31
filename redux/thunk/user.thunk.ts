import { axiosInstance } from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import qs from "qs";

export const getUsersThunk = createAsyncThunk(
  "getUsersThunk",
  async (query: { searchTerm?: string; limit?: number }, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/user", {
        params: {
          searchTerm: query.searchTerm,
          limit: query.limit,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch users");
    }
  }
);
