/// <reference types="node" />
/**
 * QA-03 content & tone audit. Scans every English UI string and all content data for wording the brief rules out:
 * medical/outcome claims, weight-loss talk, guilt language, forceful breathing, extreme poses.
 * Exits non-zero if anything is found. Run: npm run audit:copy
 */
import en from '../src/i18n/en';
import { achievements, challenges, helplines, styles } from '../src/data/misc';
import { breathingSessions } from '../src/data/breathing';
import { exercises } from '../src/data/exercises';
import { programs } from '../src/data/programs';
import { routines } from '../src/data/routines';

type Rule = { id: string; why: string; re: RegExp; allow?: RegExp };

const RULES: Rule[] = [
  { id: 'weight-loss', why: 'No weight-loss or body-shaping claims', re: /\b(weight[- ]?loss|lose weight|burn(s|ing)? (fat|calories)|calorie|slim|toned? (body|abs)|fat[- ]burn)/i },
  { id: 'cure-treat', why: 'No cure / treatment / medical outcome claims', re: /\b(cures?|cured|treats?|treatment|therapy|therapeutic|diagnos\w*|prescri\w*|clinically|medical(ly)? proven|heals?|healing)\b/i, allow: /not (a )?(medical|a substitute|diagnos)|does not diagnose|not medical advice|isn't medical|is not medical|no medical|never medical|nothing medical/i },
  { id: 'injury-recovery', why: 'No injury-recovery or rehab promises', re: /\b(rehab\w*|injur(y|ies) recovery|recover from (an )?injur\w*|fix (your )?(back|neck|posture)|correct (your )?posture)/i },
  { id: 'absolute-claim', why: 'Prefer "many people feel / may help" over guarantees', re: /\b(guarantee\w*|always works|will (cure|fix|solve|eliminate)|proven to|eliminates?|get rid of (stress|anxiety|pain))\b/i },
  { id: 'guilt', why: 'No guilt, shame or pressure about missed days', re: /\b(you missed|missed (a|your|the) (day|session)|streak (broken|lost)|lost your streak|broke your streak|falling behind|fell behind|you failed|failed to|lazy|you should have|don'?t give up|no excuses|you must)\b/i },
  { id: 'forceful', why: 'No forceful breathing or pushing through pain for beginners', re: /\b(hold your breath|forceful|force (your|the)|breath of fire|kapalabhati|bhastrika|push through|no pain,? no gain|until it hurts|deep(er)? into the pain)/i },
  { id: 'extreme-pose', why: 'No extreme poses for beginners', re: /\b(headstand|handstand|scorpion|king pigeon|full splits?|wheel pose|deep backbend|shoulder ?stand)\b/i },
];

type Hit = { rule: Rule; where: string; text: string };
const hits: Hit[] = [];

function check(where: string, text: unknown) {
  if (typeof text !== 'string' || !text.trim()) return;
  for (const rule of RULES) {
    if (rule.re.test(text) && !(rule.allow && rule.allow.test(text))) hits.push({ rule, where, text });
  }
}

function walk(node: unknown, path: string) {
  if (typeof node === 'string') return check(path, node);
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`));
  if (node && typeof node === 'object')
    for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
}

walk(en, 'i18n.en');
walk(exercises, 'exercises');
walk(routines, 'routines');
walk(programs.map((p) => ({ ...p, days: p.days.map((d) => d.title) })), 'programs');
walk(breathingSessions, 'breathing');
walk(achievements, 'achievements');
walk(challenges, 'challenges');
walk(styles, 'styles');

// Positive checks: things that MUST be present.
const must: [string, boolean][] = [
  ['Illustrative-characters disclaimer in About', /illustrated and are not real people/i.test(en.pf.info.aboutDisclaimer)],
  ['"Not medical advice" in Safety info', /not medical advice/i.test(en.pf.info.safety5)],
  ['Rest-day copy frames rest positively', /rest is part of practice/i.test(en.prog.calendar.rest)],
  ['Every pose has a safe-exit line', exercises.every((e) => e.safeExit && e.safeExit.trim().length > 0)],
  ['Every exercise names who reviewed it', exercises.every((e) => e.review?.name)],
  ['Story labels the characters\' stories as illustrative', /illustrated/i.test(en.story.s5.illustrated)],
  ['Helplines are flagged as placeholders until verified', helplines.every((h) => h.placeholder)],
];

let failed = 0;
for (const h of hits) {
  failed++;
  console.log(`✗ [${h.rule.id}] ${h.where}\n    "${h.text.slice(0, 140)}"\n    → ${h.rule.why}`);
}
for (const [label, ok] of must) {
  if (!ok) failed++;
  console.log(`${ok ? '✓' : '✗'} ${label}`);
}
// Warnings: not failures, but must be resolved before release.
const warn: string[] = [];
if (exercises.some((e) => /placeholder/i.test(e.review.name))) warn.push('Pose reviewer name is still a placeholder (src/data/exercises.ts REVIEW).');
if (helplines.some((h) => h.placeholder)) warn.push('Helpline numbers are placeholders – replace with verified local lines.');
warn.push('Urdu strings (src/i18n/ur.ts) are a draft – needs review by a native speaker.');
for (const w of warn) console.log(`! ${w}`);

console.log(`\n${hits.length} wording issue(s), ${must.filter(([, ok]) => !ok).length} missing requirement(s).`);
process.exit(failed ? 1 : 0);
