import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AlertBadge, LoadingView, PageHeader, Panel, Screen, SecondaryButton } from '@/components/ui';
import { palette } from '@/constants/palette';
import { useSession } from '@/contexts/session-context';
import { severityLabel } from '@/services/alert-classification';
import { getOccurrenceById } from '@/services/occurrence-service';
import { formatDateTime, roleLabel, statusLabel } from '@/utils/format';
import type { Occurrence } from '@/types';

export default function OccurrenceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isReady } = useSession();
  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/login');
    }
  }, [isReady, user]);

  useEffect(() => {
    if (!isReady || !user || !id) {
      return;
    }
    let mounted = true;
    setIsLoading(true);
    getOccurrenceById(id)
      .then((data) => {
        if (mounted) setOccurrence(data);
      })
      .catch(() => {
        if (mounted) setOccurrence(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, isReady, user]);

  if (!isReady || !user || isLoading) {
    return <LoadingView label="Carregando detalhes…" />;
  }

  if (!occurrence) {
    return (
      <Screen contentStyle={styles.content}>
        <PageHeader kicker="REGISTRO" title="Item não localizado" />
        <Text style={styles.notFoundText}>
          O registro não está disponível no catálogo salvo deste dispositivo.
        </Text>
        <SecondaryButton
          label="Voltar às ocorrências"
          onPress={() => router.replace('/ocorrencias')}
        />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.content}>
      <SecondaryButton
        label="‹  Voltar às ocorrências"
        onPress={() => router.replace('/ocorrencias')}
        style={styles.backButton}
      />
      <PageHeader
        kicker={occurrence.category.toUpperCase()}
        title="Detalhes da ocorrência"
        subtitle="Registro do ambiente acadêmico simulado."
      />

      <Panel style={styles.summaryPanel}>
        <View style={styles.badgeRow}>
          <AlertBadge level={occurrence.alertLevel} />
          <Text style={styles.statusLabel}>{statusLabel[occurrence.status]}</Text>
        </View>
        <Text style={styles.title}>{occurrence.title}</Text>
        <Text style={styles.description}>{occurrence.description}</Text>
      </Panel>

      <Panel style={styles.detailsPanel}>
        <Text style={styles.detailsHeading}>Informações do registro</Text>
        <DetailRow label="Local" value={occurrence.location} />
        <DetailRow label="Categoria" value={occurrence.category} />
        <DetailRow label="Severidade" value={severityLabel[occurrence.severity]} />
        <DetailRow label="Nível de alerta" value={occurrence.alertLevel.toUpperCase()} />
        <DetailRow label="Registrado por" value={occurrence.createdBy} />
        <DetailRow label="Perfil" value={roleLabel[occurrence.createdByRole]} />
        <DetailRow label="Data e horário" value={formatDateTime(occurrence.createdAt)} last />
      </Panel>

      <View style={styles.notice}>
        <Text style={styles.noticeMark}>i</Text>
        <Text style={styles.noticeText}>
          Ocorrência e classificação produzidas exclusivamente para a demonstração. Não use como
          instrução ou alerta operacional.
        </Text>
      </View>
    </Screen>
  );
}

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  summaryPanel: {
    marginBottom: 13,
  },
  badgeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 17,
  },
  statusLabel: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    color: palette.text,
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 28,
  },
  description: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
  },
  detailsPanel: {
    paddingBottom: 6,
  },
  detailsHeading: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },
  detailRow: {
    borderBottomColor: palette.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 5,
    paddingVertical: 12,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    color: palette.quiet,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.65,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: palette.text,
    fontSize: 13,
    lineHeight: 19,
  },
  notice: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  noticeMark: {
    alignItems: 'center',
    borderColor: palette.teal,
    borderRadius: 8,
    borderWidth: 1,
    color: palette.teal,
    fontSize: 12,
    fontWeight: '700',
    height: 19,
    lineHeight: 17,
    textAlign: 'center',
    width: 19,
  },
  noticeText: {
    color: palette.quiet,
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
  },
  notFoundText: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },
});
