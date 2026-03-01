// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/login`,
      register: `${ROOTS.AUTH}/register`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    user: {
      create: `${ROOTS.DASHBOARD}/users/create`,
      detail: (id: string) => `${ROOTS.DASHBOARD}/users/${id}/detail`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/users/${id}/edit`,
    },
  },
};
