import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  /** Papéis permitidos. Ex: ['admin'] */
  roles?: string[];
  children: React.ReactNode;
};

/**
 * Exibe o conteúdo apenas se o usuário logado tiver um dos papéis informados.
 * Se `roles` não for passado, libera para qualquer usuário autenticado.
 *
 * O campo comparado é `user.type` (valor: 'admin' | 'user').
 */
export default function RoleBasedGuard({ roles, children }: Props) {
  const { user } = useAuthContext();

  const currentRole = user?.type as string | undefined;

  if (typeof roles !== 'undefined' && (!currentRole || !roles.includes(currentRole))) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 200,
          gap: 1,
        }}
      >
        <Typography variant="h5">Acesso negado</Typography>
        <Typography color="text.secondary">
          Você não tem permissão para acessar esta página.
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
