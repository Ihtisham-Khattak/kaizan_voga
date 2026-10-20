/**
 * Finds user-visible English typed straight into screens (JSX text, label/title/placeholder/accessibilityLabel
 * props) instead of going through t(). Those strings would stay English in Urdu. Run: npx tsx scripts/audit-i18n.ts
 * Development-only screens (src/app/dev) are skipped.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Allowed untranslated text: the brand and mascot names, and developer-only screens (behind __DEV__). */
const ALLOW = [
  /^Kai$/,
  /^Kaizen Yoga$/,
  /^Developer$/,
  /^Screen showcase/,
  /^State components/,
  /^Prototype: preview a state$/,
  /^Promise$/,
];

const ROOTS = ['src/app', 'src/components', 'src/features'];
const SKIP = [/src\/app\/dev\//, /components\/ui\//];
const PROPS =
  /\b(label|title|placeholder|accessibilityLabel|accessibilityHint|subtitle|sub|body|text|description|aria-label)=("([^"{}]*[A-Za-z]{3,}[^"{}]*)"|\{'([^'{}]*[A-Za-z]{3,}[^'{}]*)'\})/g;
const JSX_TEXT = />\s*([A-Z][A-Za-z][^<>{}]{2,})\s*</g;

function walk(dir: string, out: string[] = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx$/.test(f)) out.push(p);
  }
  return out;
}

let count = 0;
for (const file of ROOTS.flatMap((r) => walk(r))) {
  if (SKIP.some((s) => s.test(file))) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line) || (/className=|import /.test(line) && !PROPS.test(line))) return;
    PROPS.lastIndex = 0;
    for (const m of line.matchAll(PROPS)) {
      const v = m[3] ?? m[4];
      if (/^[a-z]+([-_][a-z]+)*$/.test(v) || /^[a-z]+\.[a-z.]+$/.test(v) || ALLOW.some((a) => a.test(v)))
        continue; // ids, i18n keys, allowed names
      console.log(`${file}:${i + 1}  ${m[1]}="${v}"`);
      count++;
    }
    for (const m of line.matchAll(JSX_TEXT)) {
      if (ALLOW.some((a) => a.test(m[1].trim()))) continue;
      console.log(`${file}:${i + 1}  text: ${m[1].trim()}`);
      count++;
    }
  });
}
console.log(`\n${count} hard-coded string(s).`);
process.exit(count ? 1 : 0);
