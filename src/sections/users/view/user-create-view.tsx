import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";

import { useAuthContext } from "src/auth/hooks";
import { BooleanPermissionGuard } from "src/auth/guard";
import { registerApi } from "src/services/api";
import { paths } from "src/routes/paths";
import { registerSchema, RegisterFormValues } from "../register.schema";

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const { user: authUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isAdmin = authUser?.type === "admin";

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormValues>,
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError("");
    try {
      await registerApi(data.name, data.email, data.password);
      enqueueSnackbar("Usuário cadastrado com sucesso!", { variant: "success" });
      navigate(paths.dashboard.root);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao cadastrar usuário.";
      enqueueSnackbar(msg, { variant: "error" });
      setError(msg);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(paths.auth.jwt.login);
  };

  return (
    <BooleanPermissionGuard canView={isAdmin}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate(paths.dashboard.root)}
              sx={{ mr: 1 }}
            >
              Voltar
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Cadastrar Usuário
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Sair
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4, maxWidth: 480, mx: "auto", mt: 4 }}>
          <Card elevation={1} sx={{ borderRadius: 5, p: 4 }}>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
              Novo Usuário
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  label="Nome"
                  fullWidth
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />

                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <TextField
                  label="Senha"
                  type="password"
                  fullWidth
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
                >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </Stack>
            </Box>
          </Card>
        </Box>
      </Box>
    </BooleanPermissionGuard>
  );
}
