// Consistent, display-only bibliography typography shared by Publications and the long CV.
// Original titles, authors, journal names and links remain unchanged in cv-data.json.
// Formatting style: author initials before family name (without periods), sentence-case
// article titles, official publication-venue capitalization.
const preserveTitleWords = new Map(Object.entries({
  ai:'AI', xai:'XAI', llm:'LLM', nlp:'NLP', mri:'MRI', mr:'MR', dce:'DCE',
  'pet':'PET', ct:'CT', psma:'PSMA', her2:'HER2', er:'ER',
  hrms:'HRMS', ms:'MS', nmr:'NMR', lc:'LC', gc:'GC',
  tof:'TOF', mra:'MRA', dlbcl:'DLBCL', miccai:'MICCAI',
  efsa:'EFSA', fao:'FAO', efra:'EFRA', wur:'WUR', wfsr:'WFSR',
  'sam2':'SAM2', 'sppin':'SPPIN', 'crown':'CROWN',
  'chefs':'CHEFS', 'bpe':'BPE', 'valdo':'VALDO',
  'xai4ttx':'XAI4TTX', 'cge':'CGE', 'usa':'USA',
  'kitsi21':'KiTS21', 'kits21':'KiTS21',
  'semeval':'SemEval', 'brightcookies':'BrightCookies',
  'wilms':'Wilms', 'netherlands':'Netherlands',
  'european':'European', 'dutch':'Dutch', 'utrecht':'Utrecht',
  'wageningen':'Wageningen', 'san':'San', 'antonio':'Antonio',
  'mixlacune':'MixLacune', 'mixmicrobleed':'Mixmicrobleed',
  'june':'June', 'willis':'Willis', 't1':'T1', 'oc':'OC', 'b':'B'
}));
const titleOverrides = {
  'cv-13-04': 'Food safety trends across Europe: insights from the 392-million-entry CompreHensive European Food Safety (CHEFS) database',
  'cv-bib-047': 'Where is VALDO? VAscular Lesions Detection and segmentatiOn challenge at MICCAI 2021'
};
const venueOverrides = {
  'Breast cancer research and treatment': 'Breast Cancer Research and Treatment',
  'Investigative radiology': 'Investigative Radiology',
  'Medical image analysis': 'Medical Image Analysis',
  'NPJ breast cancer': 'npj Breast Cancer',
  'Scientific reports': 'Scientific Reports',
  'The British journal of radiology': 'The British Journal of Radiology',
  'The breast journal': 'The Breast Journal',
  'San Antonio Breast Cancer Symposium\\': 'San Antonio Breast Cancer Symposium',
  'MRI guidance for breast cancer radiotherapy': 'MRI Guidance for Breast Cancer Radiotherapy',
  'Quantitative MRI of brain fluids': 'Quantitative MRI of Brain Fluids'
};
const authorOverrides = {
  // Full CHEFS authorship verified against the published paper.
  'cv-13-04': 'N Kızılilsoley, F van Meer, O Mutlu, W Hoenderdaal, R Hobé, W Mu, A Gerssen, HJ van der Fels-Klerx, Á Jóźwiak, I Manikas, A Hürriyetoğlu, BHM van der Velden',
  'cv-wur-extra-1': 'BHM van der Velden',
  'cv-wur-extra-2': 'BHM van der Velden',
  'cv-13-08': 'F van Meer, BHM van der Velden, M Takeuchi',
  // Legacy import uses commas both between authors and between family/given names.
  'cv-bib-062': 'MAD Buser, DC Simons, M Fitski, MHWA Wijnen, AS Littooij, AH ter Brugge, IN Vos, MHA Janse, M de Boer, R ter Maat, et al. (incl. BHM van der Velden)'
};
function cleanLegacyEscapes(value) {
  return String(value || '')
    .replace(/K\\iz\\ililsoley/g,'Kızılilsoley')
    .replace(/Hob\\'e/g,'Hobé')
    .replace(/J\\'o\\'zwiak/g,'Jóźwiak')
    .replace(/C\\'ecile/g,'Cécile')
    .replace(/\\+$/g,'');
}
function initials(given) {
  return String(given).replace(/\./g,' ').split(/\s+/).map(p=>p.replace(/[^\p{L}]/gu,'')).filter(Boolean)
    .map(p=>/^[A-Z]{1,6}$/.test(p) ? p : p[0].toLocaleUpperCase()).join('');
}
function familyCase(name) {
  return name.trim().replace(/\b(van|der|den|de|ten|ter)\b/gi, w=>w.toLowerCase());
}
function formatOneAuthor(raw) {
  const name=cleanLegacyEscapes(raw).trim();
  if (!name || /^et al\.?$/i.test(name)) return name;
  // Most bibliography imports use "family, given names" for each author.
  const comma=name.indexOf(',');
  if (comma>=0) {
    let family=familyCase(name.slice(0,comma));
    const given=name.slice(comma+1).trim();
    if (/^van der velden$/i.test(family) && !/^tijl/i.test(given)) return 'BHM van der Velden';
    if (family==='Koerkamp' && /\bGroot\b/i.test(given)) return 'ML Groot Koerkamp';
    if (family==='Brugge' && /\bter\b/i.test(given)) return initials(given.replace(/\bter\b/gi,''))+' ter Brugge';
    if (/^Sanguesa$/i.test(family) && /\bGirones\b/i.test(given)) return 'M Girones Sanguesa';
    if (family==='Gonzalez' && /\bPadilla\b/i.test(given)) return 'GF Padilla-Gonzalez';
    return (initials(given)+' '+family).trim();
  }
  // A handful of records have initials preceding the surname already.
  const leading=name.match(/^((?:[A-Z]\.\s*){1,6})(.+)$/);
  if (leading) {
    const family=familyCase(leading[2]);
    if (/^van der velden$/i.test(family)) return 'BHM van der Velden';
    return (initials(leading[1])+' '+family).trim();
  }
  return name;
}
// In these long author lists, the researcher's name is verified but outside
// the displayed first-author segment. Do not imply a specific missing position.
const truncatedCoauthorRecords = new Set(['cv-bib-067','cv-bib-047','cv-bib-041']);
export const featuredAuthorName = 'BHM van der Velden';
export function formatPublicationAuthors(value,id) {
  if (Object.hasOwn(authorOverrides,id)) return authorOverrides[id];
  const cleaned=cleanLegacyEscapes(value).trim();
  if (!cleaned) return '';
  if (/^European Food Safety Authority/.test(cleaned)) return cleaned;
  const parts=cleaned.split(/\s*;\s*|\s+&\s+/);
  const formatted = parts.map(formatOneAuthor).filter(Boolean).join(', ');
  if (truncatedCoauthorRecords.has(id) && !formatted.includes(featuredAuthorName)) {
    const abbreviated = /et al\.?$/i.test(formatted) ? formatted : formatted + ', et al.';
    return abbreviated + ' (incl. ' + featuredAuthorName + ')';
  }
  return formatted;
}
export function formatPublicationTitle(value,id) {
  if (Object.hasOwn(titleOverrides,id)) return titleOverrides[id];
  const title=cleanLegacyEscapes(value).trim();
  let atStart=true;
  return title.replace(/\p{L}[\p{L}\p{N}’']*/gu,(raw,pos)=>{
    const previous=title.slice(0,pos).trimEnd().slice(-1);
    const capitalise=atStart || previous === ':';
    atStart=false;
    const replacement=preserveTitleWords.get(raw.toLocaleLowerCase()) || raw.toLocaleLowerCase();
    if (preserveTitleWords.has(raw.toLocaleLowerCase())) return replacement;
    return capitalise ? replacement[0].toLocaleUpperCase()+replacement.slice(1) : replacement;
  }).replace(/\b([37])t\b/gi,(_,n)=>n+'T')
    .replace(/\bdense trial\b/gi,'DENSE trial')
    .replace(/\bdense tissue and early breast neoplasm screening trial\b/gi,'DENSE tissue and early breast neoplasm screening trial');
}
export function formatPublicationVenue(value) {
  const cleaned=cleanLegacyEscapes(value).trim();
  return venueOverrides[cleaned] || cleaned;
}
