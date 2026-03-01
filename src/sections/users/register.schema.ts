import * as yup from 'yup';

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
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
});
