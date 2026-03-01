import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const DashboardPage = lazy(() => import('src/pages/dashboard'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user-create'));
const UserDetailPage = lazy(() => import('src/pages/dashboard/user-detail'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user-edit'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </AuthGuard>
    ),
    children: [
      { element: <DashboardPage />, index: true },
      { path: 'users/create', element: <UserCreatePage /> },
      { path: 'users/:id/detail', element: <UserDetailPage /> },
      { path: 'users/:id/edit', element: <UserEditPage /> },
    ],
  },
];
