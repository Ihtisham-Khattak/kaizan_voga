import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { AuthUser } from '@/store/types';

/**
 * MOCK auth service. Same async shape a real backend will have (card FN-02 replaces the bodies):
 * deterministic fake behaviour so every UI state can be exercised.
 *   taken@example.com        → "email already in use" on sign up
 *   wrong@… or password "wrongpass" → invalid credentials on sign in
 *   code 000000              → wrong code
 *   offline@example.com      → offline error
 */
export class AuthError extends Error {
  constructor(public code: 'email-taken' | 'invalid-credentials' | 'wrong-code' | 'offline') {
    super(code);
  }
}

const wait = (ms = 900) => new Promise((r) => setTimeout(r, ms));
const uid = () => `u_${Math.random().toString(36).slice(2, 10)}`;
const nameFromEmail = (email: string) => {
  const n = email.split('@')[0].replace(/[._-]+/g, ' ');
  return n.charAt(0).toUpperCase() + n.slice(1);
};

/** Transient data between sign-up → verify-code. */
let pending: { name: string; email: string } | null = null;
export const pendingSignup = () => pending;

async function saveToken(token: string) {
  if (Platform.OS === 'web') return;
  try {
    await SecureStore.setItemAsync('kz-token', token);
  } catch {
    /* secure store unavailable (e.g. simulator without keychain) – mock only */
  }
}
export async function clearToken() {
  if (Platform.OS === 'web') return;
  try {
    await SecureStore.deleteItemAsync('kz-token');
  } catch {
    /* ignore */
  }
}

export async function signUp(input: { name: string; email: string; password: string }) {
  await wait();
  if (input.email.startsWith('offline@')) throw new AuthError('offline');
  if (input.email.toLowerCase() === 'taken@example.com') throw new AuthError('email-taken');
  pending = { name: input.name, email: input.email };
}

export async function verifyCode(code: string) {
  await wait(700);
  if (code === '000000') throw new AuthError('wrong-code');
}

/** Completes sign-up after the code is verified. */
export async function finishSignUp(): Promise<AuthUser> {
  const p = pending ?? { name: 'Friend', email: 'friend@example.com' };
  await saveToken(`mock-${uid()}`);
  pending = null;
  return { id: uid(), name: p.name, email: p.email };
}

export async function signIn(input: { email: string; password: string }): Promise<AuthUser> {
  await wait();
  if (input.email.startsWith('offline@')) throw new AuthError('offline');
  if (input.email.startsWith('wrong@') || input.password === 'wrongpass')
    throw new AuthError('invalid-credentials');
  await saveToken(`mock-${uid()}`);
  return { id: uid(), name: nameFromEmail(input.email), email: input.email };
}

export async function signInWithProvider(provider: 'apple' | 'google'): Promise<AuthUser> {
  await wait(700);
  await saveToken(`mock-${uid()}`);
  return {
    id: uid(),
    name: provider === 'apple' ? 'Apple user' : 'Google user',
    email: `${provider}@example.com`,
  };
}

export async function requestPasswordReset(email: string) {
  await wait();
  if (email.startsWith('offline@')) throw new AuthError('offline');
  pending = { name: '', email };
}

export async function resetPassword(_password: string) {
  await wait();
}

export async function signOut() {
  await clearToken();
}
