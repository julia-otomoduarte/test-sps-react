import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';
import { registerSchema, RegisterFormValues } from '../register.schema';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormValues>,
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError('');
    try {
      await register(data.name, data.email, data.password);
      navigate(paths.auth.jwt.login);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar cadastro');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
      }}
    >
      <Card sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Stack spacing={3}>
          <Typography variant="h4" textAlign="center" fontWeight={700}>
            Criar conta
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Nome"
                fullWidth
                autoComplete="name"
                {...registerField('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                autoComplete="email"
                {...registerField('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Senha"
                type="password"
                fullWidth
                autoComplete="new-password"
                {...registerField('password')}
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
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </Stack>
          </Box>

          <Typography textAlign="center" variant="body2">
            Já tem uma conta?{' '}
            <Link component={RouterLink} to={paths.auth.jwt.login} underline="hover">
              Fazer login
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
