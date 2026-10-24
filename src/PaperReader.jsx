import { forwardRef, useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page as PDFPage, pdfjs } from 'react-pdf';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import AccessibleThesisText from './AccessibleThesisText.jsx';
import './thesis.css';
import './paper-reader.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
const BASE = import.meta.env.BASE_URL;
const PaperFlipPage = forwardRef(function PaperFlipPage({ pageNumber, active, width }, ref) {
  return <div className="thesis-book-page" ref={ref}><div className="thesis-book-paper">
    {active ? <PDFPage pageNumber={pageNumber} width={width}
      // Render the actual target page size at >=2x screen resolution.
      // Previously a 470px canvas was stretched to the book's physical page.
      devicePixelRatio={Math.min(2.2, Math.max(2, window.devicePixelRatio || 1))}
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
  const [fullscreen,setFullscreen] = useState(false);
  const [fullscreenError,setFullscreenError] = useState('');
  const [zoom,setZoom] = useState(1);
  const [viewportWidth,setViewportWidth] = useState(()=>window.innerWidth);
  const [reduceMotion,setReduceMotion] = useState(()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false);
  const flip = useRef(null);
  const readerRef = useRef(null);
  const fullscreenStageRef = useRef(null);
  const file = BASE + 'papers/' + paper.slug + '.pdf';
  const doiLink = 'https://doi.org/' + paper.doi;
  const isAuthorPreprint = paper.versionType === 'author-preprint';
  const licenseLink = !isAuthorPreprint && (paper.license.includes('NC-ND')
    ? 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
    : 'https://creativecommons.org/licenses/by/4.0/');
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
  // Native fullscreen does not change the site's normal embedded flipbook.
  // Inside fullscreen, a single page fills the reader and can be zoomed.
  useEffect(()=>{
    const update=()=>{
      const active=document.fullscreenElement===readerRef.current;
      setFullscreen(active);
      setViewportWidth(active ? readerRef.current.clientWidth : window.innerWidth);
    };
    const onResize=()=>setViewportWidth(document.fullscreenElement===readerRef.current
      ? readerRef.current.clientWidth : window.innerWidth);
    document.addEventListener('fullscreenchange',update);
    window.addEventListener('resize',onResize);
    return()=>{
      document.removeEventListener('fullscreenchange',update);
      window.removeEventListener('resize',onResize);
    };
  },[]);
  const toggleFullscreen=()=>{
    if(fullscreen){void document.exitFullscreen?.();return;}
    if(!readerRef.current?.requestFullscreen){
      setFullscreenError('Fullscreen is not available in this browser. You can open the PDF at full size instead.');
      return;
    }
    setFullscreenError('');
    setTextMode(false);
    setZoom(1);
    // Call requestFullscreen directly in the click handler (user activation).
    readerRef.current.requestFullscreen().catch(()=>{
      setFullscreenError('Fullscreen could not be started. Open the PDF at full size instead.');
    });
  };
  const stepPage=direction=>setPage(p=>Math.max(0,Math.min((numPages||1)-1,p+direction)));
  // Two-up on laptops/desktops, one page on narrow screens. Keep a generous
  // gutter so the flipbook never silently shrinks itself to fit the container.
  const portraitBook = viewportWidth < 760;
  const bookWidth = Math.round(portraitBook
    ? Math.min(680, Math.max(270, viewportWidth - 76))
    : Math.min(750, Math.max(310, (viewportWidth - 150) / 2)));
  const bookHeight = Math.round(bookWidth * 1.415);
  const fullWidth=Math.round(Math.max(240,Math.min(1350,viewportWidth-96))*zoom);
  useEffect(()=>{
    if(fullscreen) fullscreenStageRef.current?.scrollTo({top:0,left:0,behavior:'instant'});
  },[page,fullscreen]);
  const fullscreenKeys=e=>{
    if(e.target!==e.currentTarget)return;
    if(e.key==='ArrowLeft'){e.preventDefault();stepPage(-1);}
    if(e.key==='ArrowRight'){e.preventDefault();stepPage(1);}
  };
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
      <div className="thesis-reader paper-reader-surface" ref={readerRef}>
        <div className="thesis-reader-top">
          <span>READ THE PAPER</span>
          {fileAvailable && <div className="thesis-reader-options">
            <button type="button" aria-pressed={!textMode} className={!textMode?'is-selected':''} onClick={()=>setTextMode(false)}>Flipbook</button>
            <button type="button" aria-pressed={textMode} className={textMode?'is-selected':''} onClick={()=>setTextMode(true)} disabled={!numPages}>Read as text</button>
            <button type="button" aria-expanded={help} aria-controls="paper-reading-help" onClick={()=>setHelp(v=>!v)}>How to read {help?'−':'+'}</button>
            <button type="button" className="paper-fullscreen-button" onClick={toggleFullscreen} disabled={!numPages} aria-label={fullscreen?'Exit fullscreen paper reader':'Open paper in fullscreen'}>{fullscreen?'Exit fullscreen ↙':'Fullscreen ⛶'}</button>
          </div>}
        </div>
        <p id="paper-reading-help" className="thesis-help" hidden={!help}>Use Previous and Next or swipe to turn pages. Focus the book with Tab for Left/Right arrow controls. Choose Read as text for a selectable, screen-reader-friendly extraction of the original PDF. In fullscreen, one page is shown at a time, with zoom controls and arrow-key navigation. Press Escape to exit fullscreen. Figures and tables are best consulted in the original layout.</p>
        {fullscreenError && <p role="alert" className="thesis-error">{fullscreenError} <a href={file} target="_blank" rel="noopener noreferrer">Open PDF ↗</a></p>}
        {fileAvailable === null && <div className="thesis-reader-message" role="status">Checking available open-access PDF…</div>}
        {fileAvailable === false && <div className="thesis-reader-message">
          <p>The locally hosted copy is temporarily unavailable.</p>
          <a href={paper.sourcePdf} target="_blank" rel="noopener noreferrer">{isAuthorPreprint ? 'View author preprint on arXiv ↗' : 'View the openly licensed PDF at its source ↗'}</a>
          <a href={doiLink} target="_blank" rel="noopener noreferrer">Open the publication page ↗</a>
        </div>}
        {fileAvailable === true && (fullscreen
          ? <>
            <div className="paper-fullscreen-stage" ref={fullscreenStageRef} role="group" tabIndex={0}
              aria-label="Fullscreen single-page PDF. Press Left or Right for page navigation." onKeyDown={fullscreenKeys}>
              <Document file={file}
                onLoadSuccess={({numPages:n})=>setNumPages(n)}
                loading={<div role="status" className="thesis-reader-message">Loading full-size page…</div>}
                error={<div className="thesis-reader-message">Unable to display this page. <a href={file} target="_blank" rel="noopener noreferrer">Open PDF ↗</a></div>}>
                <PDFPage pageNumber={page+1} width={fullWidth}
                  devicePixelRatio={Math.min(window.devicePixelRatio||1,2)}
                  renderTextLayer={false} renderAnnotationLayer={false}
                  loading={<div role="status" className="thesis-reader-message">Rendering page…</div>}/>
              </Document>
            </div>
            <div className="paper-fullscreen-controls">
              <button type="button" onClick={()=>stepPage(-1)} disabled={page<=0} aria-label="Previous page">← Previous</button>
              <span className="thesis-book-position" aria-live="polite">Page {page+1} of {numPages}</span>
              <button type="button" onClick={()=>stepPage(1)} disabled={page+1>=numPages} aria-label="Next page">Next →</button>
              <div className="paper-zoom-controls" role="group" aria-label="Zoom">
                <button type="button" onClick={()=>setZoom(z=>Math.max(.6,Math.round((z-.2)*10)/10))} disabled={zoom<=.6} aria-label="Zoom out">−</button>
                <span>{Math.round(zoom*100)}%</span>
                <button type="button" onClick={()=>setZoom(z=>Math.min(2.4,Math.round((z+.2)*10)/10))} disabled={zoom>=2.4} aria-label="Zoom in">+</button>
                <button type="button" onClick={()=>setZoom(1)} disabled={zoom===1}>Fit width</button>
              </div>
            </div>
          </>
          : textMode
          ? <AccessibleThesisText file={file} chapters={[{title:paper.title,page:1}]} chapterIndex={0}/>
          : <>
            <div className="thesis-book-stage" role="group" tabIndex={0}
              aria-label="Interactive paper pages. Use left and right arrow keys." onKeyDown={bookKey}>
              <Document file={file}
                onLoadSuccess={({numPages:n})=>setNumPages(n)}
                onLoadError={()=>setFileAvailable(false)}
                loading={<div className="thesis-reader-message">Loading paper…</div>}>
                {numPages && <div className="thesis-flipbook-visual" aria-hidden="true">
                  <HTMLFlipBook ref={flip} key={numPages + '-' + bookWidth}
                    width={bookWidth} height={bookHeight}
                    size="fixed"
                    showCover={true} usePortrait={true} startPage={page} drawShadow={true}
                    maxShadowOpacity={0.2} flippingTime={reduceMotion?100:620}
                    autoSize={true} showPageCorners={true} mobileScrollSupport={false}
                    className="thesis-flipbook" onFlip={e=>setPage(e.data)}>
                    {Array.from({length:numPages},(_,i)=><PaperFlipPage key={i} pageNumber={i+1}
                      width={bookWidth} active={Math.abs(i-page)<=3}/>)}
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
        {isAuthorPreprint
          ? <p className="paper-license-note">Author preprint (arXiv v1, 2017), not the final Springer-published version of this MICCAI 2016 paper.
            <a href={paper.archiveUrl} target="_blank" rel="noopener noreferrer"> View the preprint on arXiv ↗</a>.
            The final authenticated publication is available at <a href={doiLink} target="_blank" rel="noopener noreferrer">{paper.doi}</a>.
            Shared under the publisher's author self-archiving policy; no Creative Commons licence is claimed.</p>
          : <p className="paper-license-note">Published by {paper.journal} ({paper.year}).
            Original article: <a href={doiLink} target="_blank" rel="noopener noreferrer">{paper.doi}</a>.
            Reproduced without changes under <a href={licenseLink} target="_blank" rel="noopener noreferrer">{paper.license}</a>.
            Copyright and attribution remain with the original authors and publisher as indicated in the PDF.</p>}
      </div>
    </div></section>
  </div>;
}
