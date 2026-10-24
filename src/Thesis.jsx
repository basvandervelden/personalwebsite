import { forwardRef, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page as PDFPage, pdfjs } from 'react-pdf';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import AccessibleThesisText from './AccessibleThesisText.jsx';
import './thesis.css';

// Keep the worker local to the site and matched to the PDF.js version used by React-PDF.
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// The public university repository PDF includes a bibliographic sheet as its first
// page. It remains in the downloadable original; the book opens at the thesis title page.
const THESIS_PDF = import.meta.env.BASE_URL + 'thesis/bas-van-der-velden-phd-2017.pdf';
const REPOSITORY = 'https://dspace.library.uu.nl/handle/1874/358177';
const FIRST_BOOK_PDF_PAGE = 2;

const chapters = [
  { title: 'Title page', page: 2 },
  { title: 'Contents', page: 8 },
  { title: '01  Introduction', page: 10 },
  { title: '02  CPE as biomarker for survival', page: 20 },
  { title: '03  Validation of CPE', page: 40 },
  { title: '04  Risk stratification', page: 58 },
  { title: '05  ER-pathway activity', page: 84 },
  { title: '06  Summary and discussion', page: 104 },
  { title: 'Bibliography', page: 116 },
  { title: 'Nederlandse samenvatting', page: 132 },
  { title: 'Biography', page: 144 },
];

const FlipPage = forwardRef(function FlipPage({ pageNumber, active }, ref) {
  return <div className="thesis-book-page" ref={ref}>
    <div className="thesis-book-paper">
      {active ? <PDFPage pageNumber={pageNumber} width={470} renderTextLayer={false} renderAnnotationLayer={false}
        loading={<div className="thesis-page-loading">Loading page {pageNumber}…</div>} />
        : <div className="thesis-page-loading" aria-hidden="true" />}
    </div>
  </div>;
});

