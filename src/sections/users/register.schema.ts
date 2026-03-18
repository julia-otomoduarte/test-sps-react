import * as yup from 'yup';

export const USER_TYPE_OPTIONS = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Usuário', value: 'user' },
] as const;

export type UserTypeValue = 'admin' | 'user';

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  type: UserTypeValue;
  documents?: { file?: File }[];
  profileImage?: File;

};

export const registerSchema: yup.ObjectSchema<RegisterFormValues> = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Informe um email válido'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(4, 'Senha deve ter pelo menos 4 caracteres'),
  type: yup
    .mixed<UserTypeValue>()
    .oneOf(['admin', 'user'])
    .required()
    .default('user'),
  documents: yup.array().of(
  yup.object({
    file: yup.mixed<File>(),
  })
),
  profileImage: yup.mixed<File>(),
});
