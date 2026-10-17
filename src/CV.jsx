import { useMemo, useState } from 'react';
import cv from './cv-data.json';
import './cv.css';

const external = (url) => /^https:\/\//i.test(url || '');
const startYear = (period) => /^\d{4}/.exec(period || '')?.[0] || '';
// Topic synonyms: searching for "XAI" also finds entries spelled out as "explainable AI", etc.
const normalize = text => String(text || '').toLocaleLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
const topicAliases = {
  xai: ['explainab', 'explainable artificial intelligence', 'interpretability', 'interpretab', 'uitlegbare ai', 'verklaarbare ai', 'transparent machine learning', 'black box'],
  llm: ['large language model', 'language model'],
  fm: ['foundation model', 'representation learning', 'self-supervised'],
  hrms: ['high-resolution mass spectrometry', 'mass spectrometry', 'lc–hrms', 'lc-hrms']
};
const entryText = (entry) => normalize([entry.title, entry.period, entry.details, entry.meta, entry.group, ...(entry.tags||[]), ...(entry.links || []).map(l=>l.label)].join(' '));
const matchesQuery = (entry, query) => {
  if (!query) return true;
  const text = entryText(entry);
  const alias = topicAliases[query];
  return text.includes(query) || !!alias?.some(term => text.includes(normalize(term)));
};

