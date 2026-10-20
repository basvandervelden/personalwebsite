import { Fragment } from 'react';
import { featuredAuthorName } from './publication-format.js';

// Emphasise the site owner's name without altering the order of other authors.
export default function PublicationAuthors({ text }) {
  const parts = String(text || '').split(featuredAuthorName);
  return <>{parts.map((part, index) => <Fragment key={index}>{index > 0 && <strong className="publication-self-author">{featuredAuthorName}</strong>}{part}</Fragment>)}</>;
}
