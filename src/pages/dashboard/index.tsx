import { Helmet } from 'react-helmet-async';

import UserListView from 'src/sections/users/view/user-list-view';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Lista de Usuários</title>
      </Helmet>

      <UserListView />
    </>
  );
}
