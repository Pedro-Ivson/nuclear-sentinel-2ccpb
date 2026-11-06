import type { User } from '@/types';

const sharedDemoPassword = 'sentinel2026';

const demoAccounts: Array<{ user: User; password: string }> = [
  {
    user: {
      id: 'user-operator',
      name: 'Marina Costa',
      email: 'operador@nuclearsentinel.app',
      role: 'operador',
    },
    password: sharedDemoPassword,
  },
  {
    user: {
      id: 'user-supervisor',
      name: 'Rafael Almeida',
      email: 'supervisor@nuclearsentinel.app',
      role: 'supervisor',
    },
    password: sharedDemoPassword,
  },
];

export function authenticateUser(email: string, password: string): User | null {
  const normalizedEmail = email.trim().toLowerCase();
  const account = demoAccounts.find(
    (candidate) => candidate.user.email === normalizedEmail && candidate.password === password,
  );

  return account ? account.user : null;
}
