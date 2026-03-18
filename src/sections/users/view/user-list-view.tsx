import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";

import { useAuthContext } from "src/auth/hooks";
import { getUsersApi, User } from "src/services/api";
import { paths } from "src/routes/paths";
import { translateUserType } from "src/utils/translate-user-type";
import { Avatar, Stack } from "@mui/material";
import { HOST_API } from "src/config-global";
// ----------------------------------------------------------------------

export default function UserListView() {
  const { user: authUser, logout } = useAuthContext();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getUsersApi()
      .then((res) => setUsers(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Erro ao carregar usuários"),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate(paths.auth.jwt.login);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              mr: 2,
            }}
          >
            <Avatar
              src={authUser?.photo ? `${HOST_API}${authUser.photo}` : undefined}
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

          <Button onClick={handleLogout} variant="contained" color="secondary">
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: 1200, mx: "auto", mt: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" fontWeight={600} color="textPrimary">
            Lista de Usuários
          </Typography>

          {authUser?.type === "admin" && (
            <Button
              variant="contained"
              onClick={() => navigate(paths.dashboard.user.create)}
            >
              Cadastrar Usuário
            </Button>
          )}
        </Stack>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <TableContainer
            component={Paper}
            elevation={1}
            sx={{ borderRadius: 5 }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{ "& th": { fontWeight: 600, bgcolor: "grey.50" } }}
                >
                  <TableCell>Foto</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tipo</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {displayedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(paths.dashboard.user.detail(user.id))
                    }
                  >
                    <TableCell>
                      <Avatar
                        src={
                          user.photo ? `${HOST_API}${user.photo}` : undefined
                        }
                        alt={user.name}
                        sx={{ width: 36, height: 36 }}
                      >
                        {!user.photo && user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell
                      sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                    >
                      {user.id}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={translateUserType(user.type)}
                        size="small"
                        color={user.type === "admin" ? "primary" : "default"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Itens por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} de ${count}`
              }
            />
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
