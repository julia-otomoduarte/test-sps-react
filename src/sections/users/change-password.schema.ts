import * as yup from 'yup';

export type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
};

export const changePasswordSchema: yup.ObjectSchema<ChangePasswordFormValues> = yup.object({
  oldPassword: yup
    .string()
    .required('Senha atual é obrigatória'),
  newPassword: yup
    .string()
    .required('Nova senha é obrigatória')
    .min(4, 'Nova senha deve ter pelo menos 4 caracteres'),
});
