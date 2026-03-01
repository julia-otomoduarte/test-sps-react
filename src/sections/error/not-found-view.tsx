import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Icon } from "@iconify/react";

import { useAuthContext } from "src/auth/hooks";
import { paths } from "src/routes/paths";
import palette from "src/theme/palette";

// ----------------------------------------------------------------------

const bounceVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

// ----------------------------------------------------------------------

export default function NotFoundView() {
  const navigate = useNavigate();
  const { authenticated } = useAuthContext();
  const { primary, grey } = palette;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f7fa",
        px: 2,
      }}
    >
      <Stack alignItems="center" textAlign="center" spacing={3} maxWidth={480}>
        <motion.div variants={bounceVariants} initial="initial" animate="animate">
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ color: primary.main }}
          >
            Desculpe, página não encontrada!
          </Typography>
        </motion.div>

        <motion.div variants={bounceVariants} initial="initial" animate="animate">
          <Typography sx={{ color: grey[500], fontSize: "1rem", lineHeight: 1.7 }}>
            Lamentamos, mas não conseguimos encontrar a página que procura.
            Talvez você tenha digitado incorretamente o URL. Certifique-se de
            verificar sua ortografia.
          </Typography>
        </motion.div>

        <motion.div variants={bounceVariants} initial="initial" animate="animate">
          <Icon
            icon="streamline-sharp:browser-error-404"
            style={{ fontSize: 200, color: primary.main }}
          />
        </motion.div>

        <motion.div variants={bounceVariants} initial="initial" animate="animate">
          <Button
            size="large"
            variant="contained"
            onClick={() => navigate(authenticated ? paths.dashboard.root : "/")}
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
            Volte à Tela Inicial
          </Button>
        </motion.div>
      </Stack>
    </Box>
  );
}
