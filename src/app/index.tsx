import { router } from 'expo-router';
import { useEffect } from 'react';

import { LoadingView } from '@/components/ui';
import { useSession } from '@/contexts/session-context';

export default function IndexRoute() {
  const { user, isReady } = useSession();

  useEffect(() => {
    if (isReady) {
      router.replace(user ? '/ocorrencias' : '/login');
    }
  }, [isReady, user]);

  return <LoadingView label="Preparando o painel de simulação…" />;
}
