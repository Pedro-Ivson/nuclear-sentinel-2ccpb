import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { alertLabel } from '@/services/alert-classification';
import { palette } from '@/constants/palette';
import type { AlertLevel } from '@/types';

export function Screen({
  children,
  scroll = true,
  contentStyle,
}: React.PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}>) {
  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.pageContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.pageContent, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.brandRow}>
      <View style={styles.brandMark}>
        <Text style={styles.brandMarkText}>NS</Text>
      </View>
      <View>
        <Text style={styles.brandName}>NUCLEAR SENTINEL</Text>
        {!compact && <Text style={styles.brandCaption}>CENTRO DE MONITORAMENTO · SIMULAÇÃO</Text>}
      </View>
    </View>
  );
}

export function PageHeader({
  kicker,
  title,
  subtitle,
  right,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderCopy}>
        {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
        <Text style={styles.pageTitle}>{title}</Text>
        {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function Panel({ children, style }: React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function SectionTitle({ children, right }: React.PropsWithChildren<{ right?: React.ReactNode }>) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {right}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        (disabled || loading) && styles.buttonDisabled,
        pressed && !disabled && !loading && styles.buttonPressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.accentInk} />
      ) : (
        <Text style={styles.primaryButtonText}>{label}</Text>
      )}
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed, style]}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'sentences',
  autoCorrect = false,
  onSubmitEditing,
  returnKeyType,
  textContentType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  returnKeyType?: TextInputProps['returnKeyType'];
  textContentType?: TextInputProps['textContentType'];
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={palette.quiet}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        selectionColor={palette.accent}
        style={[styles.textInput, multiline && styles.multilineInput, error && styles.inputError]}
        textContentType={textContentType}
        value={value}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

export function ChoiceChip({
  label,
  selected,
  onPress,
  tone = 'default',
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  tone?: 'default' | 'green' | 'amber' | 'red';
}) {
  const selectedToneStyle =
    tone === 'green'
      ? styles.chipSelectedGreen
      : tone === 'amber'
        ? styles.chipSelectedAmber
        : tone === 'red'
          ? styles.chipSelectedRed
          : styles.chipSelectedDefault;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceChip,
        selected && selectedToneStyle,
        pressed && styles.buttonPressed,
      ]}>
      <Text style={[styles.choiceChipText, selected && styles.choiceChipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function AlertBadge({ level }: { level: AlertLevel }) {
  const toneStyle =
    level === 'critico'
      ? styles.badgeCritical
      : level === 'atipico'
        ? styles.badgeAtypical
        : styles.badgeNormal;

  return (
    <View style={[styles.alertBadge, toneStyle]}>
      <View style={[styles.statusDot, level === 'critico' && styles.statusDotCritical]} />
      <Text style={styles.alertBadgeText}>{alertLabel[level]}</Text>
    </View>
  );
}

export function InlineLabel({ children }: React.PropsWithChildren) {
  return <Text style={styles.inlineLabel}>{children}</Text>;
}

export function LoadingView({ label = 'Carregando dados locais…' }: { label?: string }) {
  return (
    <Screen scroll={false} contentStyle={styles.loadingContainer}>
      <ActivityIndicator color={palette.accent} size="large" />
      <Text style={styles.loadingText}>{label}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  pageContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 32,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: palette.accent,
    borderRadius: 11,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  brandMarkText: {
    color: palette.accentInk,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  brandName: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.25,
  },
  brandCaption: {
    color: palette.muted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.85,
    marginTop: 4,
  },
  pageHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  pageHeaderCopy: {
    flex: 1,
    paddingRight: 12,
  },
  kicker: {
    color: palette.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.35,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pageTitle: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.65,
    lineHeight: 34,
  },
  pageSubtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  panel: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: palette.accent,
    borderRadius: 13,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: palette.accentInk,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonPressed: {
    opacity: 0.78,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderRadius: 12,
    borderWidth: 1,
    color: palette.text,
    fontSize: 15,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  multilineInput: {
    minHeight: 116,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: palette.red,
  },
  fieldError: {
    color: palette.red,
    fontSize: 12,
    lineHeight: 17,
  },
  choiceChip: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 14,
  },
  choiceChipText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  choiceChipTextSelected: {
    color: palette.text,
  },
  chipSelectedDefault: {
    backgroundColor: palette.tealSoft,
    borderColor: palette.teal,
  },
  chipSelectedGreen: {
    backgroundColor: '#24372A',
    borderColor: palette.accent,
  },
  chipSelectedAmber: {
    backgroundColor: palette.amberSoft,
    borderColor: palette.amber,
  },
  chipSelectedRed: {
    backgroundColor: palette.redSoft,
    borderColor: palette.red,
  },
  alertBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    minHeight: 27,
    paddingHorizontal: 10,
  },
  badgeNormal: {
    backgroundColor: '#24372A',
  },
  badgeAtypical: {
    backgroundColor: palette.amberSoft,
  },
  badgeCritical: {
    backgroundColor: palette.redSoft,
  },
  statusDot: {
    backgroundColor: palette.accent,
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  statusDotCritical: {
    backgroundColor: palette.red,
  },
  alertBadgeText: {
    color: palette.text,
    fontSize: 11,
    fontWeight: '700',
  },
  inlineLabel: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 14,
    justifyContent: 'center',
  },
  loadingText: {
    color: palette.muted,
    fontSize: 13,
  },
});
