import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/palette';
import { alertLabel, severityLabel } from '@/services/alert-classification';
import { formatDateTime, statusLabel } from '@/utils/format';
import { AlertBadge } from '@/components/ui';
import type { Occurrence } from '@/types';

export function OccurrenceCard({
  occurrence,
  onPress,
}: {
  occurrence: Occurrence;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.cardTop}>
        <View style={styles.cardTopCopy}>
          <Text style={styles.category}>{occurrence.category.toUpperCase()}</Text>
          <Text style={styles.timestamp}>{formatDateTime(occurrence.createdAt)}</Text>
        </View>
        <AlertBadge level={occurrence.alertLevel} />
      </View>

      <Text style={styles.title}>{occurrence.title}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {occurrence.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.metaLine}>
          <Text style={styles.metaMarker}>⌖</Text>
          <Text numberOfLines={1} style={styles.location}>
            {occurrence.location}
          </Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.status}>{statusLabel[occurrence.status]}</Text>
          <Text style={styles.severity}>· {severityLabel[occurrence.severity]}</Text>
        </View>
      </View>
      <Text style={styles.screenReaderHint}>
        Nível de alerta: {alertLabel[occurrence.alertLevel]}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 17,
    borderWidth: 1,
    marginBottom: 11,
    padding: 15,
  },
  pressed: {
    opacity: 0.78,
  },
  cardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTopCopy: {
    flex: 1,
    paddingRight: 8,
  },
  category: {
    color: palette.accent,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  timestamp: {
    color: palette.quiet,
    fontSize: 10,
    marginTop: 5,
  },
  title: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  description: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  cardFooter: {
    alignItems: 'center',
    borderTopColor: palette.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 11,
  },
  metaLine: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    paddingRight: 8,
  },
  metaMarker: {
    color: palette.teal,
    fontSize: 15,
  },
  location: {
    color: palette.muted,
    flexShrink: 1,
    fontSize: 11,
  },
  footerRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  status: {
    color: palette.text,
    fontSize: 10,
    fontWeight: '700',
  },
  severity: {
    color: palette.muted,
    fontSize: 10,
    marginLeft: 3,
  },
  screenReaderHint: {
    height: 0,
    width: 0,
  },
});
