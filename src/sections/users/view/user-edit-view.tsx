import { useState, useEffect } from "react";
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
import { Icon } from "@iconify/react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";

import { useAuthContext } from "src/auth/hooks";
import { BooleanPermissionGuard } from "src/auth/guard";
import {
  getUserApi,
  updateUserApi,
  uploadUserDocumentApi,
} from "src/services/api";
import { paths } from "src/routes/paths";
import { translateUserType } from "src/utils/translate-user-type";
import { userEditSchema, UserEditFormValues } from "../user-edit.schema";
import { USER_TYPE_OPTIONS } from "../register.schema";
import { RHFUploadAvatar } from "src/components/upload/input-upload-avatar";
import { UploadDocument } from "src/components/upload/input-upload-documents";
import { HOST_API } from "src/config-global";
import { Avatar } from "@mui/material";
// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const { user: authUser, logout, refreshUser } = useAuthContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const canEdit =
    authUser?.type === "admin" || String(authUser?.id) === String(id);
  const isAdmin = authUser?.type === "admin";

  const methods = useForm<UserEditFormValues>({
    resolver: yupResolver(userEditSchema) as Resolver<UserEditFormValues>,
    defaultValues: { documents: [] },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });

  useEffect(() => {
    getUserApi(id)
      .then((res) =>
        reset({
          name: res.data.name,
          email: res.data.email,
          type: res.data.type,
          profileImage: res.data.photo ?? undefined,
          documents:
            res.data.documents?.map((doc) => ({
              file: undefined,
              existingUrl: doc,
            })) ?? [],
        }),
      )
      .catch((err) =>
        setPageError(err.response?.data?.message || "Erro ao carregar usuário"),
      )
      .finally(() => setPageLoading(false));
  }, [id, reset]);

  const onSubmit = async (data: UserEditFormValues) => {
    try {
      if (data.profileImage && typeof data.profileImage !== "string") {
        await uploadUserDocumentApi(id, data.profileImage as File);
      }

      for (const item of data.documents ?? []) {
        if (item.file) {
          await uploadUserDocumentApi(id, item.file);
        }
      }
      await updateUserApi(id, {
        name: data.name,
        email: data.email,
        ...(isAdmin && data.type && { type: data.type }),
        documents: data.documents
          ?.filter((doc) => !doc.file)
          .map((doc) => doc.existingUrl)
          .filter(Boolean) as string[] | undefined,
      });

      enqueueSnackbar("Salvo com sucesso!", { variant: "success" });
      if (String(authUser?.id) === String(id)) {
        await refreshUser();
      }
      navigate(paths.dashboard.user.detail(id));
    } catch (err: any) {
      enqueueSnackbar(
        err.response?.data?.message || "Erro ao salvar alterações",
        { variant: "error" },
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(paths.auth.jwt.login);
  };

  return (
    <BooleanPermissionGuard
      isLoading={pageLoading}
      canView={canEdit && !pageError}
    >
      <FormProvider {...methods}>
        <Box sx={{ minHeight: "100vh" }}>
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
                color="secondary"
                variant="contained"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </Toolbar>
          </AppBar>

          <Box sx={{ p: 4, maxWidth: 520, mx: "auto" }}>
            <Card elevation={1} sx={{ borderRadius: 5 }}>
              <CardContent>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={3}>
                    <RHFUploadAvatar
                      name="profileImage"
                      helperText={errors.profileImage?.message}
                    />

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

                    {isAdmin && (
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth disabled={isSubmitting}>
                            <InputLabel id="type-label">
                              Tipo de conta
                            </InputLabel>
                            <Select
                              labelId="type-label"
                              label="Tipo de conta"
                              {...field}
                              value={field.value ?? ""}
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
                    )}

                    <Divider />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" color="text.secondary">
                        Documentos
                      </Typography>
                      <Button
                        size="small"
                        startIcon={
                          <Icon icon="solar:paperclip-bold" width={16} />
                        }
                        onClick={() => append({ file: undefined })}
                      >
                        Adicionar
                      </Button>
                    </Stack>

                    {fields.map((item, index) => (
                      <UploadDocument
                        key={item.id}
                        file={methods.watch(`documents.${index}.file`)}
                        existingUrl={item.existingUrl} // ← usar item diretamente
                        onChange={(file) =>
                          methods.setValue(`documents.${index}.file`, file)
                        }
                        onRemove={() => remove(index)}
                        error={errors.documents?.[index]?.file?.message}
                      />
                    ))}

                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                    >
                      <Button
                        onClick={() =>
                          navigate(paths.dashboard.user.detail(id))
                        }
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
      </FormProvider>
    </BooleanPermissionGuard>
  );
}
