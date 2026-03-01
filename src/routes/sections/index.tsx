import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";

import { SplashScreen } from "src/components/loading-screen";
import { homeRoutes } from "./home";
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";

// ----------------------------------------------------------------------

const NotFoundPage = lazy(() => import("src/pages/NotFound"));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    ...homeRoutes,

    ...authRoutes,

    ...dashboardRoutes,

    { path: "404", element: (
      <Suspense fallback={<SplashScreen />}>
        <NotFoundPage />
      </Suspense>
    )},

    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
