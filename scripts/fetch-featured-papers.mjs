// Preserve the original published PDFs (including NC-ND licensed works).
// Pull from institutional/publisher open-access sources at build time so that
// the gallery needs no credentials or binary copies committed to the repository.
// A future manually checked-in PDF with the same name takes precedence.
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, openSync, readSync, closeSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const papers = JSON.parse(readFileSync(new URL('../src/featured-papers.json', import.meta.url), 'utf8'));
const directory = new URL('../public/papers/', import.meta.url);
mkdirSync(directory, { recursive: true });
const available = [];

function pdfIsValid(path) {
  try {
    if(statSync(path).size < 6000) return false;
    const fd = openSync(path, 'r'), buf = Buffer.alloc(5);
    readSync(fd, buf, 0, 5, 0);
    closeSync(fd);
    return buf.toString() === '%PDF-';
  } catch { return false; }
}

for (const paper of papers) {
  const path = new URL(paper.slug + '.pdf', directory).pathname;
  if (!existsSync(path)) {
    try {
      execFileSync('curl', ['--fail', '--location', '--retry', '2',
        '--connect-timeout', '15', '--max-time', '150',
        '-A', 'Mozilla/5.0 (academic open-access repository mirror)',
        '--output', path, paper.sourcePdf], { stdio:'pipe' });
    } catch(error) {
      console.warn('[papers] Download unavailable for ' + paper.slug + ': ' + String(error.message).slice(0,150));
    }
  }
  if (pdfIsValid(path)) {
    console.log('[papers] Included '+paper.slug+' ('+statSync(path).size+' bytes)');
    available.push(paper.slug);
  } else {
    if (existsSync(path)) unlinkSync(path);
    console.warn('[papers] Reader unavailable for '+paper.slug+'; the publication DOI remains linked');
  }
}
writeFileSync(new URL('available.json', directory), JSON.stringify(available,null,2) + '\n');
console.log('[papers] Ready: '+available.length+'/'+papers.length);
