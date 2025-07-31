import { axiosInstance } from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTaskByIdThunk = createAsyncThunk(
  "getTaskByIdThunk",
  async (taskId: number, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`task/${taskId}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch task"
      );
    }
  }
);

export const getTasksThunk = createAsyncThunk(
  "getTasksThunk",
  async (
    params: {
      pageNumber: number;
      limit?: number;
      startTime?: Date;
      endTime?: Date;
      searchTerm?: string;
      filterType?: string;
    },
    thunkAPI
  ) => {
    try {
      const response = await axiosInstance.get("task", {
        params: {
          limit: 10,
          offset: params.pageNumber - 1,
          startTime: params.startTime,
          endTime: params.endTime,
          searchTerm: params.searchTerm,
          filterType: params.filterType,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch tasks"
      );
    }
  }
);

export const createAssignTaskThunk = createAsyncThunk(
  "createAssignTaskThunk",
  async (data: { taskId: number; userId: number }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        `/assigned-task/${data.taskId}/userId/${data.userId}`
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to assign task"
      );
    }
  }
);

export const getUserFromAssignedTaskThunk = createAsyncThunk(
  "getUserFromAssignedTaskThunk",
  async (taskId: number, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/assigned-task/${taskId}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch assigned users"
      );
    }
  }
);
