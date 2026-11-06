import type { OccurrenceStatus, UserRole } from '@/types';

export function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate));
}

export const statusLabel: Record<OccurrenceStatus, string> = {
  aberta: 'Aberta',
  em_analise: 'Em análise',
  resolvida: 'Resolvida',
};

export const roleLabel: Record<UserRole, string> = {
  operador: 'Operador',
  supervisor: 'Supervisor',
};
