/**
 * Editorial boundary guard.
 *
 * Direct, content-only GitHub edits are always permitted.
 * Mixed editorial + application changes must have an explicit [content]
 * marker in the commit message (for this push range).
 * This stops incidental editorial rewrites during design/image work.
 */
import { execFileSync } from 'node:child_process';

const run = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const initial = process.env.BEFORE_SHA || '';
const zero = /^0+$/;
const event = process.env.GITHUB_EVENT_NAME || '';
if (event === 'workflow_dispatch') {
  console.log('Manual deployment; editorial boundary check skipped.');
  process.exit(0);
}
let base = initial;
if (!base || zero.test(base)) {
  try { base = run('rev-parse', 'HEAD^'); }
  catch { console.log('Initial commit; editorial boundary check skipped.'); process.exit(0); }
}
try { run('cat-file', '-e', base + '^{commit}'); }
catch { console.error('Cannot verify base commit; refusing an unchecked deployment.'); process.exit(1); }
const head = run('rev-parse', 'HEAD');
const changed = run('diff', '--name-only', '--diff-filter=ACMR', base, head)
  .split('\n').filter(Boolean);
const editorial = changed.filter(path => ['src/content.js','src/page-copy.json','src/cv-data.json','src/publication-categories.json','src/publication-topics.json'].includes(path));
const code = changed.filter(path => /^src\/.*\.(?:jsx|tsx|css)$/.test(path)
  || /^scripts\/.*\.(?:js|mjs|cjs)$/.test(path)
  || /^package(?:-lock)?\.json$/.test(path)
  || /^vite\.config\./.test(path));
if (!editorial.length) {
  console.log('Approved editorial text untouched.');
  process.exit(0);
}
if (!code.length) {
  console.log('Content-only edit allowed:', editorial.join(', '));
  process.exit(0);
}
const log = run('log', '--format=%B', base + '..' + head);
if (/\[content\]/i.test(log)) {
  console.log('Explicit [content] approval marker found for mixed changes.');
  process.exit(0);
}
console.error('BLOCKED: Editorial copy was changed together with application/design files.');
console.error('Editorial files: ' + editorial.join(', '));
console.error('Code/design files: ' + code.join(', '));
console.error('If intentional, review the copy diff and add [content] to the commit message.');
console.error('See CONTENT_EDITING.md and AGENTS.md.');
process.exit(1);
