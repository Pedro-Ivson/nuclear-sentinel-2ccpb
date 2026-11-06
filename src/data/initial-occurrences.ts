import { classifySeverity } from '@/services/alert-classification';
import type { Occurrence, Severity } from '@/types';

function seedOccurrence(
  id: string,
  title: string,
  category: Occurrence['category'],
  location: string,
  description: string,
  severity: Severity,
  status: Occurrence['status'],
  minutesAgo: number,
): Occurrence {
  return {
    id,
    title,
    category,
    location,
    description,
    severity,
    alertLevel: classifySeverity(severity),
    status,
    createdAt: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
    createdBy: 'Equipe de simulação',
    createdByRole: 'supervisor',
  };
}

export const initialOccurrences: Occurrence[] = [
  seedOccurrence(
    'seed-001',
    'Leitura de vibração fora da faixa',
    'Equipamento',
    'Setor Alfa · painel 02',
    'Registro simulado para revisão da equipe de manutenção.',
    'media',
    'em_analise',
    18,
  ),
  seedOccurrence(
    'seed-002',
    'Variação ambiental registrada',
    'Ambiente',
    'Área de apoio · ponto 04',
    'Variação fictícia adicionada ao catálogo inicial do MVP.',
    'baixa',
    'aberta',
    47,
  ),
  seedOccurrence(
    'seed-003',
    'Sensor sem atualização recente',
    'Equipamento',
    'Setor Beta · painel 01',
    'Alerta fictício de alta severidade para demonstrar a classificação crítica.',
    'alta',
    'em_analise',
    103,
  ),
  seedOccurrence(
    'seed-004',
    'Teste de comunicação concluído',
    'Comunicação',
    'Sala de monitoramento',
    'Exercício de rotina simulado, registrado como referência normal.',
    'baixa',
    'resolvida',
    190,
  ),
];
