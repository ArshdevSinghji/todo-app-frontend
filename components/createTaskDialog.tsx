import { useAppDispatch } from "@/redux/hook";
import { TaskFormType, taskSchema } from "@/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogActions,
  Stack,
  DialogContent,
  Button,
  TextField,
  DialogTitle,
  Dialog,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface TaskData {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: TaskData | null;
}

export default function CreateTaskDialog({
  open,
  onClose,
  initialData,
}: CreateTaskDialogProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormType>({
    resolver: zodResolver(taskSchema),
  });

  const handleCloseDialog = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: TaskFormType) => {
    //todo
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit Task" : "Create New Task"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            <TextField
              label="Title"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
            />
            <TextField
              label="Description"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
            />
            <TextField
              type="datetime-local"
              label="Start Time"
              {...register("startTime")}
              error={!!errors.startTime}
              helperText={errors.startTime?.message}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              type="datetime-local"
              label="End Time"
              {...register("endTime")}
              error={!!errors.endTime}
              helperText={errors.endTime?.message}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Task"
              : "Create Task"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
