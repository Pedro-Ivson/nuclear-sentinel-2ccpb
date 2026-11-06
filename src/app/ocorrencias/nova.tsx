import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AlertBadge,
  ChoiceChip,
  InlineLabel,
  LoadingView,
  PageHeader,
  Panel,
  PrimaryButton,
  Screen,
  SecondaryButton,
  TextField,
} from '@/components/ui';
import { palette } from '@/constants/palette';
import { useSession } from '@/contexts/session-context';
import { alertLabel, classifySeverity, severityLabel } from '@/services/alert-classification';
import { createOccurrence } from '@/services/occurrence-service';
import type { NewOccurrenceInput, OccurrenceCategory, Severity } from '@/types';

const categories: OccurrenceCategory[] = [
  'Equipamento',
  'Ambiente',
  'Segurança',
  'Procedimento',
  'Comunicação',
];

const severityChoices: Array<{
  value: Severity;
  tone: 'green' | 'amber' | 'red';
  note: string;
}> = [
  { value: 'baixa', tone: 'green', note: 'Gera alerta normal' },
  { value: 'media', tone: 'amber', note: 'Gera alerta atípico' },
  { value: 'alta', tone: 'red', note: 'Gera alerta crítico' },
];

type FormErrors = Partial<Record<keyof NewOccurrenceInput, string>>;

