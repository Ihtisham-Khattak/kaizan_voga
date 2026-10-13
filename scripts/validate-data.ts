import { summary, validateData } from '../src/data/validate';

const issues = validateData();
console.log(summary().join('\n'));
if (issues.length) {
  console.error('\nData problems:\n- ' + issues.join('\n- '));
  process.exit(1);
}
console.log('\nData OK');
