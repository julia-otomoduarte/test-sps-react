import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";

const HomePage = lazy(() => import("src/pages/Home"));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Home
    {
      path: "/",
      element: <HomePage />,
    },

    ...authRoutes,

    ...dashboardRoutes,

    { path: "*", element: <Navigate to="/auth/login" replace /> },
  ]);
}
