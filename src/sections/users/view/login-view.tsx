import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useAuthContext } from "src/auth/hooks";
import { paths } from "src/routes/paths";
import { loginSchema, LoginFormValues } from "../login.schema";
import palette from "src/theme/palette";
import { useSnackbar } from "notistack";

// ----------------------------------------------------------------------

export default function LoginView() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema) as Resolver<LoginFormValues>,
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    try {
      await login(data.email, data.password);
      enqueueSnackbar("Login realizado com sucesso!", { variant: "success" });
      navigate(paths.dashboard.root);
    } catch (err: any) {
      enqueueSnackbar(
        err.response?.data?.message || "Email ou senha inválidos",
        { variant: "error" },
      );
      setError(err.response?.data?.message || "Email ou senha inválidos");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "linear-gradient(rgba(153, 208, 245, 0.5), rgba(153, 208, 245, 0.5)), url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420, borderRadius: 5 }}>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: ".5rem",
            py: 2,
            bgcolor: palette.primary.dark,
            color: "#fff",
            minHeight: "100px",
          }}
        >
          <img src="/logo_sps.png" alt="Logo SPS" height={40} width={40} />
          <Stack
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "end",
            }}
          >
            <Typography fontWeight={600} fontSize="2rem" lineHeight={1}>
              SPS
            </Typography>
            <Typography fontWeight={400} fontSize="1rem">
              Group
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={3} sx={{ p: 4 }}>
          <Typography
            variant="h5"
            textAlign="start"
            fontWeight={700}
            color={palette.grey[700]}
          >
            Entrar
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                autoComplete="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Senha"
                type="password"
                fullWidth
                autoComplete="current-password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                color="primary"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
}
