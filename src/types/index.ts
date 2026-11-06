export type UserRole = 'operador' | 'supervisor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type Severity = 'baixa' | 'media' | 'alta';
export type AlertLevel = 'normal' | 'atipico' | 'critico';
export type OccurrenceStatus = 'aberta' | 'em_analise' | 'resolvida';

export type OccurrenceCategory =
  | 'Equipamento'
  | 'Ambiente'
  | 'Segurança'
  | 'Procedimento'
  | 'Comunicação';

export interface Occurrence {
  id: string;
  title: string;
  category: OccurrenceCategory;
  location: string;
  description: string;
  severity: Severity;
  alertLevel: AlertLevel;
  status: OccurrenceStatus;
  createdAt: string;
  createdBy: string;
  createdByRole: UserRole;
}

export type NewOccurrenceInput = Pick<
  Occurrence,
  'title' | 'category' | 'location' | 'description' | 'severity'
>;
