const userTypeLabels: Record<string, string> = {
  user: 'usuário',
  admin: 'administrador',
};

export function translateUserType(type: string): string {
  return userTypeLabels[type] ?? type;
}
