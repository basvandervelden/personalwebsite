import { useEffect, useRef, useState } from 'react';
import { pdfjs } from 'react-pdf';

// A selectable text alternative to the canvas-only flipbook. This reads the
// text embedded in the same thesis PDF, one chapter at a time.
export default function AccessibleThesisText({ file, chapters, chapterIndex }) {
  const [pdf, setPdf] = useState(null);
  const [pages, setPages] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const headingRef = useRef(null);
  const chapter = chapters[chapterIndex];

  useEffect(() => {
    let active = true;
    const task = pdfjs.getDocument(file);
    task.promise.then(doc => {
      if (active) setPdf(doc);
      else doc.destroy();
    }).catch(err => {
      if (!active) return;
      setError(err?.message || 'Could not open the thesis PDF.');
      setStatus('error');
    });
    return () => {
      active = false;
      task.destroy().catch(() => {});
    };
  }, [file]);

  useEffect(() => {
    if (!pdf || !chapter) return;
    let active = true;
    setStatus('loading');
    setPages([]);
    const begin = Math.max(1, chapter.page);
    const nextChapter = chapters[chapterIndex + 1];
    const end = Math.min(pdf.numPages, nextChapter ? nextChapter.page - 1 : pdf.numPages);
    (async () => {
      const output = [];
      for (let number = begin; number <= end; number++) {
        const page = await pdf.getPage(number);
        const content = await page.getTextContent();
        const text = content.items.map(item => (
          typeof item.str === 'string' ? item.str + (item.hasEOL ? '\n' : ' ') : ''
        )).join('').replace(/[ \t]+\n/g, '\n').trim();
        output.push({ number, text });
        page.cleanup();
        if (!active) return;
      }
      if (!active) return;
      setPages(output);
      setStatus('ready');
    })().catch(err => {
      if (!active) return;
      setError(err?.message || 'The text could not be extracted from this chapter.');
      setStatus('error');
    });
    return () => { active = false; };
  }, [pdf, chapters, chapterIndex, chapter]);

  useEffect(() => {
    if (status === 'ready') headingRef.current?.focus({ preventScroll: true });
  }, [status, chapterIndex]);

  return <div className="thesis-text-edition" aria-label="Thesis text version">
    <div className="thesis-text-intro">
      <h2 ref={headingRef} tabIndex={-1}>{chapter?.title || 'Thesis text'}</h2>
      <p>This text is extracted automatically from the archived PDF to make the thesis easier to read with a screen reader, select and zoom. Figures, formulae, tables and reading order may require checking in the original PDF.</p>
    </div>
    {status === 'loading' && <p role="status" className="thesis-text-status">Loading chapter text…</p>}
    {status === 'error' && <p role="alert" className="thesis-error">{error} You can still open the original PDF above.</p>}
    {status === 'ready' && <div className="thesis-text-pages">
      {pages.map(page => <section className="thesis-text-page" key={page.number} aria-label={`PDF page ${page.number}`}>
        <h3>Page {page.number}</h3>
        {page.text ? <p>{page.text}</p> : <p>No extractable text on this page. See the original PDF for visual content.</p>}
      </section>)}
    </div>}
  </div>;
}
