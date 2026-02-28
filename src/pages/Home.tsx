import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Stack, Divider } from '@mui/material';

import palette from 'src/theme/palette';

const { primary, accent, alpha, gradient } = palette;

function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: gradient.primary,
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          px: 4,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha.white15}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              bgcolor: accent.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>
              S
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>
              SPS Group
            </Typography>
            <Typography sx={{ color: alpha.white65, fontSize: 11, letterSpacing: 1 }}>
              A melhor consultoria SAP
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/auth/login')}
            sx={{
              color: '#fff',
              borderColor: alpha.white50,
              '&:hover': { borderColor: '#fff', bgcolor: alpha.white10 },
            }}
          >
            Entrar
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('/auth/register')}
            sx={{
              bgcolor: accent.main,
              color: '#fff',
              '&:hover': { bgcolor: accent.dark },
            }}
          >
            Cadastrar
          </Button>
        </Stack>
      </Box>

      {/* Hero */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          {/* Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 2,
              py: 0.75,
              mb: 4,
              borderRadius: '20px',
              border: `1px solid ${alpha.white30}`,
              bgcolor: alpha.white10,
            }}
          >
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: accent.main, mr: 1 }} />
            <Typography sx={{ color: alpha.white85, fontSize: 13 }}>
              Sistema de Gestão de Usuários
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              color: '#fff',
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 3,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Bem-vindo ao sistema de usuários da{' '}
            <Box component="span" sx={{ color: accent.main }}>
              SPS Group
            </Box>
            !
          </Typography>

          <Typography
            sx={{
              color: alpha.white75,
              fontSize: { xs: '1rem', md: '1.15rem' },
              mb: 6,
              maxWidth: 560,
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Realize o login ou cadastre-se para acessar todos os conteúdos e funcionalidades da
            plataforma.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/auth/login')}
              sx={{
                bgcolor: accent.main,
                color: '#fff',
                px: 5,
                py: 1.5,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(255,102,0,0.4)',
                '&:hover': {
                  bgcolor: accent.dark,
                  boxShadow: '0 6px 24px rgba(255,102,0,0.5)',
                },
              }}
            >
              Fazer Login
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/auth/register')}
              sx={{
                color: '#fff',
                borderColor: alpha.white50,
                px: 5,
                py: 1.5,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': { borderColor: '#fff', bgcolor: alpha.white10 },
              }}
            >
              Criar Conta
            </Button>
          </Stack>

          {/* Stats */}
          <Box sx={{ mt: 10 }}>
            <Divider sx={{ borderColor: alpha.white15, mb: 5 }} />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={4}
              justifyContent="center"
              divider={
                <Divider orientation="vertical" flexItem sx={{ borderColor: alpha.white15 }} />
              }
            >
              {[
                { value: '+20 anos', label: 'de experiência' },
                { value: '+500', label: 'projetos entregues' },
                { value: 'SAP Gold', label: 'Partner' },
              ].map((item) => (
                <Box key={item.label} sx={{ textAlign: 'center', px: 3 }}>
                  <Typography
                    sx={{
                      color: accent.main,
                      fontWeight: 800,
                      fontSize: { xs: '1.5rem', md: '1.75rem' },
                      lineHeight: 1,
                      mb: 0.5,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography sx={{ color: alpha.white75, fontSize: 13 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ py: 2.5, textAlign: 'center', borderTop: `1px solid ${alpha.white15}` }}
      >
        <Typography sx={{ color: alpha.white50, fontSize: 13 }}>
          © {new Date().getFullYear()} SPS Group. Todos os direitos reservados.
        </Typography>
      </Box>
    </Box>
  );
}

export default Home;
