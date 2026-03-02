import { useState, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";

import Box from "@mui/material/Box";

import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { useAuthContext } from "src/auth/hooks";
import { BooleanPermissionGuard } from "src/auth/guard";
import {
  getUserApi,
  deleteUserApi,
  updatePasswordApi,
  User,
} from "src/services/api";
import { paths } from "src/routes/paths";
import { translateUserType } from "src/utils/translate-user-type";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "../change-password.schema";
import { Icon } from "@iconify/react";

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserDetailView({ id }: Props) {
  const { user: authUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState<User | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [pwOpen, setPwOpen] = useState(false);

  const canManage =
    authUser?.type === "admin" || String(authUser?.id) === String(id);

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    reset: resetPw,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(
      changePasswordSchema,
    ) as Resolver<ChangePasswordFormValues>,
  });

  useEffect(() => {
    getUserApi(id)
      .then((res) => setUser(res.data))
      .catch((err) =>
        setPageError(err.response?.data?.message || "Usuário não encontrado"),
      )
      .finally(() => setPageLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      await deleteUserApi(id);
      enqueueSnackbar("Usuário deletado com sucesso!", { variant: "success" });
      setDeleteOpen(false);
      navigate(paths.dashboard.root);
    } catch (err: any) {
      enqueueSnackbar(
        err.response?.data?.message || "Erro ao deletar usuário",
        { variant: "error" },
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const onSubmitPw = async (data: ChangePasswordFormValues) => {
    try {
      await updatePasswordApi(id, data.oldPassword, data.newPassword);
      enqueueSnackbar("Senha alterada com sucesso!", { variant: "success" });
      setPwOpen(false);
      resetPw();
    } catch (err: any) {
      enqueueSnackbar(err.response?.data?.message || "Erro ao alterar senha", {
        variant: "error",
      });
    }
  };

  const closePwDialog = () => {
    if (pwSubmitting) return;
    setPwOpen(false);
    resetPw();
  };

  const handleLogout = async () => {
    await logout();
    navigate(paths.auth.jwt.login);
  };

  return (
    <BooleanPermissionGuard isLoading={pageLoading} canView={!pageError}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
        {/* Header */}
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
              Detalhe do Usuário
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mr: 2 }}
            >
              <Typography
                variant="body2"
                component={Link}
                to={paths.dashboard.user.detail(String(authUser?.id))}
                sx={{
                  opacity: 0.85,
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {authUser?.name}
              </Typography>
              <Chip
                label={translateUserType(authUser?.type ?? "")}
                color="info"
              />
            </Stack>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ p: 4, maxWidth: 640, mx: "auto" }}>
          <Card elevation={1} sx={{ borderRadius: 5 }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h5" fontWeight={600}>
                  {user?.name}
                </Typography>

                <Divider />

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography color="text.secondary" width={80}>
                    ID:
                  </Typography>
                  <Typography variant="body2" fontFamily="monospace">
                    {user?.id}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography color="text.secondary" width={80}>
                    Email:
                  </Typography>
                  <Typography>{user?.email}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography color="text.secondary" width={80}>
                    Tipo:
                  </Typography>
                  <Chip
                    label={translateUserType(user?.type ?? "")}
                    size="small"
                    color={user?.type === "admin" ? "primary" : "default"}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {canManage && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Button
                variant="contained"
                onClick={() => navigate(paths.dashboard.user.edit(id))}
                startIcon={<Icon icon="boxicons:edit-filled" />}
              >
                Editar
              </Button>

              <Button
                variant="outlined"
                onClick={() => setPwOpen(true)}
                startIcon={<Icon icon="teenyicons:password-solid" />}
              >
                Trocar Senha
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteOpen(true)}
                startIcon={<Icon icon="material-symbols:delete" />}
              >
                Deletar
              </Button>
            </Stack>
          )}
        </Box>

        {/* ------- Dialog: Confirmar Exclusão ------- */}
        <Dialog
          open={deleteOpen}
          onClose={() => !deleteLoading && setDeleteOpen(false)}
        >
          <DialogTitle>Confirmar exclusão</DialogTitle>

          <DialogContent>
            <Typography>
              Tem certeza que deseja excluir o usuário{" "}
              <strong>{user?.name}</strong>? Esta ação não pode ser desfeita.
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setDeleteOpen(false)}
              disabled={deleteLoading}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deletando..." : "Confirmar"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ------- Dialog: Trocar Senha ------- */}
        <Dialog open={pwOpen} onClose={closePwDialog}>
          <DialogTitle>Trocar Senha</DialogTitle>

          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1, minWidth: 340 }}>
              <Box
                component="form"
                id="change-password-form"
                onSubmit={handleSubmitPw(onSubmitPw)}
              >
                <Stack spacing={2}>
                  <TextField
                    label="Senha Atual"
                    type="password"
                    fullWidth
                    disabled={pwSubmitting}
                    {...registerPw("oldPassword")}
                    error={!!pwErrors.oldPassword}
                    helperText={pwErrors.oldPassword?.message}
                  />
                  <TextField
                    label="Nova Senha"
                    type="password"
                    fullWidth
                    disabled={pwSubmitting}
                    {...registerPw("newPassword")}
                    error={!!pwErrors.newPassword}
                    helperText={pwErrors.newPassword?.message}
                  />
                </Stack>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={closePwDialog}
              disabled={pwSubmitting}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="change-password-form"
              variant="contained"
              disabled={pwSubmitting}
            >
              {pwSubmitting ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </BooleanPermissionGuard>
  );
}
