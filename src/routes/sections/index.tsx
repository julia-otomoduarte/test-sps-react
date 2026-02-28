import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';

const HomePage = lazy(() => import('src/pages/Home'));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Home
    {
      path: '/',
      element: <HomePage />,
    },

    // Rotas de autenticação
    ...authRoutes,

    // Rotas do dashboard (autenticadas)
    ...dashboardRoutes,

    // 404
    { path: '*', element: <Navigate to="/auth/login" replace /> },
  ]);
}
