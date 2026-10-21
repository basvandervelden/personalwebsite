import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { formatPublicationAuthors, formatPublicationTitle, formatPublicationVenue } from '../src/publication-format.js';
import { isSupersededPreprint, publicationSection, publicationGroups, supersededPreprints } from '../src/publication-groups.js';
import { publicationTopicNames, publicationHasTopic } from '../src/publication-topics.js';
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
assert.equal(formatPublicationAuthors(get('cv-bib-047').authors,'cv-bib-047'),
  'CH Sudre, K van Wijnen, F Dubost, H Adams, D Atkinson, F Barkhof, MA Birhanu, EE Bron, R Camarasa, N Chaturvedi, …, BHM van der Velden, …, Marleen de Bruijne',
  'VALDO: preserve opening ten authors and verified last author with Bas explicitly highlighted');
for(const id of ['cv-bib-041']) {
  const authors=formatPublicationAuthors(get(id).authors,id);
  assert.ok(authors.includes('et al. (incl. BHM van der Velden)'),
    'Do not fabricate author order for a truncated record: '+id);
}
assert.equal(formatPublicationAuthors(get('cv-13-05').authors,'cv-13-05'),
  'N Özen, F Papadopoulou, O Mutlu, …, BHM van der Velden, A Hürriyetoğlu',
  'Apply near-last author rule to other complete author lists too');
assert.equal(formatPublicationAuthors(get('cv-wur-extra-1').authors,'cv-wur-extra-1'),name);
assert.equal(formatPublicationAuthors(get('cv-wur-extra-2').authors,'cv-wur-extra-2'),name);
assert.deepEqual(supersededPreprints,{'cv-bib-062':'cv-bib-067'});
for (const [preprintId, journalId] of Object.entries(supersededPreprints)) {
  assert.equal(get(preprintId).publicationType,'Preprint','Only hide preprints');
  assert.equal(get(journalId).publicationType,'Journal article','Replacement must be journal-published');
}
const visibleEntries=entries.filter(entry=>!isSupersededPreprint(entry));
assert.equal(visibleEntries.length,entries.length-1,'Published SPPIN preprint hidden without deleting its record');
assert.ok(visibleEntries.some(entry=>entry.id==='cv-13-11'),'Unpublished Mutlu XAI preprint stays visible');
assert.ok(!visibleEntries.some(entry=>entry.id==='cv-bib-062'),'Superseded SPPIN preprint is hidden');
assert.ok(visibleEntries.some(entry=>entry.id==='cv-bib-067'),'SPPIN journal article stays visible');
assert.deepEqual(publicationGroups.map(group=>visibleEntries.filter(entry=>publicationSection(entry)===group.key).length),[38,11,18,16]);
const appCode=readFileSync(new URL('../src/App.jsx',import.meta.url),'utf8');
const publicPage=appCode.split('function Publications() {')[1]?.split('function AcademicActivities()')[0] || '';
assert.ok(publicPage.includes('const filtered = cvPublications.filter('),
  'Main Publications page must display the full bibliography, not only papers');
assert.ok(!publicPage.includes('const papers = cvPublications.filter('),
  'Do not filter out presentations, posters or reports from Publications');
assert.ok(publicPage.includes('pageCopy.publications.conference_abstracts_posters'),
  'Conference presentations and posters must appear on Publications');
assert.ok(publicPage.includes('pageCopy.publications.other_outputs'),
  'Reports, datasets and other publications must appear on Publications');
assert.deepEqual(publicationGroups.map(g=>g.label),[
  'Journal papers','Full conference papers','Conference presentations and posters','Other publications'
]);
const topicsData=JSON.parse(readFileSync(new URL('../src/publication-topics.json',import.meta.url),'utf8'));
const topicNames=['AI','XAI','Foundation models','Reviews','Food safety'];
assert.deepEqual(publicationTopicNames,topicNames,'Five scientific topic filters');
const available=new Set(visibleEntries.map(e=>e.id));
const allIds=new Set(entries.map(e=>e.id));
for(const topic of topicNames) {
  const ids=topicsData.topics[topic];
  assert.ok(Array.isArray(ids)&&ids.length>0,'Topic cannot be empty: '+topic);
  assert.equal(new Set(ids).size,ids.length,'No repeated publication tags: '+topic);
  for(const id of ids) {
    assert.ok(allIds.has(id),'Tag has an unknown publication: '+id);
    assert.ok(available.has(id),'Hidden superseded preprint should not have a topic: '+id);
    assert.ok(publicationHasTopic(get(id),topic),'Matching publication topic: '+id);
  }
}
for(const narrower of ['XAI','Foundation models']) {
  for(const id of topicsData.topics[narrower])
    assert.ok(publicationHasTopic(get(id),'AI'),'Specialised AI topic must also appear under AI: '+id);
}
const topical=(id,name)=>publicationHasTopic(get(id),name);
assert.ok(topical('cv-13-01','Reviews')&&topical('cv-13-01','Food safety')&&topical('cv-13-01','AI'));
assert.ok(topical('cv-13-09','Reviews'),'Federated learning review is categorised');
assert.ok(topical('cv-bib-069','XAI')&&topical('cv-bib-069','Food safety'));
assert.ok(topical('cv-13-03','Foundation models')&&topical('cv-13-03','Food safety'));
assert.ok(!topical('cv-bibtex-wang2026foresight','Food safety'),
  'Do not conflate food security and food safety');
assert.ok(!topical('cv-bib-057','Food safety'),'Medical imaging research is not food safety');
const cvView=readFileSync(new URL('../src/CV.jsx',import.meta.url),'utf8');
assert.ok(cvView.includes('publicationTopicFilter ? publicationTopicNames : categories'),
  'Long CV publication view must show the five topical filters');
assert.ok(cvView.includes('publicationHasTopic(e,activeTopic)'),
  'CV publication filter must actually use the curated tags');
console.log('Publication display formatting checked for '+entries.length+' records');
