import { lazy, Suspense } from "react";

import { SplashScreen } from "src/components/loading-screen";

// ----------------------------------------------------------------------

const HomePage = lazy(() => import("src/pages/Home"));

// ----------------------------------------------------------------------

export const homeRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<SplashScreen />}>
        <HomePage />
      </Suspense>
    ),
  },
];
