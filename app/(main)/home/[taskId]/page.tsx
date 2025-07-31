"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  getTaskByIdThunk,
  getUserFromAssignedTaskThunk,
} from "@/redux/thunk/task.thunk";
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddRecipeDialog from "@/components/searchUserDialog";

const Task = () => {
  const { taskId } = useParams();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter();

  const dispatch = useAppDispatch();
  const { taskById, assignedTask } = useAppSelector((state) => state.task);

  useEffect(() => {
    const fetchTask = async () => {
      await dispatch(getTaskByIdThunk(Number(taskId)));
      await dispatch(getUserFromAssignedTaskThunk(Number(taskId)));
    };
    fetchTask();
  }, [dispatch, taskId]);

  return (
    <Container>
      {taskById ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.back()}
            sx={{ mb: 2 }}
            size="small"
          >
            Back to Tasks
          </Button>
          <Typography variant="h4" gutterBottom>
            {taskById.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {taskById.description}
          </Typography>
          <Typography variant="body2" gutterBottom>
            From:{" "}
            <strong>{new Date(taskById.startTime).toLocaleString()}</strong> To:{" "}
            <strong>{new Date(taskById.endTime).toLocaleString()}</strong>
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Assigned Users:
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => handleOpen()}
            size="small"
            sx={{ my: 2 }}
          >
            Assign User
          </Button>
          <Box>
            {assignedTask && assignedTask.length > 0 ? (
              <List>
                {assignedTask.map((assigned) => (
                  <ListItem key={assigned.user.uid}>
                    <ListItemText
                      primary={`${assigned.user.username} - Completed: ${assigned.isCompleted}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">No assigned users.</Typography>
            )}
          </Box>
        </Paper>
      ) : (
        <Typography>Loading...</Typography>
      )}
      <AddRecipeDialog
        taskId={Number(taskId)}
        open={open}
        handleClose={handleClose}
      />
    </Container>
  );
};

export default Task;
