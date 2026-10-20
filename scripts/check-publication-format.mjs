import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { formatPublicationAuthors, formatPublicationTitle, formatPublicationVenue } from '../src/publication-format.js';
const cv = JSON.parse(readFileSync(new URL('../src/cv-data.json',import.meta.url),'utf8'));
const entries=cv.sections.find(section=>section.number===13)?.entries ?? [];
assert.ok(entries.length>=80);
const get=id=>entries.find(entry=>entry.id===id);
for(const entry of entries){
  const author=formatPublicationAuthors(entry.authors,entry.id);
  const title=formatPublicationTitle(entry.paperTitle,entry.id);
  const venue=formatPublicationVenue(entry.journal);
  assert.ok(title,'Missing title: '+entry.id);
  assert.ok(!author.includes(';'),'Invalid author separator: '+entry.id);
  assert.ok(!author.includes('\\'),'Unconverted BibTeX name: '+entry.id);
  assert.ok(typeof venue==='string');
}
assert.equal(formatPublicationAuthors(get('cv-13-13').authors,'cv-13-13'),'BHM van der Velden');
assert.ok(formatPublicationAuthors(get('cv-13-04').authors,'cv-13-04').includes('N Kızılilsoley'));
assert.ok(formatPublicationAuthors(get('cv-bib-004').authors,'cv-bib-004').includes('T van der Velden'));
assert.equal(formatPublicationVenue(get('cv-13-14').journal),'Medical Image Analysis');
assert.equal(formatPublicationVenue(get('cv-bib-057').journal),'npj Breast Cancer');
assert.ok(formatPublicationTitle(get('cv-bib-058').paperTitle,'cv-bib-058').includes('extremely dense breasts'));
assert.ok(formatPublicationTitle(get('cv-bib-058').paperTitle,'cv-bib-058').includes('DENSE trial'));
assert.ok(formatPublicationTitle(get('cv-wur-extra-1').paperTitle,'cv-wur-extra-1').endsWith('(8 June)'));
const name='BHM van der Velden';
const absent=entries.filter(entry=>!formatPublicationAuthors(entry.authors,entry.id).includes(name));
assert.deepEqual(absent.map(entry=>entry.id),['cv-13-12'],
  'Only the EFSA institutional-author event report may omit the site owner as a named author');
const chefs=formatPublicationAuthors(get('cv-13-04').authors,'cv-13-04');
assert.equal(chefs,'N Kızılilsoley, F van Meer, O Mutlu, …, BHM van der Velden',
  'CHEFS: first three authors and last author');
const sppin='MAD Buser, DC Simons, M Fitski, …, BHM van der Velden, H Kuijf, A de Luca, AFW van der Steeg';
for(const id of ['cv-bib-067','cv-bib-062']) {
  assert.equal(formatPublicationAuthors(get(id).authors,id),sppin,
    'SPPIN journal and preprint: verified lead and final author positions');
}
for(const id of ['cv-bib-047','cv-bib-041']) {
  const authors=formatPublicationAuthors(get(id).authors,id);
  assert.ok(authors.includes('et al. (incl. BHM van der Velden)'),
    'Do not fabricate author order for a truncated record: '+id);
}
assert.equal(formatPublicationAuthors(get('cv-13-05').authors,'cv-13-05'),
  'N Özen, F Papadopoulou, O Mutlu, …, BHM van der Velden, A Hürriyetoğlu',
  'Apply near-last author rule to other complete author lists too');
assert.equal(formatPublicationAuthors(get('cv-wur-extra-1').authors,'cv-wur-extra-1'),name);
assert.equal(formatPublicationAuthors(get('cv-wur-extra-2').authors,'cv-wur-extra-2'),name);
console.log('Publication display formatting checked for '+entries.length+' records');
