import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { OccurrenceCard } from '@/components/occurrence-card';
import { AlertBadge, BrandLockup, ChoiceChip, LoadingView, PageHeader, PrimaryButton, Screen } from '@/components/ui';
import { palette } from '@/constants/palette';
import { useSession } from '@/contexts/session-context';
import { getOccurrences } from '@/services/occurrence-service';
import { roleLabel } from '@/utils/format';
import type { AlertLevel, Occurrence } from '@/types';

type AlertFilter = 'todas' | AlertLevel;

const filters: Array<{ value: AlertFilter; label: string; tone?: 'green' | 'amber' | 'red' }> = [
  { value: 'todas', label: 'Todas' },
  { value: 'critico', label: 'Críticas', tone: 'red' },
  { value: 'atipico', label: 'Atípicas', tone: 'amber' },
  { value: 'normal', label: 'Normais', tone: 'green' },
];

export default function OccurrencesScreen() {
  const { user, isReady, signOut } = useSession();
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<AlertFilter>('todas');

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/login');
    }
  }, [isReady, user]);

  useFocusEffect(
    useCallback(() => {
      if (!isReady || !user) {
        return undefined;
      }

      let mounted = true;
      setIsLoading(true);
      setLoadError('');

      getOccurrences()
        .then((data) => {
          if (mounted) {
            setOccurrences(data);
          }
        })
        .catch(() => {
          if (mounted) {
            setLoadError('Não foi possível carregar os registros salvos neste dispositivo.');
          }
        })
        .finally(() => {
          if (mounted) {
            setIsLoading(false);
          }
        });

      return () => {
        mounted = false;
      };
    }, [isReady, user]),
  );

  const visibleOccurrences = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR');
    return occurrences.filter((occurrence) => {
      const matchesAlert = filter === 'todas' || occurrence.alertLevel === filter;
      const searchableText = [
        occurrence.title,
        occurrence.category,
        occurrence.location,
        occurrence.description,
      ]
        .join(' ')
        .toLocaleLowerCase('pt-BR');
      return matchesAlert && (!normalizedSearch || searchableText.includes(normalizedSearch));
    });
  }, [filter, occurrences, search]);

  const criticalCount = occurrences.filter((item) => item.alertLevel === 'critico').length;
  const reviewCount = occurrences.filter((item) => item.status === 'em_analise').length;

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  if (!isReady || !user) {
    return <LoadingView label="Verificando acesso…" />;
  }

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.topBar}>
        <BrandLockup compact />
        <View style={styles.userArea}>
          <View style={styles.userCopy}>
            <Text style={styles.userName}>{user.name.split(' ')[0]}</Text>
            <Text style={styles.userRole}>{roleLabel[user.role]}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => void handleSignOut()}
            style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}>
            <Text style={styles.signOutText}>Sair</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.environmentBanner}>
        <View style={styles.environmentDot} />
        <Text style={styles.environmentText}>CENÁRIO FICTÍCIO · DADOS DE DEMONSTRAÇÃO</Text>
      </View>

      <PageHeader
        kicker="VISÃO GERAL DO TURNO"
        title="Ocorrências"
        subtitle="Acompanhe os registros e o nível de alerta atribuído."
      />

      <View style={styles.statsRow}>
        <StatCard label="REGISTROS" value={occurrences.length} />
        <StatCard label="CRÍTICAS" value={criticalCount} tone="red" />
        <StatCard label="EM ANÁLISE" value={reviewCount} tone="amber" />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeading}>Registros recentes</Text>
        <Text style={styles.countText}>{visibleOccurrences.length} itens</Text>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          autoCapitalize="none"
          onChangeText={setSearch}
          placeholder="Buscar por título, local ou categoria"
          placeholderTextColor={palette.quiet}
          style={styles.searchInput}
          value={search}
        />
      </View>

      <ScrollView
        horizontal
        contentContainerStyle={styles.filterRow}
        showsHorizontalScrollIndicator={false}>
        {filters.map((item) => (
          <ChoiceChip
            key={item.value}
            label={item.label}
            onPress={() => setFilter(item.value)}
            selected={filter === item.value}
            tone={item.tone}
          />
        ))}
      </ScrollView>

      {loadError ? (
        <View accessibilityRole="alert" style={styles.errorBox}>
          <Text style={styles.errorText}>{loadError}</Text>
        </View>
      ) : null}

      {isLoading ? (
        <LoadingView label="Lendo catálogo local…" />
      ) : visibleOccurrences.length ? (
        visibleOccurrences.map((occurrence) => (
          <OccurrenceCard
            key={occurrence.id}
            occurrence={occurrence}
            onPress={() => router.push(('/ocorrencias/' + occurrence.id) as never)}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nenhum registro encontrado</Text>
          <Text style={styles.emptyText}>
            Ajuste a busca ou o filtro selecionado para consultar outros itens.
          </Text>
        </View>
      )}

      <PrimaryButton
        label="+  Registrar ocorrência"
        onPress={() => router.push('/ocorrencias/nova')}
        style={styles.createButton}
      />

      <View style={styles.classificationHint}>
        <AlertBadge level="normal" />
        <Text style={styles.classificationHintText}>
          O nível é calculado automaticamente a partir da severidade informada no cadastro.
        </Text>
      </View>
    </Screen>
  );
}

function StatCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'red' | 'amber';
}) {
  const valueColor = tone === 'red' ? palette.red : tone === 'amber' ? palette.amber : palette.text;
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color: valueColor }]}>{String(value).padStart(2, '0')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 10,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userArea: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  userCopy: {
    alignItems: 'flex-end',
  },
  userName: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '700',
  },
  userRole: {
    color: palette.muted,
    fontSize: 10,
    marginTop: 3,
  },
  signOutButton: {
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  signOutText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
  environmentBanner: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#16251D',
    borderColor: '#2D4937',
    borderRadius: 99,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    marginBottom: 22,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  environmentDot: {
    backgroundColor: palette.accent,
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  environmentText: {
    color: palette.accent,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.75,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    minHeight: 79,
    paddingHorizontal: 11,
    paddingVertical: 12,
  },
  statLabel: {
    color: palette.quiet,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 7,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '700',
  },
  countText: {
    color: palette.muted,
    fontSize: 11,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  searchIcon: {
    color: palette.teal,
    fontSize: 19,
    marginRight: 8,
  },
  searchInput: {
    color: palette.text,
    flex: 1,
    fontSize: 12,
    minHeight: 44,
  },
  filterRow: {
    gap: 7,
    paddingBottom: 14,
    paddingRight: 10,
  },
  errorBox: {
    backgroundColor: palette.redSoft,
    borderColor: '#704044',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    padding: 12,
  },
  errorText: {
    color: palette.red,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 10,
  },
  classificationHint: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    marginTop: 16,
  },
  classificationHintText: {
    color: palette.quiet,
    flex: 1,
    fontSize: 10,
    lineHeight: 15,
  },
});
