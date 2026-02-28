import { Helmet } from 'react-helmet-async';

import RegisterView from 'src/sections/users/view/register-view';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>Criar Conta</title>
      </Helmet>

      <RegisterView />
    </>
  );
}
