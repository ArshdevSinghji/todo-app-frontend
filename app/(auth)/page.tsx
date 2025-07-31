"use client";

import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";

import { SignInSchema, ZSignInSchema } from "@/utils/zod";
import { useAppDispatch } from "@/redux/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { divider } from "../../style/style";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInThunk } from "@/redux/thunk/authentication.thunk";

const SignIn = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ZSignInSchema>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: ZSignInSchema) => {
    const result = await dispatch(
      signInThunk({
        email: data.email,
        password: data.password,
      })
    );

    if (result.payload.statusCode === 400) {
      toast.error(`${result.payload.message}`);
    } else {
      toast.success("Successfully signed in!");
      router.push("/home");
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        maxWidth: "20rem",
        p: 4,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Stack
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        alignItems={"center"}
        gap={2}
        noValidate
      >
        <Typography variant="subtitle2">Put in your credentials</Typography>

        <TextField
          required
          {...register("email")}
          name="email"
          label="Email"
          type="email"
          size="small"
          error={!!errors.email}
          helperText={errors?.email?.message}
          fullWidth
        />

        <FormControl size="small" variant="outlined">
          <InputLabel
            htmlFor="outlined-adornment-password"
            error={!!errors.password}
          >
            Password
          </InputLabel>
          <OutlinedInput
            required
            {...register("password")}
            name="password"
            error={!!errors.password}
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {errors?.password?.message && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
              {errors.password.message}
            </Typography>
          )}
        </FormControl>

        <Button
          disabled={isSubmitting}
          type="submit"
          variant="outlined"
          size="small"
          fullWidth
        >
          {isSubmitting ? <CircularProgress /> : "Sign in"}
        </Button>

        <Divider sx={divider}>
          <Typography variant="caption">OR</Typography>
        </Divider>

        <Button
          disabled={isSubmitting}
          type="submit"
          variant="contained"
          startIcon={<GoogleIcon />}
          size="small"
          fullWidth
        >
          sign in with Google
        </Button>

        <Typography variant="subtitle2">
          Don't have an account? <Link href={"/signUp"}>SignUp</Link>
        </Typography>
      </Stack>
    </Paper>
  );
};

export default SignIn;
