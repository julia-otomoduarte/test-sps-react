import { Navigate, useRoutes } from "react-router-dom";

import { homeRoutes } from "./home";
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    ...homeRoutes,

    ...authRoutes,

    ...dashboardRoutes,

    { path: "*", element: <Navigate to="/auth/login" replace /> },
  ]);
}
