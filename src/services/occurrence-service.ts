import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialOccurrences } from '@/data/initial-occurrences';
import { classifySeverity } from '@/services/alert-classification';
import type { NewOccurrenceInput, Occurrence, User } from '@/types';

const OCCURRENCES_KEY = '@nuclear-sentinel/occurrences/v1';

export async function getOccurrences(): Promise<Occurrence[]> {
  const saved = await AsyncStorage.getItem(OCCURRENCES_KEY);

  if (saved !== null) {
    try {
      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed as Occurrence[];
      }
    } catch {
      // Restore the sample catalog when local data cannot be read.
    }
  }

  await AsyncStorage.setItem(OCCURRENCES_KEY, JSON.stringify(initialOccurrences));
  return [...initialOccurrences];
}

export async function getOccurrenceById(id: string): Promise<Occurrence | null> {
  const occurrences = await getOccurrences();
  return occurrences.find((occurrence) => occurrence.id === id) ?? null;
}

export async function createOccurrence(
  input: NewOccurrenceInput,
  user: User,
): Promise<Occurrence> {
  const occurrences = await getOccurrences();
  const occurrence: Occurrence = {
    ...input,
    id: 'occ-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
    alertLevel: classifySeverity(input.severity),
    status: 'aberta',
    createdAt: new Date().toISOString(),
    createdBy: user.name,
    createdByRole: user.role,
  };

  await AsyncStorage.setItem(
    OCCURRENCES_KEY,
    JSON.stringify([occurrence, ...occurrences]),
  );

  return occurrence;
}
