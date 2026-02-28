import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import UserDetailView from 'src/sections/users/view/user-detail-view';

// ----------------------------------------------------------------------

export default function UserDetailPage() {
  const params = useParams();

  return (
    <>
      <Helmet>
        <title>Dashboard: Detalhe do Usuário</title>
      </Helmet>

      <UserDetailView id={params.id || ''} />
    </>
  );
}
