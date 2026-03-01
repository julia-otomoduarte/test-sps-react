import { Helmet } from "react-helmet-async";

import UserCreateView from "src/sections/users/view/user-create-view";

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title>Cadastrar Usuário</title>
      </Helmet>

      <UserCreateView />
    </>
  );
}
