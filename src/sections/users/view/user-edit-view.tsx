import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

import { useAuthContext } from "src/auth/hooks";
import { BooleanPermissionGuard } from "src/auth/guard";
import { getUserApi, updateUserApi } from "src/services/api";
import { paths } from "src/routes/paths";
import { userEditSchema, UserEditFormValues } from "../user-edit.schema";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const { user: authUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const canEdit =
    authUser?.type === "admin" || String(authUser?.id) === String(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserEditFormValues>({
    resolver: yupResolver(userEditSchema) as Resolver<UserEditFormValues>,
  });

  useEffect(() => {
    getUserApi(id)
      .then((res) => reset({ name: res.data.name, email: res.data.email }))
      .catch((err) =>
        setPageError(err.response?.data?.message || "Erro ao carregar usuário"),
      )
      .finally(() => setPageLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: UserEditFormValues) => {
    try {
      await updateUserApi(id, { name: data.name, email: data.email });
      enqueueSnackbar("Salvo com sucesso!", { variant: "success" });
      navigate(paths.dashboard.user.detail(id));
    } catch (err: any) {
      enqueueSnackbar(
        err.response?.data?.message || "Erro ao salvar alterações",
        {
          variant: "error",
        },
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(paths.auth.jwt.login);
  };

  // ----------------------------------------------------------------------

  return (
    <BooleanPermissionGuard
      isLoading={pageLoading}
      canView={canEdit && !pageError}
    >
      <Box sx={{ minHeight: "100vh" }}>
        {/* Header */}
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate(paths.dashboard.user.detail(id))}
              sx={{ mr: 1 }}
            >
              Voltar
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Editar Usuário
            </Typography>
            <Button
              color="secondary"
              variant="contained"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ p: 4, maxWidth: 520, mx: "auto" }}>
          <Card elevation={1} sx={{ borderRadius: 5 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <TextField
                    label="Nome"
                    fullWidth
                    disabled={isSubmitting}
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />

                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    disabled={isSubmitting}
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      onClick={() => navigate(paths.dashboard.user.detail(id))}
                      disabled={isSubmitting}
                      variant="outlined"
                    >
                      Cancelar
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Salvando..." : "Salvar"}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </BooleanPermissionGuard>
  );
}
