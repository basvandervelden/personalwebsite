import { forwardRef, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page as PDFPage, pdfjs } from 'react-pdf';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import AccessibleThesisText from './AccessibleThesisText.jsx';
import './thesis.css';
import './paper-reader.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
const BASE = import.meta.env.BASE_URL;
const PaperFlipPage = forwardRef(function PaperFlipPage({ pageNumber, active }, ref) {
  return <div className="thesis-book-page" ref={ref}><div className="thesis-book-paper">
    {active ? <PDFPage pageNumber={pageNumber} width={470}
      renderTextLayer={false} renderAnnotationLayer={false}
      loading={<div className="thesis-page-loading">Loading page {pageNumber}…</div>}/>
      : <div className="thesis-page-loading" aria-hidden="true"/>}
  </div></div>;
});

export default function PaperReader({ paper }) {
  const [fileAvailable,setFileAvailable] = useState(null);
  const [numPages,setNumPages] = useState(null);
  const [page,setPage] = useState(0);
  const [textMode,setTextMode] = useState(false);
  const [help,setHelp] = useState(false);
  const [reduceMotion,setReduceMotion] = useState(()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false);
  const flip = useRef(null);
  const file = BASE + 'papers/' + paper.slug + '.pdf';
  const doiLink = 'https://doi.org/' + paper.doi;
  const licenseLink = paper.license.includes('NC-ND')
    ? 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
    : 'https://creativecommons.org/licenses/by/4.0/';
  useEffect(()=>{
    let alive=true;
    setFileAvailable(null);setPage(0);setNumPages(null);setTextMode(false);
    fetch(BASE+'papers/available.json').then(r=>r.ok?r.json():[])
      .then(items=>{if(alive)setFileAvailable(items.includes(paper.slug));})
      .catch(()=>{if(alive)setFileAvailable(false)});
    return()=>{alive=false};
  },[paper.slug]);
  useEffect(()=>{
    const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if(!media)return;
    const update=()=>setReduceMotion(media.matches);
    media.addEventListener?.('change',update);
    return()=>media.removeEventListener?.('change',update);
  },[]);
  const bookKey=e=>{
    if(e.target!==e.currentTarget)return;
    if(e.key==='ArrowLeft'){e.preventDefault();flip.current?.pageFlip()?.flipPrev();}
    if(e.key==='ArrowRight'){e.preventDefault();flip.current?.pageFlip()?.flipNext();}
  };

  return <div className="thesis-page paper-reader-page">
    <section className="thesis-intro"><div className="container">
      <a className="thesis-back" href="#/publications">← Publications</a>
      <p className="thesis-eyebrow">FEATURED PAPER · {paper.journal} · {paper.year}</p>
      <h1>{paper.title}</h1>
      <p className="thesis-byline">{paper.authors}</p>
      <div className="thesis-links">
        {fileAvailable && <a className="thesis-download" href={file} target="_blank" rel="noopener noreferrer">Open / download PDF <span aria-hidden="true">↗</span></a>}
        <a href={doiLink} target="_blank" rel="noopener noreferrer">Original publication / DOI ↗</a>
      </div>
    </div></section>
    <section className="thesis-reader-section" aria-label="Paper reader"><div className="container paper-reader-content">
      <div className="thesis-reader">
        <div className="thesis-reader-top">
          <span>READ THE PAPER</span>
          {fileAvailable && <div className="thesis-reader-options">
            <button type="button" aria-pressed={!textMode} className={!textMode?'is-selected':''} onClick={()=>setTextMode(false)}>Flipbook</button>
            <button type="button" aria-pressed={textMode} className={textMode?'is-selected':''} onClick={()=>setTextMode(true)} disabled={!numPages}>Read as text</button>
            <button type="button" aria-expanded={help} aria-controls="paper-reading-help" onClick={()=>setHelp(v=>!v)}>How to read {help?'−':'+'}</button>
          </div>}
        </div>
        <p id="paper-reading-help" className="thesis-help" hidden={!help}>Use Previous and Next or swipe to turn pages. Focus the book with Tab for Left/Right arrow controls. Choose Read as text for a selectable, screen-reader-friendly extraction of the original PDF. Figures and tables are best consulted in the original layout.</p>
        {fileAvailable === null && <div className="thesis-reader-message" role="status">Checking available open-access PDF…</div>}
        {fileAvailable === false && <div className="thesis-reader-message">
          <p>The locally hosted copy is temporarily unavailable.</p>
          <a href={paper.sourcePdf} target="_blank" rel="noopener noreferrer">View the openly licensed PDF at its source ↗</a>
          <a href={doiLink} target="_blank" rel="noopener noreferrer">Open the publication page ↗</a>
        </div>}
        {fileAvailable === true && (textMode
          ? <AccessibleThesisText file={file} chapters={[{title:paper.title,page:1}]} chapterIndex={0}/>
          : <>
            <div className="thesis-book-stage" role="group" tabIndex={0}
              aria-label="Interactive paper pages. Use left and right arrow keys." onKeyDown={bookKey}>
              <Document file={file}
                onLoadSuccess={({numPages:n})=>setNumPages(n)}
                onLoadError={()=>setFileAvailable(false)}
                loading={<div className="thesis-reader-message">Loading paper…</div>}>
                {numPages && <div className="thesis-flipbook-visual" aria-hidden="true">
                  <HTMLFlipBook ref={flip} key={numPages} width={470} height={665}
                    size="stretch" minWidth={255} maxWidth={470} minHeight={361} maxHeight={665}
                    showCover={true} usePortrait={true} startPage={0} drawShadow={true}
                    maxShadowOpacity={0.2} flippingTime={reduceMotion?100:620}
                    autoSize={true} showPageCorners={true} mobileScrollSupport={false}
                    className="thesis-flipbook" onFlip={e=>setPage(e.data)}>
                    {Array.from({length:numPages},(_,i)=><PaperFlipPage key={i} pageNumber={i+1} active={Math.abs(i-page)<=5}/>)}
                  </HTMLFlipBook>
                </div>}
              </Document>
            </div>
            <div className="thesis-book-controls">
              <button type="button" disabled={!numPages||page<=0} onClick={()=>flip.current?.pageFlip()?.flipPrev()} aria-label="Previous page">← <span>Previous</span></button>
              <span className="thesis-book-position" aria-live="polite">{numPages?'Page '+(page+1)+' of '+numPages:'Opening paper'}</span>
              <button type="button" disabled={!numPages||page>=numPages-1} onClick={()=>flip.current?.pageFlip()?.flipNext()} aria-label="Next page"><span>Next</span> →</button>
            </div>
            <p className="thesis-reader-note"><a href={file+'#page='+(page+1)} target="_blank" rel="noopener noreferrer">Read at full size ↗</a></p>
          </>)}
        <p className="paper-license-note">Published by {paper.journal} ({paper.year}).
          Original article: <a href={doiLink} target="_blank" rel="noopener noreferrer">{paper.doi}</a>.
          Reproduced without changes under <a href={licenseLink} target="_blank" rel="noopener noreferrer">{paper.license}</a>.
          Copyright and attribution remain with the original authors and publisher as indicated in the PDF.</p>
      </div>
    </div></section>
  </div>;
}
