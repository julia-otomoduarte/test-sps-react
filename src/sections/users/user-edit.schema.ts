import * as yup from 'yup';
import { UserTypeValue } from './register.schema';

export type UserEditFormValues = {
  name: string;
  email: string;
  type?: UserTypeValue;
};

export const userEditSchema: yup.ObjectSchema<UserEditFormValues> = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Informe um email válido'),
  type: yup
    .mixed<UserTypeValue>()
    .oneOf(['admin', 'user'])
    .optional(),
});