function Attachment({item}) {
  const [play, setPlay] = useState(false);
  if (item.type === 'video') {
    const match = (item.src || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
    return <div className="cv-media-card">
      {play && match ? <div className="cv-embed"><iframe title={item.title} loading="lazy" allowFullScreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" src={'https://www.youtube-nocookie.com/embed/'+match[1]+'?autoplay=1'} /></div>
      : <div className="cv-media-placeholder cv-video"><span>VIDEO / PODCAST</span><strong>{item.title}</strong>{item.src ? <button type="button" onClick={()=>setPlay(true)}>Play video ▷</button> : <small>Add a video URL to the CV data file</small>}</div>}
      <div className="cv-media-description"><span>{item.caption}</span>{external(item.link)&&<a href={item.link} target="_blank" rel="noopener noreferrer">Audio episode ↗</a>}</div>
    </div>;
  }
  return <div className="cv-media-card">
    {item.src ? <img className="cv-media-img" src={item.src} alt={item.alt || item.title} loading="lazy"/> : <div className="cv-media-placeholder"><span>IMAGE / PHOTO</span><strong>{item.title}</strong><small>Image placeholder · add file under public/images/cv</small></div>}
    <div className="cv-media-description"><span>{item.caption}</span></div>
  </div>;
}

function Entry({entry,compact}) {
  return <article className={'cv-entry '+(compact?'cv-entry-compact':'')} id={entry.id}>
    <div className="cv-entry-date">{entry.period || '—'}</div>
    <div className="cv-entry-body">
      {entry.group && <p className="cv-entry-group">{entry.group}</p>}
      <h3>{entry.title}</h3>
      {entry.meta && <p className="cv-entry-meta">{entry.meta}</p>}
      {!compact && entry.details && <p className="cv-entry-description">{entry.details}</p>}
      {entry.links?.length>0 && <div className="cv-entry-links">{entry.links.filter(link=>external(link.url)).map((link,i)=><a href={link.url} target="_blank" rel="noopener noreferrer" key={link.url+i}>{link.label} ↗</a>)}</div>}
      {entry.media?.length>0 && <div className="cv-inline-media">{entry.media.map((m,i)=><Attachment key={i} item={m}/>)}</div>}
    </div>
  </article>;
}

function CvSection({section,entries,compact,collapsed,onToggle}){
  return <section className="cv-record-section" aria-labelledby={'heading-'+section.id} id={section.id}>
    <button type="button" className="cv-section-header" onClick={onToggle} aria-expanded={!collapsed}>
      <div><span className="cv-section-number">{String(section.number).padStart(2,'0')}</span><h2 id={'heading-'+section.id}>{section.title}</h2><span className="cv-section-count">{entries.length} {entries.length===1?'entry':'entries'}</span></div>
      <span className="cv-chevron" aria-hidden="true">{collapsed?'＋':'−'}</span>
    </button>
    {!collapsed && <>
      {section.description && <p className="cv-section-description">{section.description}</p>}
      <div className="cv-entries">{entries.map(e=><Entry key={e.id} entry={e} compact={compact}/>)}</div>
    </>}
  </section>;
}

export default function CVPage({sectionNumber}) {
  const [search,setSearch]=useState('');
  const [year,setYear]=useState('All years');
  const [category,setCategory]=useState('All topics');
  const [compact,setCompact]=useState(false);
  const [collapsed,setCollapsed]=useState([]);
  const years=useMemo(()=>[...new Set(cv.sections.flatMap(s=>s.entries.map(e=>startYear(e.period)).filter(Boolean)))].sort((a,b)=>Number(b)-Number(a)),[]);
  const categories=useMemo(()=>[...new Set(cv.sections.map(s=>s.category))],[]);
  const selected=sectionNumber?cv.sections.find(s=>s.number===Number(sectionNumber)):null;
  const baseSections=selected?[selected]:cv.sections;
  const query=normalize(search.trim());
  const filtered=baseSections.filter(s=>category==='All topics'||s.category===category).map(s=>({...s,visible:s.entries.filter(e=>matchesQuery(e,query)&&(year==='All years'||startYear(e.period)===year))})).filter(s=>s.visible.length);
  const resultCount=filtered.reduce((sum,s)=>sum+s.visible.length,0);
  const totalCount=cv.sections.reduce((sum,s)=>sum+s.entries.length,0);
  const clear=()=>{setSearch('');setYear('All years');setCategory('All topics');setCollapsed([])};
  return <div className="cv-page">
    <div className="cv-hero"><div className="container">
      <div className="cv-breadcrumb"><a href="#/about">About</a><span>/</span><a href="#/cv">Full academic CV</a>{selected&&<><span>/</span><span>{selected.title}</span></>}</div>
      <p className="cv-kicker">ACADEMIC RECORD · {cv.updated.toUpperCase()}</p>
      <h1>Academic <em>curriculum vitae.</em></h1>
      <p className="cv-hero-lead">An extended, searchable record of research, leadership, grants, projects, supervision, publications, talks and scientific service. The entries are sourced from my October 2026 long CV.</p>
      <div className="cv-actions">
        <a href="mailto:bas.vandervelden@wur.nl" className="cv-primary-action">Contact <span>↗</span></a>
        <button type="button" className="cv-secondary-action" onClick={()=>window.print()}>Print / save as PDF <span>↗</span></button>
      </div>
      <div className="cv-metrics">
        <div><strong>{cv.sections.length}</strong><span>Sections</span></div>
        <div><strong>{totalCount}</strong><span>CV entries</span></div>
        <div><strong>{cv.updated}</strong><span>Source snapshot</span></div>
      </div>
    </div></div>
    <div className="container cv-page-layout">
      <aside className="cv-sidebar" aria-label="CV table of contents">
        <div className="cv-sidebar-sticky">
          <div className="cv-sidebar-heading">BROWSE CV <span>{cv.sections.length}</span></div>
          <a className={!selected?'cv-sidebar-active':''} href="#/cv">All sections</a>
          <div className="cv-sidebar-links">{cv.sections.map(s=><a href={'#/cv/'+s.number} className={selected?.number===s.number?'cv-sidebar-active':''} key={s.number}><span>{String(s.number).padStart(2,'0')}</span>{s.title}</a>)}</div>
          <div className="cv-sidebar-extra"><a href={cv.profile.links[0].url} target="_blank" rel="noopener noreferrer">Full publications on WUR ↗</a><a href="#/about">Back to About →</a></div>
        </div>
      </aside>
      <div className="cv-main">
        <section className="cv-toolbar" aria-label="Search and filter CV">
          <label className="cv-search-label" htmlFor="cv-search">SEARCH THE CV</label>
          <div className="cv-search-field"><span aria-hidden="true">⌕</span><input id="cv-search" type="search" value={search} onChange={e=>{setSearch(e.target.value);setCollapsed([])}} placeholder="Search talks, collaborators, projects, journals…" autoComplete="off"/></div>
          <div className="cv-filter-row">
            <label>Topic <select value={category} onChange={e=>{setCategory(e.target.value);setCollapsed([])}}><option>All topics</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
            <label>Start year <select value={year} onChange={e=>{setYear(e.target.value);setCollapsed([])}}><option>All years</option>{years.map(y=><option key={y}>{y}</option>)}</select></label>
            <button type="button" className="cv-reset" onClick={clear}>Reset filters</button>
          </div>
        </section>
        <section className="cv-results-head" aria-live="polite">
          <div><strong>{resultCount}</strong> {resultCount===1?'result':'results'}{selected?' in '+selected.title:''}</div>
          <div className="cv-view-actions"><button type="button" onClick={()=>setCompact(!compact)}>{compact?'Detailed view':'Compact view'}</button><button type="button" onClick={()=>setCollapsed(collapsed.length?[]:filtered.map(s=>s.id))}>{collapsed.length?'Expand all':'Collapse all'}</button></div>
        </section>
        {filtered.length? <div className="cv-records">{filtered.map(s=><CvSection key={s.id} section={s} entries={s.visible} compact={compact} collapsed={collapsed.includes(s.id)} onToggle={()=>setCollapsed(prev=>prev.includes(s.id)?prev.filter(id=>id!==s.id):[...prev,s.id])}/>)}</div>
        :<div className="cv-no-results"><h2>No matching entries</h2><p>Try a broader search term or remove one of the filters.</p><button type="button" onClick={clear}>Show all entries →</button></div>}
        <div className="cv-publications-note"><strong>About this record</strong><p>This is an online adaptation of the long academic CV from {cv.updated}. The publications section reproduces the <em>selected</em> publications from that document; it is not the full bibliography. Some planned engagements and historical roles may need updating as circumstances change. Financial project figures represent mixed funding categories and WFSR shares, not personal PI funding.</p><a href={cv.profile.links[0].url} target="_blank" rel="noopener noreferrer">See Research@WUR for the full publication record ↗</a></div>
      </div>
    </div>
    <section className="cv-media-section"><div className="container"><div className="cv-media-title"><div><p className="cv-kicker">SELECTED MEDIA</p><h2>Research beyond the publication list.</h2></div><p>Presentations, interviews, scientific figures and visual material. Images can be added without changing the page layout.</p></div><div className="cv-media-grid">{cv.media.map((item,i)=><Attachment item={item} key={i}/>)}</div></div></section>
  </div>;
}