export default function Thesis() {
  const flip = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [textChapterIndex, setTextChapterIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false);
  const bookPages = numPages ? Math.max(0, numPages - FIRST_BOOK_PDF_PAGE + 1) : 0;

  const goToPdfPage = (pdfPage) => {
    const target = Math.min(Math.max(pdfPage - FIRST_BOOK_PDF_PAGE, 0), bookPages - 1);
    if (textMode) {
      const index = chapters.findIndex((ch, i) => pdfPage >= ch.page && pdfPage < (chapters[i + 1]?.page || Infinity));
      setTextChapterIndex(Math.max(0, index));
      return;
    }
    setCurrentIndex(target);
    flip.current?.pageFlip()?.turnToPage(target);
  };
  const previous = () => flip.current?.pageFlip()?.flipPrev();
  const next = () => flip.current?.pageFlip()?.flipNext();

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = () => setReduceMotion(media.matches);
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  // Arrow keys affect the book only when the book itself has keyboard focus.
  // Do not hijack keys inside chapter navigation or screen-reader controls.
  const handleBookKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
  };

  const displayedPdfPage = Math.min(currentIndex + FIRST_BOOK_PDF_PAGE, numPages || 145);
  const currentChapterPage = textMode ? chapters[textChapterIndex].page : displayedPdfPage;

  return <div className="thesis-page">
    <section className="thesis-intro"><div className="container">
      <a className="thesis-back" href="#/about">← About</a>
      <p className="thesis-eyebrow">PHD THESIS · UTRECHT UNIVERSITY · 2017</p>
      <h1>Analysis of healthy breast tissue on MRI for prognosis of breast cancer</h1>
      <p className="thesis-byline">Bas H.M. van der Velden</p>
      <p className="thesis-intro-copy">Doctoral thesis defended on 21 December 2017. Browse the original pages below, or open the complete PDF.</p>
      <div className="thesis-links">
        <a className="thesis-download" href={THESIS_PDF} target="_blank" rel="noopener noreferrer">Open / download PDF <span aria-hidden="true">↗</span></a>
        <a href={REPOSITORY} target="_blank" rel="noopener noreferrer">University repository ↗</a>
      </div>
    </div></section>

    <section className="thesis-reader-section" aria-label="Thesis reader"><div className="container thesis-reader-layout">
      <aside className="thesis-chapters" aria-label="Thesis chapters">
        <h2 className="thesis-aside-head">IN THIS THESIS</h2>
        <nav>{chapters.map(chapter => <button key={chapter.page} type="button"
          className={currentChapterPage >= chapter.page && currentChapterPage < (chapters[chapters.indexOf(chapter) + 1]?.page || Infinity) ? 'is-current' : ''}
          aria-current={currentChapterPage >= chapter.page && currentChapterPage < (chapters[chapters.indexOf(chapter) + 1]?.page || Infinity) ? 'location' : undefined}
          onClick={() => goToPdfPage(chapter.page)} disabled={!numPages}>
          <span>{chapter.title}</span><small>{chapter.page}</small>
        </button>)}</nav>
      </aside>
      <div className="thesis-reader">
        <div className="thesis-reader-top">
          <span>INTERACTIVE EDITION</span>
          <div className="thesis-reader-options">
            <button type="button" aria-pressed={!textMode} className={!textMode ? 'is-selected' : ''} onClick={() => setTextMode(false)}>Flipbook</button>
            <button type="button" aria-pressed={textMode} className={textMode ? 'is-selected' : ''} onClick={() => {
              const index = chapters.findIndex((chapter, i) => displayedPdfPage >= chapter.page && displayedPdfPage < (chapters[i + 1]?.page || Infinity));
              setTextChapterIndex(Math.max(0, index));
              setTextMode(true);
            }} disabled={!numPages}>Read as text</button>
            <button type="button" onClick={() => setShowHelp(v => !v)} aria-expanded={showHelp} aria-controls="thesis-reading-help">How to read {showHelp ? '−' : '+'}</button>
          </div>
        </div>
        <p id="thesis-reading-help" className="thesis-help" hidden={!showHelp}>For the flipbook, use the Previous/Next buttons, click a page edge or swipe on a touchscreen. Focus the book with Tab to turn pages using Left/Right. For screen readers or selectable text, choose Read as text and select a chapter. The PDF begins with a university repository sheet.</p>
        {textMode ? <AccessibleThesisText file={THESIS_PDF} chapters={chapters} chapterIndex={textChapterIndex} />
        : <>
        <div className="thesis-book-stage" tabIndex={0} role="group" aria-label="Interactive thesis pages. Use Left and Right arrow keys, or the controls below." onKeyDown={handleBookKeyDown}>
          <Document file={THESIS_PDF} onLoadSuccess={({ numPages: pages }) => {setNumPages(pages); setError('');}}
            onLoadError={(e) => setError(e?.message || 'The PDF could not be opened.')}
            loading={<div className="thesis-reader-message">Loading thesis…</div>}
            error={<div className="thesis-reader-message">The embedded reader could not load the PDF. <a href={THESIS_PDF} target="_blank" rel="noopener noreferrer">Open the original PDF ↗</a></div>}>
            {numPages > 0 && <div aria-hidden="true" className="thesis-flipbook-visual"><HTMLFlipBook
              key={numPages}
              ref={flip}
              width={470} height={665} size="stretch"
              minWidth={255} maxWidth={470} minHeight={361} maxHeight={665}
              showCover={true} usePortrait={true} startPage={0}
              drawShadow={true} maxShadowOpacity={0.2} flippingTime={reduceMotion ? 100 : 620}
              autoSize={true} showPageCorners={true} mobileScrollSupport={false}
              className="thesis-flipbook"
              onFlip={(e) => setCurrentIndex(e.data)}>
              {Array.from({ length: bookPages }, (_, i) => <FlipPage
                key={i} pageNumber={i + FIRST_BOOK_PDF_PAGE}
                active={Math.abs(i - currentIndex) <= 5} />)}
            </HTMLFlipBook></div>}
          </Document>
        </div>
        {error && <p className="thesis-error">{error}</p>}
        <div className="thesis-book-controls">
          <button type="button" onClick={previous} disabled={!numPages || currentIndex <= 0} aria-label="Previous page">← <span>Previous</span></button>
          <div className="thesis-book-position" aria-live="polite">{numPages ? `Page ${displayedPdfPage} of ${numPages}` : 'Opening document'}</div>
          <button type="button" onClick={next} disabled={!numPages || currentIndex >= bookPages - 1}><span>Next</span> →</button>
        </div>
        <p className="thesis-reader-note"><a href={THESIS_PDF + '#page=' + displayedPdfPage} target="_blank" rel="noopener noreferrer">Zoom / read this page at full size ↗</a> · This is a reading edition of the archived thesis. The source PDF remains available via the university repository.</p>
        </>}
      </div>
    </div></section>
  </div>;
}
