import { z } from 'zod';

/**
 * Form schemas. Error values are i18n KEYS (auth.errors.*) – screens translate them – so validation stays
 * language-independent and testable.
 */
export const emailSchema = z.string().trim().min(1, 'auth.errors.required').email('auth.errors.email');
export const passwordSchema = z.string().min(8, 'auth.errors.min');

export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'auth.errors.name').max(40, 'auth.errors.name'),
  email: emailSchema,
  password: passwordSchema,
  terms: z.boolean().refine((v) => v === true, 'auth.errors.terms'),
});
export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'auth.errors.required'),
});
export type SignInValues = z.infer<typeof signInSchema>;

export const forgotSchema = z.object({ email: emailSchema });
export type ForgotValues = z.infer<typeof forgotSchema>;

export const resetSchema = z
  .object({ password: passwordSchema, confirm: z.string().min(1, 'auth.errors.required') })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'auth.errors.match' });
export type ResetValues = z.infer<typeof resetSchema>;

/** 0–4 gentle strength score (never blocks the user beyond the 8-character minimum). */
export function passwordScore(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/i.test(pw) && /\d/.test(pw)) s++;
  if (/[A-Z]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s) as 0 | 1 | 2 | 3 | 4;
}

export const maskEmail = (email: string) => {
  const [u, d] = email.split('@');
  if (!d) return email;
  return `${u[0]}${'•'.repeat(Math.max(2, Math.min(5, u.length - 1)))}@${d}`;
};
