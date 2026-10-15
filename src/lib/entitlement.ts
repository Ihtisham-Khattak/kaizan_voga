import { FIRST_SESSION_ID } from '@/lib/plan';
import { hasPremium, useSubscriptionStore } from '@/store/subscription-store';
import { useUiStore, type LockReason } from '@/store/ui-store';

/**
 * Premium gating (mock – reads the prototype subscription store; FN-08 swaps in real entitlements).
 *
 * NEVER locked, whatever the plan: safety information, breathing basics, SOS quick-relief and the starter session.
 * Currently enforced: premium-flagged routines/programs and offline downloads. Custom routines, advanced mood
 * insights and extra voices are listed on the paywall but not yet enforced.
 */
export type GateTarget =
  | {
      kind: 'content';
      id: string;
      premium: boolean;
      contentKind?: 'routine' | 'sleep' | 'quick-relief' | 'breathing' | 'program';
    }
  | { kind: 'feature'; feature: Exclude<LockReason, 'content'> };

/** Content that must always stay reachable. */
const ALWAYS_FREE_KINDS = new Set(['quick-relief', 'breathing']);

export function isAllowed(target: GateTarget, premium: boolean): boolean {
  if (premium) return true;
  if (target.kind === 'feature') return false;
  if (target.id === FIRST_SESSION_ID) return true;
  if (target.contentKind && ALWAYS_FREE_KINDS.has(target.contentKind)) return true;
  return !target.premium;
}

/** Reactive: `const { allowed } = useEntitlement({ kind: 'feature', feature: 'downloads' })`. */
export function useEntitlement(target: GateTarget) {
  const premium = useSubscriptionStore((s) => hasPremium(s));
  return { allowed: isAllowed(target, premium), premium };
}

/** Imperative, for press handlers: returns true to go ahead, or opens the upsell sheet and returns false. */
export function gate(target: GateTarget): boolean {
  const premium = hasPremium(useSubscriptionStore.getState());
  if (isAllowed(target, premium)) return true;
  useUiStore.getState().openLocked(target.kind === 'feature' ? target.feature : 'content');
  return false;
}
