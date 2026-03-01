import * as yup from 'yup';

export type LoginFormValues = {
  email: string;
  password: string;
};

export const loginSchema: yup.ObjectSchema<LoginFormValues> = yup.object({
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Informe um email válido'),
  password: yup
    .string()
    .required('Senha é obrigatória')
});
