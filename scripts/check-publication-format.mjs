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
console.log('Publication display formatting checked for '+entries.length+' records');
