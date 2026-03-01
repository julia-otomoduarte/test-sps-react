import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

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
import { registerSchema, RegisterFormValues } from "../register.schema";
import palette from "src/theme/palette";

// ----------------------------------------------------------------------

export default function RegisterView() {
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [error, setError] = useState("");

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormValues>,
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError("");
    try {
      await register(data.name, data.email, data.password);
      enqueueSnackbar("Cadastro realizado com sucesso!", {
        variant: "success",
      });
      navigate(paths.auth.jwt.login);
    } catch (err: any) {
      enqueueSnackbar(
        err.response?.data?.message || "Erro ao cadastrar. Tente novamente.",
        { variant: "error" },
      );
      setError(err.response?.data?.message || "Erro ao cadastrar");
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
            Criar conta
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Nome"
                fullWidth
                autoComplete="name"
                {...registerField("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                autoComplete="email"
                {...registerField("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Senha"
                type="password"
                fullWidth
                autoComplete="new-password"
                {...registerField("password")}
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
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </Stack>
          </Box>

          <Typography textAlign="center" variant="body2">
            Já tem uma conta?{" "}
            <Link
              color="primary"
              component={RouterLink}
              to={paths.auth.jwt.login}
              underline="hover"
            >
              Fazer login
            </Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
