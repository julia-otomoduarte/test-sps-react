import { useState } from "react";
import {
  useForm,
  Controller,
  type Resolver,
  useFieldArray,
  FormProvider,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link } from "react-router-dom";
import { useSnackbar } from "notistack";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useAuthContext } from "src/auth/hooks";
import { BooleanPermissionGuard } from "src/auth/guard";
import { registerApi, uploadUserDocumentApi } from "src/services/api";
import { paths } from "src/routes/paths";
import { translateUserType } from "src/utils/translate-user-type";
import {
  registerSchema,
  RegisterFormValues,
  USER_TYPE_OPTIONS,
} from "../register.schema";
import { RHFUploadAvatar } from "src/components/upload/input-upload-avatar";
import { UploadDocument } from "src/components/upload/input-upload-documents";
import { Avatar } from "@mui/material";
import { HOST_API } from "src/config-global";

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const { user: authUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isAdmin = authUser?.type === "admin";

  const [error, setError] = useState("");

  const methods = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema) as Resolver<RegisterFormValues>,
    defaultValues: { type: "user" },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  const handleAddDocument = () => {
    append({ file: undefined });
  };

  const handleRemoveDocument = (index: number) => {
    remove(index);
  };

  const handleUploadImageAndDocuments = async (
    userId: string,
    data: RegisterFormValues,
  ) => {
    const uploadPromises = [];

    if (data.profileImage) {
      uploadPromises.push(uploadUserDocumentApi(userId, data.profileImage));
    }

    data.documents?.forEach((doc) => {
      if (doc.file) {
        uploadPromises.push(uploadUserDocumentApi(userId, doc.file));
      }
    });

    await Promise.all(uploadPromises);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setError("");
    const image = data.profileImage;
    const documents = data.documents?.map((doc) => doc.file).filter(Boolean) as
      | File[]
      | undefined;

    try {
      const response = await registerApi(
        data.name,
        data.email,
        data.password,
        data.type,
      );

      if (response?.data?.id && (image || documents?.length)) {
        await handleUploadImageAndDocuments(response.data.id, data);
      }

      enqueueSnackbar("Usuário cadastrado com sucesso!", {
        variant: "success",
      });
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
      <FormProvider {...methods}>
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
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mr: 2 }}
              >
                <Avatar
                  src={
                    authUser?.photo ? `${HOST_API}${authUser.photo}` : undefined
                  }
                  alt={authUser?.name}
                  sx={{ width: 32, height: 32 }}
                >
                  {!authUser?.photo && authUser?.name
                    ? authUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : null}
                </Avatar>
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

          <Box sx={{ p: 4, maxWidth: 480, mx: "auto", mt: 4 }}>
            <Card elevation={1} sx={{ borderRadius: 5, p: 4 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                Novo Usuário
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <RHFUploadAvatar
                    name="profileImage"
                    helperText={errors.profileImage?.message}
                  />
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

                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="type-label">Tipo de conta</InputLabel>
                        <Select
                          labelId="type-label"
                          label="Tipo de conta"
                          {...field}
                        >
                          {USER_TYPE_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Documentos
                    </Typography>
                    <Button size="small" onClick={handleAddDocument}>
                      + Adicionar
                    </Button>
                  </Stack>

                  {fields.map((item, index) => (
                    <UploadDocument
                      key={item.id}
                      file={methods.watch(`documents.${index}.file`)}
                      onChange={(file) =>
                        methods.setValue(`documents.${index}.file`, file)
                      }
                      onRemove={() => handleRemoveDocument(index)}
                      error={errors.documents?.[index]?.file?.message}
                    />
                  ))}

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
      </FormProvider>
    </BooleanPermissionGuard>
  );
}
