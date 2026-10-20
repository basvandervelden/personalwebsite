import categories from './publication-categories.json' with { type: 'json' };

// Independent, reviewable publication types; CV bibliographic records remain immutable.
const conferencePapers = new Set(categories.fullConferencePapers);
const conferenceAbstracts = new Set(categories.conferenceAbstractsPosters);
const journalAbstracts = new Set(categories.journalMeetingAbstracts);
const nonResearchJournalOutputs = new Set(categories.journalNonResearchOutputs);
export const supersededPreprints = categories.supersededPreprints || {};

export const publicationGroups = [
  {key:'journal',label:'Journal articles'},
  {key:'conferencePaper',label:'Full conference papers'},
  {key:'conferenceAbstract',label:'Conference abstracts & posters'},
  {key:'other',label:'Other scholarly outputs'}
];

export function isSupersededPreprint(entry) {
  return entry?.publicationType === 'Preprint'
    && Object.hasOwn(supersededPreprints,entry.id);
}

export function publicationSection(entry) {
  if (journalAbstracts.has(entry.id) || conferenceAbstracts.has(entry.id)) return 'conferenceAbstract';
  if (conferencePapers.has(entry.id)) return 'conferencePaper';
  if (entry.publicationType === 'Journal article' && !nonResearchJournalOutputs.has(entry.id)) return 'journal';
  return 'other';
}

export function publicationDisplayType(entry) {
  const section=publicationSection(entry);
  return nonResearchJournalOutputs.has(entry.id) ? 'Event report'
    : journalAbstracts.has(entry.id) ? 'Conference abstract'
    : section === 'conferencePaper' ? 'Full conference paper'
    : section === 'conferenceAbstract' ? 'Conference abstract / poster'
    : entry.publicationType === 'Conference contribution' ? 'Conference contribution (format to verify)'
    : entry.publicationType || 'Other scholarly output';
}
