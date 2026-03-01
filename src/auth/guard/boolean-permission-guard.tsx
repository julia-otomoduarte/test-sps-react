import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { Icon } from "@iconify/react";

// ----------------------------------------------------------------------

type Props = {
  isLoading?: boolean;
  canView?: boolean;
  children: React.ReactNode;
};

export default function BooleanPermissionGuard({
  children,
  canView,
  isLoading,
}: Props) {
  const navigate = useNavigate();

  if (isLoading) return <LinearProgress />;

  if (canView) return <>{children}</>;

  return (
    <Container
      sx={{
        textAlign: "center",
        py: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Box sx={{ color: "text.disabled", mb: 3 }}>
          <Icon icon="qlementine-icons:forbidden-16" width={96} height={96} />
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      >
        <Typography variant="h3" sx={{ mb: 1 }}>
          Permissão negada
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Você não tem permissão para acessar esta página
        </Typography>
        <Button sx={{ mt: 3 }} variant="contained" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </motion.div>
    </Container>
  );
}
