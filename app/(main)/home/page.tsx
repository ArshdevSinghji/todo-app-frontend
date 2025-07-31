"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getTasksThunk } from "@/redux/thunk/task.thunk";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { tasks, count } = useAppSelector((state) => state.task);

  const [page, setPage] = useState(1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [filterType, setFilterType] = useState("myCreation");

  useEffect(() => {
    const fetchTasks = async () => {
      await dispatch(getTasksThunk({ pageNumber: page, limit: 10 }));
    };
    fetchTasks();
  }, [dispatch, page]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        await dispatch(
          getTasksThunk({
            searchTerm: value,
            limit: 10,
            pageNumber: page,
            filterType,
            startTime: startTime ? new Date(startTime) : undefined,
            endTime: endTime ? new Date(endTime) : undefined,
          })
        );
      }, 500),
    [dispatch, startTime, endTime, page, filterType]
  );

  return (
    <Container>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          label="Search Tasks"
          variant="outlined"
          fullWidth
          onChange={(e) => debouncedSearch(e.target.value)}
          margin="normal"
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="filter-type-label">Type</InputLabel>
          <Select
            labelId="filter-type-label"
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="myCreation">My Creation</MenuItem>
            <MenuItem value="assignedTask">Assigned Task</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Start Time"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          sx={{ minWidth: 150 }}
        />
        <TextField
          label="End Time"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          sx={{ minWidth: 150 }}
        />
      </Box>

      {tasks.map((task) => {
        return (
          <Paper
            variant="outlined"
            key={task.taskId}
            sx={{
              mb: 2,
              p: 2,
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#f5f5f5",
                transform: "scale(1.02)",
                transition: "transform 0.2s ease-in-out",
              },
            }}
            onClick={() => router.push(`/home/${task.taskId}`)}
          >
            <Typography variant="h5" component="div" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {task.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              From: <strong>{new Date(task.startTime).toLocaleString()}</strong>{" "}
              To: <strong>{new Date(task.endTime).toLocaleString()}</strong>
            </Typography>
          </Paper>
        );
      })}
      <Pagination
        count={Math.ceil(count / 10)}
        color="primary"
        variant="outlined"
        shape="rounded"
        page={page}
        onChange={(event, value) => setPage(value)}
        sx={{ float: "right", marginTop: "20px" }}
      />
    </Container>
  );
};

export default Home;
