import { Helmet } from "react-helmet-async";

import { useParams } from "src/routes/hooks";

import UserEditView from "src/sections/users/view/user-edit-view";

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const params = useParams();

  return (
    <>
      <Helmet>
        <title>Editar Usuário</title>
      </Helmet>

      <UserEditView id={params.id || ""} />
    </>
  );
}