export default function NewOccurrenceScreen() {
  const { user, isReady } = useSession();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<OccurrenceCategory | null>(null);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formMessage, setFormMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/login');
    }
  }, [isReady, user]);

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!title.trim()) nextErrors.title = 'Informe um título para a ocorrência.';
    if (!category) nextErrors.category = 'Selecione uma categoria.';
    if (!location.trim()) nextErrors.location = 'Informe o local fictício do registro.';
    if (!description.trim()) nextErrors.description = 'Descreva brevemente o registro.';
    if (!severity) nextErrors.severity = 'Selecione a severidade.';
    return nextErrors;
  }

  async function handleSave() {
    const nextErrors = validate();
    setErrors(nextErrors);
    setFormMessage('');

    if (Object.keys(nextErrors).length > 0) {
      setFormMessage('Revise os campos destacados antes de salvar.');
      return;
    }

    if (!user || !category || !severity) {
      setFormMessage('A sessão expirou. Entre novamente para registrar a ocorrência.');
      router.replace('/login');
      return;
    }

    setIsSaving(true);
    try {
      const input: NewOccurrenceInput = {
        title: title.trim(),
        category,
        location: location.trim(),
        description: description.trim(),
        severity,
      };
      const saved = await createOccurrence(input, user);
      router.replace(('/ocorrencias/' + saved.id) as never);
    } catch {
      setFormMessage('Não foi possível salvar no armazenamento local. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  }

  if (!isReady || !user) {
    return <LoadingView label="Verificando acesso…" />;
  }

  const alertLevel = severity ? classifySeverity(severity) : null;

  return (
    <Screen contentStyle={styles.content}>
      <SecondaryButton
        label="‹  Voltar às ocorrências"
        onPress={() => router.replace('/ocorrencias')}
        style={styles.backButton}
      />
      <PageHeader
        kicker="NOVO REGISTRO"
        title="Registrar ocorrência"
        subtitle="Preencha os dados do cenário simulado. Os campos são obrigatórios."
      />

      <Panel style={styles.formPanel}>
        <View style={styles.fieldStack}>
          <TextField
            error={errors.title}
            label="Título"
            onChangeText={setTitle}
            placeholder="Ex.: Leitura fora do padrão"
            value={title}
          />

          <View style={styles.formGroup}>
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.chipWrap}>
              {categories.map((item) => (
                <ChoiceChip
                  key={item}
                  label={item}
                  onPress={() => {
                    setCategory(item);
                    setErrors((current) => ({ ...current, category: undefined }));
                  }}
                  selected={category === item}
                />
              ))}
            </View>
            {errors.category ? <Text style={styles.fieldError}>{errors.category}</Text> : null}
          </View>

          <TextField
            error={errors.location}
            label="Local fictício"
            onChangeText={setLocation}
            placeholder="Ex.: Setor Alfa · painel 02"
            value={location}
          />

          <TextField
            error={errors.description}
            label="Descrição"
            multiline
            onChangeText={setDescription}
            placeholder="Descreva o que foi observado no cenário."
            value={description}
          />

          <View style={styles.formGroup}>
            <View style={styles.severityHeader}>
              <Text style={styles.label}>Severidade informada</Text>
              {alertLevel ? <AlertBadge level={alertLevel} /> : null}
            </View>
            <Text style={styles.helperText}>
              O app transforma a severidade no nível de alerta correspondente.
            </Text>
            <View style={styles.severityChoices}>
              {severityChoices.map((choice) => (
                <PressableSeverity
                  key={choice.value}
                  label={severityLabel[choice.value]}
                  note={choice.note}
                  onPress={() => {
                    setSeverity(choice.value);
                    setErrors((current) => ({ ...current, severity: undefined }));
                  }}
                  selected={severity === choice.value}
                  tone={choice.tone}
                />
              ))}
            </View>
            {errors.severity ? <Text style={styles.fieldError}>{errors.severity}</Text> : null}
            {severity && alertLevel ? (
              <Text style={styles.mappingText}>
                Severidade {severityLabel[severity].toLocaleLowerCase('pt-BR')} → alerta{' '}
                {alertLabel[alertLevel].toLocaleLowerCase('pt-BR')}
              </Text>
            ) : null}
          </View>
        </View>

        {formMessage ? (
          <View accessibilityRole="alert" style={styles.formMessage}>
            <Text style={styles.formMessageText}>{formMessage}</Text>
          </View>
        ) : null}

        <PrimaryButton
          label="Salvar ocorrência"
          loading={isSaving}
          onPress={() => void handleSave()}
          style={styles.saveButton}
        />
        <InlineLabel>
          A classificação é demonstrativa e não corresponde a critérios operacionais reais.
        </InlineLabel>
      </Panel>
    </Screen>
  );
}

function PressableSeverity({
  label,
  note,
  selected,
  tone,
  onPress,
}: {
  label: string;
  note: string;
  selected: boolean;
  tone: 'green' | 'amber' | 'red';
  onPress: () => void;
}) {
  const color =
    tone === 'red' ? palette.red : tone === 'amber' ? palette.amber : palette.accent;
  const borderColor = selected ? color : palette.border;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.severityChoice,
        { borderColor, backgroundColor: selected ? palette.surfaceSoft : palette.surfaceRaised },
        pressed && styles.choicePressed,
      ]}>
      <View style={styles.severityChoiceTitle}>
        <View style={[styles.severityDot, { backgroundColor: color }]} />
        <Text style={styles.severityName}>{label}</Text>
      </View>
      <Text style={styles.severityNote}>{note}</Text>
    </Pressable>
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
  formPanel: {
    padding: 16,
  },
  fieldStack: {
    gap: 18,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '700',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  fieldError: {
    color: palette.red,
    fontSize: 12,
  },
  severityHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  helperText: {
    color: palette.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  severityChoices: {
    gap: 8,
    marginTop: 3,
  },
  severityChoice: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  severityChoiceTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  severityDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  severityName: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '700',
  },
  severityNote: {
    color: palette.muted,
    fontSize: 10,
    marginLeft: 16,
    marginTop: 4,
  },
  choicePressed: {
    opacity: 0.8,
  },
  mappingText: {
    color: palette.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  formMessage: {
    backgroundColor: palette.redSoft,
    borderColor: '#704044',
    borderRadius: 11,
    borderWidth: 1,
    marginTop: 16,
    padding: 12,
  },
  formMessageText: {
    color: palette.red,
    fontSize: 12,
    lineHeight: 17,
  },
  saveButton: {
    marginBottom: 14,
    marginTop: 18,
  },
});
