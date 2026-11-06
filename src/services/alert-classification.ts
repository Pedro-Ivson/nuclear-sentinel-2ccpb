import type { AlertLevel, Severity } from '@/types';

const ALERT_BY_SEVERITY: Record<Severity, AlertLevel> = {
  baixa: 'normal',
  media: 'atipico',
  alta: 'critico',
};

export function classifySeverity(severity: Severity): AlertLevel {
  return ALERT_BY_SEVERITY[severity];
}

export const alertLabel: Record<AlertLevel, string> = {
  normal: 'Normal',
  atipico: 'Atípica',
  critico: 'Crítica',
};

export const severityLabel: Record<Severity, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};
