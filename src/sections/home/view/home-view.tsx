import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  useMediaQuery,
} from "@mui/material";

import palette from "src/theme/palette";

const { primary, accent, grey } = palette;

export default function HomeView() {
  const navigate = useNavigate();
  const mdDown = useMediaQuery("(max-width:900px)");

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f7fa",
        height: "100vh",
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          px: 4,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#fff",
          borderBottom: `1px solid ${grey[200]}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              background: `linear-gradient(135deg, ${primary.main} 0%, ${primary.light} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              S
            </Typography>
          </Box>

          {!mdDown ? (
            <Box>
              <Typography
                sx={{
                  color: primary.main,
                  fontWeight: 700,
                  fontSize: 18,
                  lineHeight: 1.1,
                }}
              >
                SPS Group
              </Typography>
              <Typography
                sx={{ color: grey[500], fontSize: 11, letterSpacing: 1 }}
              >
                A melhor consultoria SAP
              </Typography>
            </Box>
          ) : null}
        </Stack>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 10,
          height: "80vh",
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 2,
              py: 0.75,
              mb: 4,
              borderRadius: "20px",
              border: `1px solid ${grey[300]}`,
              bgcolor: "#fff",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: accent.main,
                mr: 1,
              }}
            />
            <Typography sx={{ color: grey[600], fontSize: 13 }}>
              Sistema de Gestão de Usuários
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              color: primary.main,
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 3,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Bem-vindo ao sistema de usuários da{" "}
            <Box component="span" sx={{ color: accent.main }}>
              SPS Group
            </Box>
            !
          </Typography>

          <Typography
            sx={{
              color: grey[600],
              fontSize: { xs: "1rem", md: "1.15rem" },
              mb: 6,
              maxWidth: 560,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Realize o login para acessar todos os conteúdos e funcionalidades da
            plataforma.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/auth/login")}
            sx={{
              bgcolor: primary.main,
              color: "#fff",
              px: 5,
              py: 1.5,
              fontSize: 16,
              fontWeight: 700,
              borderRadius: "30px",
              boxShadow: `0 4px 20px rgba(0,51,153,0.25)`,
              "&:hover": {
                bgcolor: primary.dark,
                boxShadow: `0 6px 24px rgba(0,51,153,0.35)`,
              },
            }}
          >
            Fazer Login
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2.5,
          textAlign: "center",
          borderTop: `1px solid ${grey[200]}`,
          bgcolor: "#fff",
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: grey[500], fontSize: 13 }}>
          © {new Date().getFullYear()} SPS Group. Todos os direitos reservados.
        </Typography>
      </Box>
    </Stack>
  );
}
