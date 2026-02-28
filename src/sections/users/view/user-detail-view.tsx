import { useState, useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useAuthContext } from 'src/auth/hooks';
import { getUserApi, deleteUserApi, updatePasswordApi, User } from 'src/services/api';
import { paths } from 'src/routes/paths';
import { changePasswordSchema, ChangePasswordFormValues } from '../change-password.schema';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserDetailView({ id }: Props) {
  const { user: authUser, logout } = useAuthContext();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  // --- Dialog: Deletar ---
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // --- Dialog: Trocar Senha ---
  const [pwOpen, setPwOpen] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const canManage =
    authUser?.type === 'admin' || String(authUser?.id) === String(id);

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    reset: resetPw,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema) as Resolver<ChangePasswordFormValues>,
  });

  useEffect(() => {
    getUserApi(id)
      .then((res) => setUser(res.data))
      .catch((err) => setPageError(err.response?.data?.message || 'Usuário não encontrado'))
      .finally(() => setPageLoading(false));
  }, [id]);

  // ----------------------------------------------------------------------
  // Handlers

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');

    try {
      await deleteUserApi(id);
      setDeleteOpen(false);
      navigate(paths.dashboard.root);
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Erro ao deletar usuário');
    } finally {
      setDeleteLoading(false);
    }
  };

  const onSubmitPw = async (data: ChangePasswordFormValues) => {
    setPwError('');
    try {
      await updatePasswordApi(id, data.oldPassword, data.newPassword);
      setPwSuccess(true);
      setTimeout(() => {
        setPwOpen(false);
        setPwSuccess(false);
        resetPw();
      }, 1200);
    } catch (err: any) {
      setPwError(err.response?.data?.message || 'Erro ao alterar senha');
    }
  };

  const closePwDialog = () => {
    if (pwSubmitting) return;
    setPwOpen(false);
    setPwError('');
    setPwSuccess(false);
    resetPw();
  };

  const handleLogout = async () => {
    await logout();
    navigate(paths.auth.jwt.login);
  };

  // ----------------------------------------------------------------------
  // Render

  if (pageLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (pageError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{pageError}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate(paths.dashboard.root)}>
          Voltar ao dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Button color="inherit" onClick={() => navigate(paths.dashboard.root)} sx={{ mr: 1 }}>
            ← Voltar
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Detalhe do Usuário
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ p: 4, maxWidth: 640, mx: 'auto' }}>
        <Card elevation={1}>
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
                  label={user?.type}
                  size="small"
                  color={user?.type === 'admin' ? 'primary' : 'default'}
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {canManage && (
          <Stack direction="row" spacing={2} sx={{ mt: 3 }} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={() => navigate(paths.dashboard.user.edit(id))}
            >
              Editar
            </Button>

            <Button variant="outlined" onClick={() => setPwOpen(true)}>
              Trocar Senha
            </Button>

            <Button variant="outlined" color="error" onClick={() => setDeleteOpen(true)}>
              Deletar
            </Button>
          </Stack>
        )}
      </Box>

      {/* ------- Dialog: Confirmar Exclusão ------- */}
      <Dialog open={deleteOpen} onClose={() => !deleteLoading && setDeleteOpen(false)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>

        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o usuário{' '}
            <strong>{user?.name}</strong>? Esta ação não pode ser desfeita.
          </Typography>

          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={deleteLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deletando...' : 'Confirmar exclusão'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ------- Dialog: Trocar Senha ------- */}
      <Dialog open={pwOpen} onClose={closePwDialog}>
        <DialogTitle>Trocar Senha</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 340 }}>
            {pwSuccess ? (
              <Alert severity="success">Senha alterada com sucesso!</Alert>
            ) : (
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
                    {...registerPw('oldPassword')}
                    error={!!pwErrors.oldPassword}
                    helperText={pwErrors.oldPassword?.message}
                  />
                  <TextField
                    label="Nova Senha"
                    type="password"
                    fullWidth
                    disabled={pwSubmitting}
                    {...registerPw('newPassword')}
                    error={!!pwErrors.newPassword}
                    helperText={pwErrors.newPassword?.message}
                  />
                  {pwError && <Alert severity="error">{pwError}</Alert>}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closePwDialog} disabled={pwSubmitting}>
            Cancelar
          </Button>
          {!pwSuccess && (
            <Button
              type="submit"
              form="change-password-form"
              variant="contained"
              disabled={pwSubmitting}
            >
              {pwSubmitting ? 'Salvando...' : 'Confirmar'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
