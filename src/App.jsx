import { useEffect, useRef, useState } from 'react';
import { site, navigation, researchAreas, projectEntries, activitySections, milestones } from './content.js';
import './styles.css';
import pageCopy from './page-copy.json';
import media from './media.json';
import CVPage from './CV.jsx';
import Thesis from './Thesis.jsx';
import PaperReader from './PaperReader.jsx';
import featuredPapers from './featured-papers.json';
import cvData from './cv-data.json';
import { publicationSection, publicationDisplayType, isSupersededPreprint } from './publication-groups.js';
import { publicationTopicNames, publicationHasTopic } from './publication-topics.js';
import PublicationAuthors from './PublicationAuthors.jsx';
import { formatPublicationAuthors, formatPublicationTitle, formatPublicationVenue } from './publication-format.js';

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
    <img src={import.meta.env.BASE_URL+media.portrait.file} alt={media.portrait.alt} loading={className.includes('hero')?'eager':'lazy'} decoding="async"/>
    <figcaption>{media.portrait.credit}</figcaption>
  </figure>;
}
function ChefsImage({className=''}) {
  return <figure className={'chefs-visual '+className}>
    <img src={import.meta.env.BASE_URL+media.chefs.file} alt={media.chefs.alt} loading="lazy"/>
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
// The long-CV publication inventory is the single source for both publication views.
const cvPublications = (cvData.sections.find(section => section.number === 13)?.entries ?? []).filter(entry => !isSupersededPreprint(entry)).map(entry => {
  const links = entry.links || [];
  const link = links.find(item => /^https:\/\//i.test(item.url || '') && /doi/i.test(item.label || ''))
    || links.find(item => /^https:\/\//i.test(item.url || ''));
  const section = publicationSection(entry);
  const type = publicationDisplayType(entry);
  return {
    id: entry.id || entry.title,
    title: formatPublicationTitle(entry.paperTitle || entry.title, entry.id),
    year: entry.period || '',
    type,
    section,
    authors: formatPublicationAuthors(entry.authors, entry.id),
    journal: formatPublicationVenue(entry.journal),
    impactFactor: section === 'journal' && Number.isFinite(entry.impactFactor) ? entry.impactFactor : null,
    impactFactorYear: entry.impactFactorYear ?? null,
    url: link?.url || ''
  };
});
const featuredPublicationIds = ["cv-13-01","cv-13-03","cv-13-04","cv-13-11","cv-13-13","cv-13-14"];
const featuredPublications = featuredPublicationIds.map(id => cvPublications.find(p => p.id === id)).filter(Boolean);
function PublicationRows({items}) {
  return <div className="publication-list">{items.map(p => {
    const body = <>
      <div className="pub-meta"><span>{p.year}</span><span>{p.type}</span></div>
      <div className="pub-body"><h3>{p.title}</h3>{p.authors&&<p><PublicationAuthors text={p.authors}/></p>}{p.journal&&<p className="pub-journal">{p.journal}{p.impactFactor!==null&&p.impactFactorYear&&<span className="publication-if"> · JIF {p.impactFactorYear}: {p.impactFactor.toFixed(1)}</span>}</p>}</div>
      {p.url&&<span className="pub-open" aria-hidden="true">↗</span>}
    </>;
    return p.url
      ? <a key={p.id} className="publication-row" href={p.url} target="_blank" rel="noopener noreferrer">{body}</a>
      : <div key={p.id} className="publication-row">{body}</div>;
  })}</div>;
}
function Home(){
  return <>
    <section className="home-hero"><div className="container hero-layout">
      <div className="hero-copy">
        <Eyebrow>{pageCopy.home.researcher_scientific_leader_ai_for_food_safety}</Eyebrow>
        <h1>{pageCopy.home.artificial_intelligence_for}<br/><em>{pageCopy.home.better_science}</em></h1>
        <div className="hero-meta"><strong>{site.name}</strong><span>{site.role}</span><span>{site.organisation}</span></div>
        <div className="action-row"><ActionRow to="/research">{pageCopy.home.explore_my_research}</ActionRow><ActionRow to="/about" secondary>{pageCopy.home.about_me}</ActionRow></div>
      </div>
      <Portrait className="hero-portrait"/>
    </div></section>
    <section className="band editorial-note"><div className="container note-grid"><strong>{pageCopy.home.research_focus}</strong><p>{pageCopy.home.building_trustworthy_ai_methods_creating_strong_scientific}</p></div></section>
    <section className="section"><div className="container"><SectionIntro eyebrow={pageCopy.home.text_01_research} title={pageCopy.home.three_connected_research_directions} link="/research" linkText={pageCopy.home.all_research}/>
    <div className="mini-grid">{researchAreas.map(item=><ResearchMiniCard item={item} key={item.slug}/>)}</div></div></section>
    <section className="section section-alt"><div className="container"><SectionIntro eyebrow={pageCopy.home.text_02_selected_projects} title={pageCopy.home.where_ideas_become_research_programmes} description={pageCopy.home.a_selection_of_open_resources_methodological_work} link="/projects" linkText={pageCopy.home.all_projects}/>
    <div className="feature-project"><ChefsImage className="chefs-home"/>
      <div className="feature-project-text"><Eyebrow>{pageCopy.home.open_data_food_monitoring}</Eyebrow><h3>{pageCopy.home.chefs}</h3><p>{pageCopy.home.bringing_together_european_food_monitoring_data_to}</p><div className="feature-stat">{pageCopy.home.text_392_million} <span>{pageCopy.home.analytical_results_in_the_published_database}</span></div><LocalLink to="/projects/chefs" className="text-link">{pageCopy.home.explore_the_project} <span aria-hidden="true">→</span></LocalLink></div>
    </div>
    <div className="link-strip"><LocalLink to="/projects/living-review">{pageCopy.home.living_ai_literature_review} <span>↗</span></LocalLink><LocalLink to="/projects/foundation-models">{pageCopy.home.foundation_models_for_analytical_data} <span>↗</span></LocalLink><LocalLink to="/projects/holifood">HOLiFOOD <span>↗</span></LocalLink><LocalLink to="/projects/early-warning">{pageCopy.home.early_warning_and_emerging_risks} <span>↗</span></LocalLink></div></div></section>
    <section className="section"><div className="container"><SectionIntro eyebrow={pageCopy.home.text_03_publications} title={pageCopy.home.selected_publications} description={pageCopy.home.recent_peer_reviewed_work_the_complete_publication} link="/publications" linkText={pageCopy.home.view_publications}/><PublicationRows items={featuredPublications}/></div></section>
    <section className="bottom-cta"><div className="container bottom-cta-layout"><div><Eyebrow>{pageCopy.home.collaboration}</Eyebrow><h2>{pageCopy.home.interested_in_working_together}</h2><p>{pageCopy.home.scientific_collaboration_research_projects_invited_talks_and}</p></div><ActionRow to="/contact">{pageCopy.home.get_in_touch}</ActionRow></div></section>
  </>;
}
function ResearchIndex() {
  return <>
    <PageHeader kicker={pageCopy.researchOverview.research} title={pageCopy.researchOverview.methods_data_and_impact} lead={pageCopy.researchOverview.my_work_spans_trustworthy_and_explainable_ai}/>
    <section className="section first-section"><div className="container"><div className="editorial-grid"><div><Eyebrow>{pageCopy.researchOverview.the_approach}</Eyebrow><h2>{pageCopy.researchOverview.connecting_methodological_depth_to_domain_questions}</h2><p>{pageCopy.researchOverview.many_ai_research_challenges_emerge_from_the}</p><p>{pageCopy.researchOverview.the_goal_is_not_only_to_create}</p></div><MediaSlot kind="figure" format="wide" title={pageCopy.researchOverview.research_framework_methods_data_food_safety} caption={pageCopy.researchOverview.suggested_overarching_research_agenda_figure}/></div></div></section>
    <section className="section section-alt"><div className="container"><SectionIntro eyebrow={pageCopy.researchOverview.research_areas} title={pageCopy.researchOverview.explore_the_research_directions} description={pageCopy.researchOverview.each_area_has_its_own_page_for}/>
    <div className="research-list">{researchAreas.map(a=><LocalLink to={'/research/'+a.slug} className="research-line" key={a.slug}><div><span className="index-label">{a.number}</span><h3>{a.title}</h3><p>{a.short}</p></div><span className="large-arrow">↗</span></LocalLink>)}</div></div></section>
  </>;
}
function ResearchDetail({item}) {
  return <>
    <div className="article-top container"><Breadcrumbs parent="Research" parentPath="/research" title={item.title}/></div>
    <PageHeader compact kicker={'RESEARCH AREA '+item.number} title={item.title} lead={item.lead}/>
    <section className="section first-section"><div className="container article-layout">
      <div className="article-main"><Eyebrow>{pageCopy.researchDetail.research_perspective}</Eyebrow><h2>{pageCopy.researchDetail.scientific_questions_and_challenges}</h2><p className="large-body">{item.perspective}</p>
      <MediaSlot kind="figure" format="wide" title={item.media} caption={pageCopy.researchDetail.reserved_for_a_custom_scientific_illustration}/>
      <h2>{pageCopy.researchDetail.methodological_approach}</h2><ul className="line-list">{item.approach.map(x=><li key={x}>{x}</li>)}</ul>
      <h2>{pageCopy.researchDetail.application_areas}</h2><ul className="line-list">{item.applications.map(x=><li key={x}>{x}</li>)}</ul></div>
      <aside className="article-aside"><div className="aside-panel"><strong>RESEARCH AREA {item.number}</strong><p>{item.short}</p><LocalLink to="/research" className="text-link">{pageCopy.researchDetail.all_research} <span>→</span></LocalLink></div><div className="aside-panel"><strong>{pageCopy.researchDetail.related_projects}</strong>{item.related.map(slug=>{let p=projectEntries.find(v=>v.slug===slug);return p?<LocalLink key={slug} to={'/projects/'+slug} className="aside-link">{p.title} <span>↗</span></LocalLink>:null})}</div></aside>
    </div></section>
    <div className="container next-page"><span>{pageCopy.researchDetail.continue_exploring}</span><LocalLink to="/research">{pageCopy.researchDetail.back_to_all_research} <span>→</span></LocalLink></div>
  </>;
}
function ProjectsIndex() {
  return <>
    <PageHeader kicker={pageCopy.projectsOverview.projects_data_resources} title={pageCopy.projectsOverview.research_in_practice} lead={pageCopy.projectsOverview.open_datasets_software_methods_and_applied_collaborations}/>
    <section className="section first-section"><div className="container project-grid">
      {projectEntries.map((p,i)=><article key={p.slug} className="project-tile">
        {p.slug==='chefs'?<ChefsImage className="chefs-project-card"/>:<MediaSlot kind={i%2?'photo':'figure'} format="landscape" title={p.media}/>}
        <div className="project-tile-copy"><Eyebrow>{p.category}</Eyebrow><h2>{p.title}</h2><p>{p.summary}</p><LocalLink to={'/projects/'+p.slug} className="text-link">{pageCopy.projectsOverview.read_project_overview} <span>→</span></LocalLink></div>
      </article>)}
    </div></section>
  </>;
}
function ProjectDetail({item}) {
  return <>
    <div className="article-top container"><Breadcrumbs parent="Projects" parentPath="/projects" title={item.title}/></div>
    <PageHeader compact kicker={item.category.toUpperCase()} title={item.title} lead={item.lead}/>
    <section className="section first-section"><div className="container">
      {item.slug==='chefs'?<ChefsImage className="chefs-detail"/>:<MediaSlot kind="figure" format="panorama" title={item.media} caption={pageCopy.projectDetail.project_hero_image_visualisation}/>}
      <div className="article-layout project-article">
        <div className="article-main"><Eyebrow>{pageCopy.projectDetail.project_overview}</Eyebrow><h2>{pageCopy.projectDetail.research_context}</h2><p className="large-body">{item.context}</p><h2>{pageCopy.projectDetail.our_contribution}</h2><p>{item.contribution}</p><h2>{pageCopy.projectDetail.outlook}</h2><p>{item.next}</p>
        <MediaSlot kind="figure" format="wide" title={item.secondaryMedia} caption={pageCopy.projectDetail.reserved_for_a_project_specific_result_chart}/></div>
        <aside className="article-aside"><div className="aside-panel"><strong>{pageCopy.projectDetail.project}</strong><p>{item.summary}</p><ExtLink href={item.link} className="text-link">{item.linkLabel}</ExtLink></div><div className="aside-panel"><strong>{pageCopy.projectDetail.more_projects}</strong>{projectEntries.filter(x=>x.slug!==item.slug).slice(0,3).map(x=><LocalLink key={x.slug} className="aside-link" to={'/projects/'+x.slug}>{x.title}<span>↗</span></LocalLink>)}</div></aside>
      </div>
    </div></section>
  </>;
}
function Publications() {
  const [filter,setFilter] = useState('All');
  const [selectedTopics,setSelectedTopics] = useState([]);
  const [search,setSearch] = useState('');
  const toggleTopic = topic => setSelectedTopics(current =>
    current.includes(topic) ? current.filter(item => item !== topic) : [...current,topic]
  );
  const groups = [
    {key:'journal',label:pageCopy.publications.journal_articles},
    {key:'conferencePaper',label:pageCopy.publications.full_conference_papers},
    {key:'conferenceAbstract',label:pageCopy.publications.conference_abstracts_posters},
    {key:'other',label:pageCopy.publications.other_outputs}
  ];
  const query = search.trim().toLowerCase();
  const filtered = cvPublications.filter(p =>
    (filter === 'All' || p.section === filter)
    && (selectedTopics.length === 0 || selectedTopics.some(topic => publicationHasTopic(p, topic)))
    && (!query || [p.title,p.authors,p.journal,p.year,p.type].join(' ').toLowerCase().includes(query))
  );
  return <>
    <PageHeader kicker={pageCopy.publications.scientific_output} title={pageCopy.publications.publications} lead={pageCopy.publications.a_curated_starting_selection_of_peer_reviewed}/>
    <section className="section first-section"><div className="container">
      <section className="paper-featured" aria-labelledby="featured-papers-heading">
        <div className="paper-featured-head"><h2 id="featured-papers-heading">Selected papers to read</h2><span>Browse full articles · open access</span></div>
        <div className="paper-featured-list">{featuredPapers.map(paper=>
          <LocalLink key={paper.slug} to={'/papers/'+paper.slug} className="paper-featured-row">
            <span><span className="paper-featured-year">{paper.year} · {paper.journal}</span><span className="paper-featured-title">{paper.title}</span></span>
            <span className="paper-featured-arrow" aria-hidden="true">→</span>
          </LocalLink>
        )}</div>
      </section>
      <div className="pub-tools">
        <div className="filter-row" role="group" aria-label="Filter publications">
          {[{key:'All',label:pageCopy.publications.all_outputs},...groups].map(item=><button type="button" key={item.key} aria-pressed={item.key===filter} onClick={()=>setFilter(item.key)} className={item.key===filter?'active':''}>{item.label}</button>)}
        </div>
        <div className="publication-external-links"><LocalLink to="/cv/13" className="text-link">{pageCopy.publications.full_academic_cv}</LocalLink><ExtLink href={site.links.scholar} className="text-link">{pageCopy.publications.full_record_at_research_wur}</ExtLink></div>
      </div>
      <div className="publication-topic-tools">
        <span className="publication-topic-label">Topics</span>
        <div className="publication-topic-buttons" role="group" aria-label="Filter by research topics">
          {publicationTopicNames.map(topic=><button type="button" key={topic} aria-pressed={selectedTopics.includes(topic)} className={selectedTopics.includes(topic)?'active':''} onClick={()=>toggleTopic(topic)}>{topic}</button>)}
        </div>
        {selectedTopics.length>0&&<button className="publication-topic-clear" type="button" onClick={()=>setSelectedTopics([])}>Clear topic filters</button>}
      </div>
      <div className="publication-search-row">
        <input className="publication-search" type="search" aria-label={pageCopy.publications.search_publications} placeholder={pageCopy.publications.search_publications} value={search} onChange={e=>setSearch(e.target.value)}/>
        <span className="publication-result-count">{filtered.length} {pageCopy.publications.of} {cvPublications.length} {pageCopy.publications.entries}</span>
      </div>
      {groups.filter(g=>filter==='All'||filter===g.key).map(g=>{
        const records=filtered.filter(p=>p.section===g.key);
        return records.length>0&&<section key={g.key} className="publication-category" aria-label={g.label}>
          <div className="publication-category-heading"><h2>{g.label}</h2><span>{records.length}</span></div>
          <PublicationRows items={records}/>
        </section>;
      })}
      {filtered.length===0&&<p>{pageCopy.publications.no_matching_publications}</p>}
      <p className="publication-jif-note">{pageCopy.publications.jif_note}</p>
    </div></section>
  </>;
}
function AcademicActivities(){
  return <>
    <PageHeader kicker={pageCopy.academicActivities.academic_activities} title={pageCopy.academicActivities.research_is_a_collective_endeavour} lead={pageCopy.academicActivities.scientific_exchange_community_building_and_mentorship_are}/>
    <section className="section first-section"><div className="container"><div className="editorial-grid"><div><Eyebrow>{pageCopy.academicActivities.community_exchange}</Eyebrow><h2>{pageCopy.academicActivities.connecting_researchers_and_ideas}</h2><p>{pageCopy.academicActivities.ai_for_food_safety_is_an_interdisciplinary}</p><p>{pageCopy.academicActivities.these_activities_range_from_invited_scientific_presentations}</p></div><MediaSlot kind="photo" format="wide" title={pageCopy.academicActivities.conference_talk_scientific_event_photograph} caption={pageCopy.academicActivities.suggested_invited_talk_conference_or_team_event}/></div></div></section>
    <section className="section section-alt"><div className="container activity-grid">{activitySections.map((a,i)=><article className="activity-card" key={a.title}><span className="index-label">0{i+1}</span><h2>{a.title}</h2><p>{a.description}</p><ul>{a.entries.map(e=><li key={e}>{e}</li>)}</ul></article>)}</div></section>
    <section className="section"><div className="container"><SectionIntro eyebrow={pageCopy.academicActivities.photo_gallery} title={pageCopy.academicActivities.speaking_collaboration_research} description={pageCopy.academicActivities.space_for_documented_activities_and_scientific_highlights}/><div className="gallery-placeholders"><MediaSlot kind="photo" format="landscape" title={pageCopy.academicActivities.keynote_or_invited_talk}/><MediaSlot kind="photo" format="landscape" title={pageCopy.academicActivities.conference_community_event}/><MediaSlot kind="photo" format="landscape" title={pageCopy.academicActivities.research_team_or_collaboration}/></div></div></section>
  </>;
}
function About(){
  return <>
    <PageHeader kicker={pageCopy.about.about} title={pageCopy.about.a_researcher_a_team_leader_and_a} lead={pageCopy.about.my_work_combines_machine_learning_research_scientific}/>
    <section className="section first-section"><div className="container about-columns"><Portrait className="about-portrait"/><div><Eyebrow>{pageCopy.about.background}</Eyebrow><h2>{pageCopy.about.from_medical_imaging_to_ai_for_food}</h2>{site.about.map(p=><p key={p}>{p}</p>)}<ExtLink href={site.links.research} className="text-link">{pageCopy.about.scientific_profile}</ExtLink> <LocalLink to="/cv" className="text-link about-cv-link">{pageCopy.about.full_academic_cv} <span>→</span></LocalLink> <LocalLink to="/thesis" className="text-link about-cv-link">PhD thesis (2017) <span>→</span></LocalLink></div></div></section>
    <section className="section section-alt"><div className="container"><SectionIntro eyebrow={pageCopy.about.experience} title={pageCopy.about.selected_roles_and_background} description={pageCopy.about.for_a_complete_overview_of_appointments_projects}/><div className="milestones">{milestones.map(m=><div className="milestone" key={m.title}><span>{m.date}</span><div><h3>{m.title}</h3><p>{m.institution}</p></div></div>)}</div></div></section>
    <section className="section"><div className="container editorial-grid"><div><Eyebrow>{pageCopy.about.beyond_individual_research}</Eyebrow><h2>{pageCopy.about.building_an_environment_for_good_research}</h2><p>{pageCopy.about.i_care_about_the_conditions_that_make}</p><LocalLink to="/academic-activities" className="text-link">{pageCopy.about.academic_activities} <span>→</span></LocalLink></div><figure className="about-team-photo"><img src={import.meta.env.BASE_URL+media.team.file} alt={media.team.alt} loading="lazy" decoding="async"/><figcaption>{media.team.caption}</figcaption></figure></div></section>
  </>;
}
function Contact(){
  return <>
    <PageHeader kicker={pageCopy.contact.contact} title={pageCopy.contact.let_s_exchange_ideas} lead={pageCopy.contact.for_scientific_collaboration_invited_talks_research_initiatives}/>
    <section className="section first-section"><div className="container contact-columns"><div className="contact-panel"><Eyebrow>{pageCopy.contact.get_in_touch}</Eyebrow><h2>{pageCopy.contact.email}</h2><a href={'mailto:'+site.email} className="email-address">{site.email} <span>↗</span></a><p>{site.organisation}<br/>{site.location}</p></div><div className="contact-panel subtle"><Eyebrow>{pageCopy.contact.online_profiles}</Eyebrow><h2>{pageCopy.contact.find_my_work}</h2><ExtLink href={site.links.scholar} className="contact-profile">{pageCopy.contact.research_wur}</ExtLink><ExtLink href={site.links.github} className="contact-profile">{pageCopy.contact.github}</ExtLink><ExtLink href={site.links.wur} className="contact-profile">{pageCopy.contact.wageningen_food_safety_research}</ExtLink></div></div></section>
  </>;
}
function NotFound(){return <div className="container notfound"><Eyebrow>404</Eyebrow><h1>{pageCopy.notFound.page_not_found}</h1><p>{pageCopy.notFound.the_requested_page_does_not_exist}</p><ActionRow to="/">{pageCopy.notFound.return_home}</ActionRow></div>}
function App(){
  const [path,setPath]=useState(currentPath);
  const [menuOpen,setMenuOpen]=useState(false);
  const mainRef=useRef(null);
  const navRef=useRef(null);
  const menuButtonRef=useRef(null);
  const firstRoute=useRef(true);
  const skipToMain=(event)=>{
    event.preventDefault();
    mainRef.current?.focus({preventScroll:true});
    mainRef.current?.scrollIntoView({block:'start',behavior:'instant'});
  };
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
    // In this hash-routed SPA, changing the URL does not move screen-reader focus.
    // Skip the initial page load, but focus the new main region after navigation.
    if (firstRoute.current) firstRoute.current=false;
    else mainRef.current?.focus({preventScroll:true});
    const label=navigation.find(n=>n.path===path)?.label || researchAreas.find(x=>path==='/research/'+x.slug)?.title || projectEntries.find(x=>path==='/projects/'+x.slug)?.title || (path.startsWith('/cv')?'Full academic CV':path==='/thesis'?'PhD thesis':path.startsWith('/papers/')?'Featured paper':'Page');
    document.title=(path==='/'?'Bas van der Velden':label+' | Bas van der Velden')+' — AI for Food Safety';
  },[path]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;try{localStorage.setItem('bas-theme',theme)}catch{}},[theme]);
  // Mobile navigation appears before its toggle in the DOM. Send keyboard focus
  // to the first link on opening, and support Escape to close the menu.
  useEffect(()=>{
    if(menuOpen) navRef.current?.querySelector('a')?.focus();
  },[menuOpen]);
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
  else if(path==='/thesis') page=<Thesis/>;
  else if(path.startsWith('/papers/')) { const paper=featuredPapers.find(p=>'/papers/'+p.slug===path); page=paper?<PaperReader paper={paper}/>:<NotFound/>; }
  else if(path==='/contact') page=<Contact/>;
  else page=<NotFound/>;
  return <>
    <a href="#main" className="skip-link" onClick={skipToMain}>{pageCopy.shell.skip_to_content}</a>
    <header className="site-header"><div className="container header-content">
      <LocalLink to="/" className="wordmark"><span className="wordmark-name">{site.name}<span className="wordmark-dot">.</span></span><span className="wordmark-description">{pageCopy.shell.ai_for_food_safety}</span></LocalLink>
      <nav ref={navRef} aria-label="Primary navigation" id="primary-nav" className={'site-nav '+(menuOpen?'is-open':'')} onKeyDown={event=>{if(event.key==='Escape'&&menuOpen){setMenuOpen(false);menuButtonRef.current?.focus();}}}>
        {navigation.map(n=><LocalLink key={n.path} to={n.path} className={n.path==='/'?path==='/'?'is-active':'':path===n.path||path.startsWith(n.path+'/')?'is-active':''} aria-current={path===n.path?'page':undefined}>{n.label}</LocalLink>)}
        <LocalLink to="/contact" className={'contact-nav '+(path==='/contact'?'is-active':'')}>{pageCopy.shell.contact} <span>↗</span></LocalLink>
      </nav>
      <div className="header-tools"><button className="theme-toggle" aria-label={'Switch to '+(theme==='light'?'dark':'light')+' mode'} onClick={()=>setTheme(t=>t==='light'?'dark':'light')} title="Toggle color theme">{theme==='light'?'☾':'☀'}</button><button ref={menuButtonRef} className="menu-toggle" type="button" aria-controls="primary-nav" aria-expanded={menuOpen} aria-label={menuOpen?'Close navigation menu':'Open navigation menu'} onClick={()=>setMenuOpen(m=>!m)}><span></span><span></span><span></span></button></div>
    </div></header>
    <main id="main" ref={mainRef} tabIndex={-1}>{page}</main>
    <footer className="site-footer"><div className="container footer-layout"><div><strong>{site.name}</strong><p>{site.role}<br/>{site.organisation}</p></div><nav aria-label="Footer navigation"><LocalLink to="/research">{pageCopy.shell.research}</LocalLink><LocalLink to="/projects">{pageCopy.shell.projects}</LocalLink><LocalLink to="/publications">{pageCopy.shell.publications}</LocalLink><LocalLink to="/cv">{pageCopy.shell.full_cv}</LocalLink><LocalLink to="/thesis">PhD thesis</LocalLink><LocalLink to="/contact">{pageCopy.shell.contact}</LocalLink></nav><div><p>© {new Date().getFullYear()} {site.name}</p><p>{site.location}</p></div></div></footer>
  </>;
}
export default App;
