import { createSlice } from "@reduxjs/toolkit";
import {
  createAssignTaskThunk,
  getTaskByIdThunk,
  getTasksThunk,
  getUserFromAssignedTaskThunk,
} from "../thunk/task.thunk";

interface User {
  uid: string;
  name: string;
  email: string;
}

interface AssignedTask {
  assignedTaskId: number;
  isCompleted: string;
  user: {
    uid: number;
    username: string;
    email: string;
  };
  task: {
    taskId: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
  };
}

interface Task {
  taskId: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  user: User;
  assignedTask: AssignedTask[];
}

interface TaskState {
  count: number;
  tasks: Task[];
  taskById: Task | null;
  assignedTask: AssignedTask[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  count: 0,
  tasks: [],
  assignedTask: [],
  taskById: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.count = action.payload.total;
      })
      .addCase(getTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "An error occurred";
      });
    builder
      .addCase(getTaskByIdThunk.fulfilled, (state, action) => {
        state.taskById = action.payload;
      })
      .addCase(getTaskByIdThunk.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch task by ID";
      })
      .addCase(getTaskByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
    builder
      .addCase(createAssignTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createAssignTaskThunk.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to assign task";
      })
      .addCase(createAssignTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
    builder
      .addCase(getUserFromAssignedTaskThunk.fulfilled, (state, action) => {
        state.assignedTask = action.payload;
      })
      .addCase(getUserFromAssignedTaskThunk.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Failed to fetch assigned users";
      });
  },
});

export default taskSlice.reducer;
