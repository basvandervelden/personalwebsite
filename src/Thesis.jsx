import { forwardRef, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page as PDFPage, pdfjs } from 'react-pdf';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
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
  const bookPages = numPages ? Math.max(0, numPages - FIRST_BOOK_PDF_PAGE + 1) : 0;

  const goToPdfPage = (pdfPage) => {
    const target = Math.min(Math.max(pdfPage - FIRST_BOOK_PDF_PAGE, 0), bookPages - 1);
    setCurrentIndex(target);
    flip.current?.pageFlip()?.turnToPage(target);
  };
  const previous = () => flip.current?.pageFlip()?.flipPrev();
  const next = () => flip.current?.pageFlip()?.flipNext();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target instanceof HTMLElement && /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') previous();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const displayedPdfPage = Math.min(currentIndex + FIRST_BOOK_PDF_PAGE, numPages || 145);

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

    <section className="thesis-reader-section" aria-label="Interactive thesis reader"><div className="container thesis-reader-layout">
      <aside className="thesis-chapters" aria-label="Thesis chapters">
        <div className="thesis-aside-head">IN THIS THESIS</div>
        <nav>{chapters.map(chapter => <button key={chapter.page} type="button"
          className={displayedPdfPage >= chapter.page && displayedPdfPage < (chapters[chapters.indexOf(chapter) + 1]?.page || Infinity) ? 'is-current' : ''}
          onClick={() => goToPdfPage(chapter.page)} disabled={!numPages}>
          <span>{chapter.title}</span><small>{chapter.page}</small>
        </button>)}</nav>
      </aside>
      <div className="thesis-reader">
        <div className="thesis-reader-top">
          <span>INTERACTIVE EDITION</span>
          <button type="button" onClick={() => setShowHelp(v => !v)} aria-expanded={showHelp}>How to read {showHelp ? '−' : '+'}</button>
        </div>
        {showHelp && <p className="thesis-help">Use the arrows, click a page edge, or swipe on a touchscreen. Select a chapter on the left to jump directly to it. The PDF contains the original repository sheet as its first page.</p>}
        <div className="thesis-book-stage">
          <Document file={THESIS_PDF} onLoadSuccess={({ numPages: pages }) => {setNumPages(pages); setError('');}}
            onLoadError={(e) => setError(e?.message || 'The PDF could not be opened.')}
            loading={<div className="thesis-reader-message">Loading thesis…</div>}
            error={<div className="thesis-reader-message">The embedded reader could not load the PDF. <a href={THESIS_PDF} target="_blank" rel="noopener noreferrer">Open the original PDF ↗</a></div>}>
            {numPages > 0 && <HTMLFlipBook
              key={numPages}
              ref={flip}
              width={470} height={665} size="stretch"
              minWidth={255} maxWidth={470} minHeight={361} maxHeight={665}
              showCover={true} usePortrait={true} startPage={0}
              drawShadow={true} maxShadowOpacity={0.2} flippingTime={620}
              autoSize={true} showPageCorners={true} mobileScrollSupport={false}
              className="thesis-flipbook"
              onFlip={(e) => setCurrentIndex(e.data)}>
              {Array.from({ length: bookPages }, (_, i) => <FlipPage
                key={i} pageNumber={i + FIRST_BOOK_PDF_PAGE}
                active={Math.abs(i - currentIndex) <= 5} />)}
            </HTMLFlipBook>}
          </Document>
        </div>
        {error && <p className="thesis-error">{error}</p>}
        <div className="thesis-book-controls">
          <button type="button" onClick={previous} disabled={!numPages || currentIndex <= 0} aria-label="Previous page">← <span>Previous</span></button>
          <div className="thesis-book-position" aria-live="polite">{numPages ? `Page ${displayedPdfPage} of ${numPages}` : 'Opening document'}</div>
          <button type="button" onClick={next} disabled={!numPages || currentIndex >= bookPages - 1}><span>Next</span> →</button>
        </div>
        <p className="thesis-reader-note"><a href={THESIS_PDF + '#page=' + displayedPdfPage} target="_blank" rel="noopener noreferrer">Zoom / read this page at full size ↗</a> · This is a reading edition of the archived thesis. The source PDF remains available via the university repository.</p>
      </div>
    </div></section>
  </div>;
}
