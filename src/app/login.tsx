import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BrandLockup, InlineLabel, LoadingView, Panel, PrimaryButton, Screen, TextField } from '@/components/ui';
import { palette } from '@/constants/palette';
import { useSession } from '@/contexts/session-context';

export default function LoginScreen() {
  const { user, isReady, signIn } = useSession();
  const [email, setEmail] = useState('operador@nuclearsentinel.app');
  const [password, setPassword] = useState('sentinel2026');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && user) {
      router.replace('/ocorrencias');
    }
  }, [isReady, user]);

  async function handleSignIn() {
    setError('');
    setIsSubmitting(true);

    try {
      const accepted = await signIn(email, password);
      if (!accepted) {
        setError('E-mail ou senha incorretos. Use uma das contas de teste.');
        return;
      }
      router.replace('/ocorrencias');
    } catch {
      setError('Não foi possível iniciar a sessão neste dispositivo. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isReady || user) {
    return <LoadingView label="Carregando sessão…" />;
  }

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.header}>
        <BrandLockup />
        <View style={styles.simulationTag}>
          <View style={styles.liveDot} />
          <Text style={styles.simulationTagText}>AMBIENTE SIMULADO</Text>
        </View>
      </View>

      <View style={styles.intro}>
        <Text style={styles.eyebrow}>ACESSO À PLATAFORMA</Text>
        <Text style={styles.title}>Olá, equipe.</Text>
        <Text style={styles.subtitle}>
          Entre para acompanhar os registros do cenário acadêmico Nuclear Sentinel.
        </Text>
      </View>

      <Panel style={styles.loginPanel}>
        <Text style={styles.panelTitle}>Identificação de acesso</Text>
        <Text style={styles.panelSubtitle}>Autenticação local para demonstração do MVP.</Text>
        <View style={styles.fields}>
          <TextField
            autoCapitalize="none"
            keyboardType="email-address"
            label="E-mail"
            onChangeText={setEmail}
            placeholder="nome@exemplo.com"
            textContentType="emailAddress"
            value={email}
          />
          <TextField
            autoCapitalize="none"
            label="Senha"
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry
            textContentType="password"
            value={password}
          />
        </View>
        {error ? (
          <View accessibilityRole="alert" style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <PrimaryButton
          label="Entrar no painel"
          loading={isSubmitting}
          onPress={() => void handleSignIn()}
          style={styles.loginButton}
        />
        <InlineLabel>
          Os dados e as credenciais desta versão são simulados e armazenados localmente.
        </InlineLabel>
      </Panel>

      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerTitle}>CONTA PARA DEMONSTRAÇÃO</Text>
        <Text style={styles.footerCredential}>operador@nuclearsentinel.app</Text>
        <Text style={styles.footerCredential}>senha: sentinel2026</Text>
        <Text style={styles.footerNote}>A conta de supervisor também está descrita no README.</Text>
      </View>
      <Text style={styles.disclaimer}>
        PROTÓTIPO ACADÊMICO · NÃO REPRESENTA UM SISTEMA OPERACIONAL
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    paddingBottom: 28,
    paddingTop: 22,
  },
  header: {
    alignItems: 'flex-start',
    gap: 20,
  },
  simulationTag: {
    alignItems: 'center',
    backgroundColor: palette.surfaceRaised,
    borderColor: palette.border,
    borderRadius: 99,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  liveDot: {
    backgroundColor: palette.accent,
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  simulationTagText: {
    color: palette.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
  intro: {
    marginBottom: 22,
    marginTop: 35,
  },
  eyebrow: {
    color: palette.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 9,
  },
  title: {
    color: palette.text,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 380,
  },
  loginPanel: {
    padding: 18,
  },
  panelTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '700',
  },
  panelSubtitle: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  fields: {
    gap: 16,
    marginTop: 20,
  },
  errorBox: {
    backgroundColor: palette.redSoft,
    borderColor: '#704044',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    padding: 11,
  },
  errorText: {
    color: palette.red,
    fontSize: 12,
    lineHeight: 17,
  },
  loginButton: {
    marginBottom: 14,
    marginTop: 20,
  },
  footer: {
    marginTop: 24,
  },
  footerLine: {
    backgroundColor: palette.border,
    height: StyleSheet.hairlineWidth,
    marginBottom: 15,
  },
  footerTitle: {
    color: palette.quiet,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  footerCredential: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 5,
  },
  footerNote: {
    color: palette.quiet,
    fontSize: 11,
    marginTop: 7,
  },
  disclaimer: {
    color: palette.quiet,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 25,
    textAlign: 'center',
  },
});
