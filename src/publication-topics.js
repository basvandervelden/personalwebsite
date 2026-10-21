import publicationTopicData from './publication-topics.json' with { type: 'json' };

// Publication topics are deliberately overlapping, unlike output types.
// A paper can be an XAI review applied to food safety at the same time.
export const publicationTopicNames = Object.keys(publicationTopicData.topics);
const topicsByName = Object.fromEntries(
  publicationTopicNames.map(topic => [topic, new Set(publicationTopicData.topics[topic])])
);

export function publicationHasTopic(entry, topic) {
  return topic === 'All topics' || Boolean(topicsByName[topic]?.has(entry.id));
}
