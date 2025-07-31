import z from "zod";
import { RecipeCategory } from "./enum";

export const SignUpSchema = z.object({
  username: z.string().nonempty("username is required!"),
  email: z.email("invalid email address!"),
  password: z
    .string()
    .nonempty("password is required!")
    .min(8, "password must be at least of 8 characters"),
});

export type ZSignUpSchema = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.email("invalid email address!"),
  password: z
    .string()
    .nonempty("password is required!")
    .min(8, "password must be at least of 8 characters"),
});

export type ZSignInSchema = z.infer<typeof SignInSchema>;

export const taskSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    startTime: z
      .string()
      .min(1, "Start time is required")
      .refine(
        (val) => {
          const selected = new Date(val);
          const now = new Date();
          return selected >= now;
        },
        {
          message: "Start time cannot be in the past",
        }
      ),
    endTime: z.string().min(1, "End time is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return end >= start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type TaskFormType = z.infer<typeof taskSchema>;
