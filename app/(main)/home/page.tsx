"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getTasksThunk } from "@/redux/thunk/task.thunk";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import debounce from "lodash/debounce";
import SearchIcon from "@mui/icons-material/Search";

import { useRouter } from "next/navigation";
import CreateTaskDialog from "@/components/createTaskDialog";
import { getUsersThunk } from "@/redux/thunk/user.thunk";

interface User {
  uid: number;
  username: string;
  email: string;
}

const Home = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { tasks, count } = useAppSelector((state) => state.task);
  const { users } = useAppSelector((state) => state.user);

  const [page, setPage] = useState(1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [filterType, setFilterType] = useState("myCreation");
  const [open, setOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [isLoadingDebounce, setIsLoadingDebounce] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<User[]>([]);

  const handleClose = () => {
    setOpen(false);
  };

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

  const debouncedSearchUser = useMemo(
    () =>
      debounce(async (value: string) => {
        await dispatch(getUsersThunk({ searchTerm: value, limit: 10 }));
      }, 500),
    [dispatch, startTime, endTime, page, filterType]
  );

  const handleInputChange = (event: any, value: string) => {
    setInputValue(value);
    if (value) {
      setIsLoadingDebounce(false);
      debouncedSearchUser(value);
    } else {
      setIsLoadingDebounce(true);
    }
  };

  const handleFilter = async () => {
    await dispatch(
      getTasksThunk({
        limit: 10,
        pageNumber: page,
        filterType,
        userIds: selectedUser.map((user) => user.uid),
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      })
    );
  };

  return (
    <Container>
      <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
        <TextField
          label="Search Tasks"
          variant="outlined"
          fullWidth
          onChange={(e) => debouncedSearch(e.target.value)}
          margin="normal"
        />

        <TextField
          select
          label="Filter Type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="myCreation">My Creation</MenuItem>
          <MenuItem value="assignedTask">Assigned Task</MenuItem>
        </TextField>

        <Box>
          <Autocomplete
            disablePortal
            fullWidth
            sx={{ minWidth: 400 }}
            options={users}
            getOptionLabel={(option) => option.username}
            loading={isLoadingDebounce}
            loadingText={<CircularProgress size={18} />}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            open={usersOpen}
            onOpen={() => {
              if (inputValue) setUsersOpen(true);
            }}
            onClose={() => {
              setIsLoadingDebounce(true);
              setUsersOpen(false);
            }}
            forcePopupIcon={false}
            noOptionsText="No user found :("
            onChange={(event, value) => {
              if (value) {
                if (!selectedUser.some((user) => user.uid === value.uid)) {
                  setSelectedUser((prev) => [...prev, value]);
                }
                setUsersOpen(true);
              } else {
                setUsersOpen(false);
              }
              setIsLoadingDebounce(true);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Filter by user..."
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Divider orientation="vertical" flexItem />

          {selectedUser.map((user) => (
            <Chip
              key={user.uid}
              label={user.username}
              sx={{ m: 0.5 }}
              onDelete={() =>
                setSelectedUser((prev) =>
                  prev.filter((u) => u.uid !== user.uid)
                )
              }
            />
          ))}

          {selectedUser.length > 0 && (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleFilter}
            >
              set
            </Button>
          )}
        </Box>

        <TextField
          type="datetime-local"
          label="Start Time"
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          type="datetime-local"
          label="End Time"
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ height: "100%" }}
        >
          Create Task
        </Button>
        <CreateTaskDialog open={open} onClose={handleClose} />
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
