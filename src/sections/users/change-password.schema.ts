import * as yup from 'yup';

export type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
};

export const changePasswordSchema: yup.ObjectSchema<ChangePasswordFormValues> = yup.object({
  oldPassword: yup
    .string()
    .required('Senha atual é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
  newPassword: yup
    .string()
    .required('Nova senha é obrigatória')
    .min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
});
