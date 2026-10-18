import { useEffect, useState } from 'react';
import { site, navigation, researchAreas, projectEntries, publications, activitySections, milestones } from './content.js';
import './styles.css';
import CVPage from './CV.jsx';

const homePath = '/';
const internal = (path) => '#'+path;
function currentPath(){
  try { return decodeURIComponent(window.location.hash.replace(/^#/, '') || '/').replace(/\/+$/, '') || '/'; }
  catch { return '/'; }
}

function LocalLink({to, children, className='', ...props}) {
  return <a href={internal(to)} className={className} {...props}>{children}</a>;
}
function ExtLink({href,children,className=''}) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true" className="arrow">↗</span></a>;
}
function Eyebrow({children}) {return <p className="eyebrow">{children}</p>;}
function SectionIntro({eyebrow,title,description,link,linkText}) {
  return <div className="section-intro"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div><div className="section-intro-right">{description&&<p>{description}</p>}{link&&<LocalLink to={link} className="text-link">{linkText||'Explore'} <span aria-hidden="true">→</span></LocalLink>}</div></div>;
}
function MediaSlot({title='Photograph or illustration',caption,kind='visual',format='landscape',className=''}) {
  return <div className={'media-slot '+format+' '+kind+' '+className} role="img" aria-label={'Placeholder for '+title}>
    <div className="media-slot-main"><span className="slot-mark" aria-hidden="true"><span></span><span></span></span><span className="slot-type">{kind==='photo'?'PHOTO':kind==='figure'?'SCIENTIFIC FIGURE':'IMAGE'} PLACEHOLDER</span><strong>{title}</strong></div>
    {caption&&<div className="media-caption">{caption}</div>}
  </div>;
}
function Portrait({className=''}) {
  return <figure className={'portrait-photo '+className}>
    <img src={import.meta.env.BASE_URL+'bas.jpeg'} alt="Portrait of Bas van der Velden" loading={className.includes('hero')?'eager':'lazy'} decoding="async"/>
    <figcaption>Photo: © Rozanne van der Velden-Land</figcaption>
  </figure>;
}
function ChefsImage({className=''}) {
  return <figure className={'chefs-visual '+className}>
    <img src={import.meta.env.BASE_URL+'chefs.svg'} alt="CHEFS mascot illustration, a smiling food can wearing a chef's hat" loading="lazy"/>
  </figure>;
}
function PageHeader({kicker,title,lead,compact=false}) {
  return <header className={'page-header '+(compact?'compact':'')}><div className="container"><Eyebrow>{kicker}</Eyebrow><h1>{title}</h1><p className="page-lead">{lead}</p></div></header>;
}
function Breadcrumbs({parent, parentPath, title}) {
  return <nav aria-label="Breadcrumb" className="breadcrumbs"><LocalLink to={homePath}>Home</LocalLink><span>/</span><LocalLink to={parentPath}>{parent}</LocalLink><span>/</span><span aria-current="page">{title}</span></nav>;
}
function ActionRow({to,href,children,secondary=false}){
  const c='action-link'+(secondary?' secondary':'');
  return href?<ExtLink href={href} className={c}>{children}</ExtLink>:<LocalLink to={to} className={c}>{children}<span aria-hidden="true">↗</span></LocalLink>;
}
function ResearchMiniCard({item}) {
  return <LocalLink className="research-mini" to={'/research/'+item.slug}>
    <div className="card-meta"><span>{item.number}</span><span>RESEARCH AREA</span></div>
    <h3>{item.title}</h3><p>{item.short}</p><span className="card-arrow" aria-hidden="true">↗</span>
  </LocalLink>;
}
function PublicationRows({items}) {
  return <div className="publication-list">{items.map(p=><a key={p.title} className="publication-row" href={p.url} target="_blank" rel="noopener noreferrer">
    <div className="pub-meta"><span>{p.year}</span><span>{p.type}</span></div>
    <div className="pub-body"><h3>{p.title}</h3><p>{p.authors}</p><p className="pub-journal">{p.journal}</p></div>
    <span className="pub-open" aria-hidden="true">↗</span>
  </a>)}</div>;
}
function Home(){
  return <>
    <section className="home-hero"><div className="container hero-layout">
      <div className="hero-copy">
        <Eyebrow>RESEARCHER · SCIENTIFIC LEADER · AI FOR FOOD SAFETY</Eyebrow>
        <h1>Artificial intelligence for <em>better science.</em></h1>
        <p className="lead">{site.intro}</p>
        <div className="hero-meta"><strong>{site.name}</strong><span>{site.role}</span><span>{site.organisation}</span></div>
        <div className="action-row"><ActionRow to="/research">Explore my research</ActionRow><ActionRow to="/about" secondary>About me</ActionRow></div>
      </div>
      <Portrait className="hero-portrait"/>
    </div></section>
    <section className="band editorial-note"><div className="container note-grid"><strong>Research focus</strong><p>Building trustworthy AI methods, creating strong scientific data foundations and translating results into practical applications for food safety.</p></div></section>
    <section className="section"><div className="container"><SectionIntro eyebrow="01 / RESEARCH" title="Three connected research directions." description="Fundamental methodology and practical relevance are complementary parts of the same research agenda." link="/research" linkText="All research"/>
    <div className="mini-grid">{researchAreas.map(item=><ResearchMiniCard item={item} key={item.slug}/>)}</div></div></section>
    <section className="section section-alt"><div className="container"><SectionIntro eyebrow="02 / SELECTED PROJECTS" title="Where ideas become research programmes." description="A selection of open resources, methodological work and ongoing initiatives." link="/projects" linkText="All projects"/>
    <div className="feature-project"><ChefsImage className="chefs-home"/>
      <div className="feature-project-text"><Eyebrow>OPEN DATA · FOOD MONITORING</Eyebrow><h3>CHEFS</h3><p>Bringing together European food monitoring data to make it more useful for analysis, modelling and risk assessment.</p><div className="feature-stat">392 million <span>analytical results in the published database</span></div><LocalLink to="/projects/chefs" className="text-link">Explore the project <span aria-hidden="true">→</span></LocalLink></div>
    </div>
    <div className="link-strip"><LocalLink to="/projects/living-review">Living AI literature review <span>↗</span></LocalLink><LocalLink to="/projects/foundation-models">Foundation models for analytical data <span>↗</span></LocalLink><LocalLink to="/projects/early-warning">Early warning and emerging risks <span>↗</span></LocalLink></div></div></section>
    <section className="section"><div className="container"><SectionIntro eyebrow="03 / PUBLICATIONS" title="Selected publications." description="Recent peer-reviewed work. The complete publication record is available through Wageningen Research." link="/publications" linkText="View publications"/><PublicationRows items={publications}/></div></section>
    <section className="bottom-cta"><div className="container bottom-cta-layout"><div><Eyebrow>COLLABORATION</Eyebrow><h2>Interested in working together?</h2><p>Scientific collaboration, research projects, invited talks and methodological exchange.</p></div><ActionRow to="/contact">Get in touch</ActionRow></div></section>
  </>;
}
function ResearchIndex() {
  return <>
    <PageHeader kicker="RESEARCH" title="Methods, data and impact." lead="My work spans trustworthy and explainable AI, foundation models for scientific data, and their applications in food safety."/>
    <section className="section first-section"><div className="container"><div className="editorial-grid"><div><Eyebrow>THE APPROACH</Eyebrow><h2>Connecting methodological depth to domain questions.</h2><p>Many AI research challenges emerge from the scientific context: incomplete labels, changing data distributions, scarce examples and explanations that need expert scrutiny.</p><p>The goal is not only to create better algorithms, but to understand when and why they help researchers make more informed decisions.</p></div><MediaSlot kind="figure" format="wide" title="Research framework: methods × data × food safety" caption="Suggested: overarching research agenda figure"/></div></div></section>
    <section className="section section-alt"><div className="container"><SectionIntro eyebrow="RESEARCH AREAS" title="Explore the research directions." description="Each area has its own page for concepts, methods, applications and future research output."/>
    <div className="research-list">{researchAreas.map(a=><LocalLink to={'/research/'+a.slug} className="research-line" key={a.slug}><div><span className="index-label">{a.number}</span><h3>{a.title}</h3><p>{a.short}</p></div><span className="large-arrow">↗</span></LocalLink>)}</div></div></section>
  </>;
}
function ResearchDetail({item}) {
  return <>
    <div className="article-top container"><Breadcrumbs parent="Research" parentPath="/research" title={item.title}/></div>
    <PageHeader compact kicker={'RESEARCH AREA '+item.number} title={item.title} lead={item.lead}/>
    <section className="section first-section"><div className="container article-layout">
      <div className="article-main"><Eyebrow>RESEARCH PERSPECTIVE</Eyebrow><h2>Scientific questions and challenges</h2><p className="large-body">{item.perspective}</p>
      <MediaSlot kind="figure" format="wide" title={item.media} caption="Reserved for a custom scientific illustration"/>
      <h2>Methodological approach</h2><ul className="line-list">{item.approach.map(x=><li key={x}>{x}</li>)}</ul>
      <h2>Application areas</h2><ul className="line-list">{item.applications.map(x=><li key={x}>{x}</li>)}</ul></div>
      <aside className="article-aside"><div className="aside-panel"><strong>RESEARCH AREA {item.number}</strong><p>{item.short}</p><LocalLink to="/research" className="text-link">All research <span>→</span></LocalLink></div><div className="aside-panel"><strong>RELATED PROJECTS</strong>{item.related.map(slug=>{let p=projectEntries.find(v=>v.slug===slug);return p?<LocalLink key={slug} to={'/projects/'+slug} className="aside-link">{p.title} <span>↗</span></LocalLink>:null})}</div></aside>
    </div></section>
    <div className="container next-page"><span>CONTINUE EXPLORING</span><LocalLink to="/research">Back to all research <span>→</span></LocalLink></div>
  </>;
}
function ProjectsIndex() {
  return <>
    <PageHeader kicker="PROJECTS & DATA RESOURCES" title="Research in practice." lead="Open datasets, software, methods and applied collaborations. Selected projects are outlined here; additional project pages can be added over time."/>
    <section className="section first-section"><div className="container project-grid">
      {projectEntries.map((p,i)=><article key={p.slug} className="project-tile">
        {p.slug==='chefs'?<ChefsImage className="chefs-project-card"/>:<MediaSlot kind={i%2?'photo':'figure'} format="landscape" title={p.media}/>}
        <div className="project-tile-copy"><Eyebrow>{p.category}</Eyebrow><h2>{p.title}</h2><p>{p.summary}</p><LocalLink to={'/projects/'+p.slug} className="text-link">Read project overview <span>→</span></LocalLink></div>
      </article>)}
    </div></section>
  </>;
}
function ProjectDetail({item}) {
  return <>
    <div className="article-top container"><Breadcrumbs parent="Projects" parentPath="/projects" title={item.title}/></div>
    <PageHeader compact kicker={item.category.toUpperCase()} title={item.title} lead={item.lead}/>
    <section className="section first-section"><div className="container">
      {item.slug==='chefs'?<ChefsImage className="chefs-detail"/>:<MediaSlot kind="figure" format="panorama" title={item.media} caption="Project hero image / visualisation"/>}
      <div className="article-layout project-article">
        <div className="article-main"><Eyebrow>PROJECT OVERVIEW</Eyebrow><h2>Research context</h2><p className="large-body">{item.context}</p><h2>Our contribution</h2><p>{item.contribution}</p><h2>Outlook</h2><p>{item.next}</p>
        <MediaSlot kind="figure" format="wide" title={item.secondaryMedia} caption="Reserved for a project-specific result, chart or methodology figure"/></div>
        <aside className="article-aside"><div className="aside-panel"><strong>PROJECT</strong><p>{item.summary}</p><ExtLink href={item.link} className="text-link">{item.linkLabel}</ExtLink></div><div className="aside-panel"><strong>MORE PROJECTS</strong>{projectEntries.filter(x=>x.slug!==item.slug).slice(0,3).map(x=><LocalLink key={x.slug} className="aside-link" to={'/projects/'+x.slug}>{x.title}<span>↗</span></LocalLink>)}</div></aside>
      </div>
    </div></section>
  </>;
}
function Publications() {
  const [filter,setFilter] = useState('All');
  const labels=['All','Research article','Review'];
  return <>
    <PageHeader kicker="SCIENTIFIC OUTPUT" title="Publications." lead="A curated starting selection of peer-reviewed work, with direct links to the publications. The full bibliography will be incorporated as the site develops."/>
    <section className="section first-section"><div className="container"><div className="pub-tools"><div className="filter-row" role="group" aria-label="Filter publications">{labels.map(label=><button type="button" key={label} aria-pressed={label===filter} onClick={()=>setFilter(label)} className={filter===label?'active':''}>{label}</button>)}</div><ExtLink href={site.links.research} className="text-link">Full record at Research@WUR</ExtLink></div>
    <PublicationRows items={publications.filter(p=>filter==='All'||p.type===filter)}/>
    <div className="content-addition"><div><Eyebrow>COMPLETE BIBLIOGRAPHY</Eyebrow><h3>More publications will follow.</h3><p>This section is intentionally curated rather than presenting an incomplete list as exhaustive. Future updates can include searchable topics, publication types and DOI metadata.</p></div><MediaSlot title="Publication visual / selected paper cover" kind="figure" format="landscape"/></div>
    </div></section>
  </>;
}
function AcademicActivities(){
  return <>
    <PageHeader kicker="ACADEMIC ACTIVITIES" title="Research is a collective endeavour." lead="Scientific exchange, community-building and mentorship are important parts of my work alongside research and project delivery."/>
    <section className="section first-section"><div className="container"><div className="editorial-grid"><div><Eyebrow>COMMUNITY & EXCHANGE</Eyebrow><h2>Connecting researchers and ideas.</h2><p>AI for food safety is an interdisciplinary field. Making progress requires researchers in AI, toxicology, chemistry, microbiology, risk assessment and policy to learn from one another.</p><p>These activities range from invited scientific presentations to organising collaborative initiatives and building cross-disciplinary teams.</p></div><MediaSlot kind="photo" format="wide" title="Conference talk / scientific event photograph" caption="Suggested: invited talk, conference or team event"/></div></div></section>
    <section className="section section-alt"><div className="container activity-grid">{activitySections.map((a,i)=><article className="activity-card" key={a.title}><span className="index-label">0{i+1}</span><h2>{a.title}</h2><p>{a.description}</p><ul>{a.entries.map(e=><li key={e}>{e}</li>)}</ul></article>)}</div></section>
    <section className="section"><div className="container"><SectionIntro eyebrow="PHOTO GALLERY" title="Speaking, collaboration & research." description="Space for documented activities and scientific highlights."/><div className="gallery-placeholders"><MediaSlot kind="photo" format="landscape" title="Keynote or invited talk"/><MediaSlot kind="photo" format="landscape" title="Conference / community event"/><MediaSlot kind="photo" format="landscape" title="Research team or collaboration"/></div></div></section>
  </>;
}
function About(){
  return <>
    <PageHeader kicker="ABOUT" title="A researcher, a team leader, and a builder of programmes." lead="My work combines machine learning research, scientific collaboration and developing people and research directions."/>
    <section className="section first-section"><div className="container about-columns"><Portrait className="about-portrait"/><div><Eyebrow>BACKGROUND</Eyebrow><h2>From medical imaging to AI for food safety.</h2>{site.about.map(p=><p key={p}>{p}</p>)}<ExtLink href={site.links.research} className="text-link">Scientific profile</ExtLink> <LocalLink to="/cv" className="text-link about-cv-link">Full academic CV <span>→</span></LocalLink></div></div></section>
    <section className="section section-alt"><div className="container"><SectionIntro eyebrow="EXPERIENCE" title="Selected roles and background." description="For a complete overview of appointments, projects, acquisition, supervision, talks and service, explore the searchable CV."/><div className="milestones">{milestones.map(m=><div className="milestone" key={m.title}><span>{m.date}</span><div><h3>{m.title}</h3><p>{m.institution}</p></div></div>)}</div></div></section>
    <section className="section"><div className="container editorial-grid"><div><Eyebrow>BEYOND INDIVIDUAL RESEARCH</Eyebrow><h2>Building an environment for good research.</h2><p>I care about the conditions that make sustainable science possible: trusted methods, shared data, collaboration across disciplines and time for researchers to develop ambitious ideas.</p><LocalLink to="/academic-activities" className="text-link">Academic activities <span>→</span></LocalLink></div><MediaSlot kind="photo" format="wide" title="Team / laboratory environment" caption="Suggested: an authentic photo of the research team"/></div></section>
  </>;
}
function Contact(){
  return <>
    <PageHeader kicker="CONTACT" title="Let's exchange ideas." lead="For scientific collaboration, invited talks, research initiatives or questions about my work, feel free to get in touch."/>
    <section className="section first-section"><div className="container contact-columns"><div className="contact-panel"><Eyebrow>GET IN TOUCH</Eyebrow><h2>Email</h2><a href={'mailto:'+site.email} className="email-address">{site.email} <span>↗</span></a><p>{site.organisation}<br/>{site.location}</p></div><div className="contact-panel subtle"><Eyebrow>ONLINE PROFILES</Eyebrow><h2>Find my work</h2><ExtLink href={site.links.research} className="contact-profile">Research@WUR</ExtLink><ExtLink href={site.links.github} className="contact-profile">GitHub</ExtLink><ExtLink href={site.links.wur} className="contact-profile">Wageningen Food Safety Research</ExtLink></div></div></section>
  </>;
}
function NotFound(){return <div className="container notfound"><Eyebrow>404</Eyebrow><h1>Page not found.</h1><p>The requested page does not exist.</p><ActionRow to="/">Return home</ActionRow></div>}
function App(){
  const [path,setPath]=useState(currentPath);
  const [menuOpen,setMenuOpen]=useState(false);
  const [theme,setTheme]=useState(()=>{
    try{const saved=localStorage.getItem('bas-theme');if(saved==='dark'||saved==='light')return saved}catch{}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light';
  });
  useEffect(()=>{
    const onHash=()=>setPath(currentPath());
    window.addEventListener('hashchange',onHash);
    return()=>window.removeEventListener('hashchange',onHash);
  },[]);
  useEffect(()=>{
    window.scrollTo({top:0,behavior:'instant'});
    setMenuOpen(false);
    const label=navigation.find(n=>n.path===path)?.label || researchAreas.find(x=>path==='/research/'+x.slug)?.title || projectEntries.find(x=>path==='/projects/'+x.slug)?.title || (path.startsWith('/cv')?'Full academic CV':'Page');
    document.title=(path==='/'?'Bas van der Velden':label+' | Bas van der Velden')+' — AI for Food Safety';
  },[path]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('bas-theme',theme)}catch{}},[theme]);
  let page;
  if(path==='/') page=<Home/>;
  else if(path==='/research') page=<ResearchIndex/>;
  else if(path.startsWith('/research/')) {let a=researchAreas.find(x=>'/research/'+x.slug===path);page=a?<ResearchDetail item={a}/>:<NotFound/>}
  else if(path==='/projects') page=<ProjectsIndex/>;
  else if(path.startsWith('/projects/')) {let p=projectEntries.find(x=>'/projects/'+x.slug===path);page=p?<ProjectDetail item={p}/>:<NotFound/>}
  else if(path==='/publications') page=<Publications/>;
  else if(path==='/academic-activities') page=<AcademicActivities/>;
  else if(path==='/about') page=<About/>;
  else if(path==='/cv'||/^\/cv\/\d+$/.test(path)) page=<CVPage sectionNumber={path.split('/')[2]}/>;
  else if(path==='/contact') page=<Contact/>;
  else page=<NotFound/>;
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header"><div className="container header-content">
      <LocalLink to="/" className="wordmark"><span className="wordmark-name">Bas van der Velden<span className="wordmark-dot">.</span></span><span className="wordmark-description">AI FOR FOOD SAFETY</span></LocalLink>
      <nav aria-label="Primary navigation" id="primary-nav" className={'site-nav '+(menuOpen?'is-open':'')}>
        {navigation.map(n=><LocalLink key={n.path} to={n.path} className={n.path==='/'?path==='/'?'is-active':'':path===n.path||path.startsWith(n.path+'/')?'is-active':''} aria-current={path===n.path?'page':undefined}>{n.label}</LocalLink>)}
        <LocalLink to="/contact" className={'contact-nav '+(path==='/contact'?'is-active':'')}>Contact <span>↗</span></LocalLink>
      </nav>
      <div className="header-tools"><button className="theme-toggle" aria-label={'Switch to '+(theme==='light'?'dark':'light')+' mode'} onClick={()=>setTheme(t=>t==='light'?'dark':'light')} title="Toggle color theme">{theme==='light'?'☾':'☀'}</button><button className="menu-toggle" type="button" aria-controls="primary-nav" aria-expanded={menuOpen} aria-label="Toggle menu" onClick={()=>setMenuOpen(m=>!m)}><span></span><span></span><span></span></button></div>
    </div></header>
    <main id="main">{page}</main>
    <footer className="site-footer"><div className="container footer-layout"><div><strong>{site.name}</strong><p>{site.role}<br/>{site.organisation}</p></div><nav aria-label="Footer navigation"><LocalLink to="/research">Research</LocalLink><LocalLink to="/projects">Projects</LocalLink><LocalLink to="/publications">Publications</LocalLink><LocalLink to="/cv">Full CV</LocalLink><LocalLink to="/contact">Contact</LocalLink></nav><div><p>© {new Date().getFullYear()} Bas van der Velden</p><p>Wageningen, the Netherlands</p></div></div></footer>
  </>;
}
export default App;
