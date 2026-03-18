import * as yup from 'yup';
import { UserTypeValue } from './register.schema';

export type UserEditFormValues = {
  name: string;
  email: string;
  type?: UserTypeValue;
  documents?: { file?: File; existingUrl?: string }[];
  profileImage?: File | string;
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
  documents: yup.array().of(
  yup.object({
    file: yup.mixed<File>(),
    existingUrl: yup.string(),
  })
),
    profileImage: yup.mixed<File | string>() ,
});
