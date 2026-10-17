import { useEffect, useState } from 'react';
import { profile, links, themes, projects, publications, experience } from './content.js';

function Arrow({ up = false }) { return <span aria-hidden="true" className="arrow">{up ? '↗' : '→'}</span> }
function External({ href, children, className = '' }) { return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children} <Arrow up /></a> }
function Heading({ kicker, title, description }) { return <div className="section-heading"><p className="kicker">{kicker}</p><div className="heading-row"><h2>{title}</h2>{description && <p>{description}</p>}</div></div> }

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    try { const saved = localStorage.getItem('bas-theme'); if (['light','dark'].includes(saved)) return saved; } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [menu, setMenu] = useState(false);
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('bas-theme', theme); } catch {} }, [theme]);
  const close = () => setMenu(false);
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="header"><div className="container nav-inner">
      <a href="#top" onClick={close} className="brand"><span className="brand-icon">b<span>.</span></span><span>Bas van der Velden</span></a>
      <nav className={menu ? 'navigation open' : 'navigation'} aria-label="Main navigation">
        <a href="#research" onClick={close}>Research</a><a href="#projects" onClick={close}>Projects</a>
        <a href="#publications" onClick={close}>Publications</a><a href="#about" onClick={close}>About</a>
        <a href="#contact" onClick={close} className="nav-contact">Contact ↗</a>
      </nav>
      <div className="nav-actions">
        <button type="button" className="theme-button" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀' : '☾'}</button>
        <button type="button" className="menu-button" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}><span></span><span></span><span></span></button>
      </div>
    </div></header>

    <main id="main">
      <section id="top" className="hero container">
        <div className="hero-content">
          <p className="overline"><span className="dot"></span> RESEARCH · AI · FOOD SAFETY</p>
          <h1>Making artificial intelligence <em>work for science.</em></h1>
          <p className="hero-intro">{profile.intro}</p>
          <p className="hero-role"><strong>{profile.name}</strong> · {profile.role}<span>{profile.organisation}</span></p>
          <div className="hero-actions"><a href="#research" className="button primary">Explore my research <Arrow /></a><a href="#contact" className="button secondary">Get in touch <Arrow up /></a></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-grid"></div><div className="art-orbit orbit-a"></div><div className="art-orbit orbit-b"></div><div className="art-orbit orbit-c"></div>
          <div className="art-core">AI<small>FOR SCIENCE</small></div>
          <span className="art-dot a"></span><span className="art-dot b"></span><span className="art-dot c"></span><span className="art-dot d"></span>
          <span className="art-label top">DATA ↗ INSIGHT</span><span className="art-label bottom">ANTICIPATE · DETECT · UNDERSTAND</span>
        </div>
        <div className="hero-footer"><span>WAGENINGEN, THE NETHERLANDS</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section id="research" className="section tinted"><div className="container">
        <Heading kicker="WHAT I WORK ON" title={<>Research at the intersection of <em>AI and food safety.</em></>} description="Methods matter. So does the context in which they are used. My work brings the two together."/>
        <div className="themes">{themes.map(t => <article className="theme-card" key={t.number}>
          <div className="card-top"><span>{t.number} /</span><span className="round-arrow">↗</span></div>
          <h3>{t.title}</h3><p>{t.text}</p><div className="tags">{t.labels.map(l => <span key={l}>{l}</span>)}</div>
        </article>)}</div>
      </div></section>

      <section id="projects" className="section"><div className="container">
        <Heading kicker="SELECTED WORK" title={<>From research to <em>useful tools and data.</em></>} description="Research initiatives, open resources and work in progress."/>
        <div className="projects">{projects.map(p => <article className={'project '+p.style} key={p.title}>
          <div className="project-content"><p className="project-kicker">{p.eyebrow}</p><h3>{p.title}</h3><p className="project-subtitle">{p.subtitle}</p><p className="project-summary">{p.summary}</p><External href={p.link} className="project-link">{p.linkLabel}</External></div>
          <div className="project-art" aria-hidden="true"><div>{p.marker}</div><span>{p.markerCaption}</span></div>
        </article>)}</div>
      </div></section>

      <section id="publications" className="section tinted"><div className="container">
        <Heading kicker="RESEARCH OUTPUT" title={<>Selected <em>publications.</em></>} description="A short selection. My Research@WUR profile has the full publication list."/>
        <div className="publications">{publications.map(p => <a className="publication" href={p.url} target="_blank" rel="noopener noreferrer" key={p.title}>
          <span className="pub-year">{p.year}</span><div><h3>{p.title}</h3><p>{p.authors}</p><p className="pub-journal">{p.journal}</p></div><span className="pub-arrow">↗</span>
        </a>)}</div>
        <External href={links.research} className="underlined">All publications at Research@WUR</External>
      </div></section>

      <section id="about" className="section"><div className="container about-grid">
        <div><p className="kicker">ABOUT ME</p><h2>Science, people and <em>collaboration.</em></h2><p>{profile.bio}</p>
        <p>I am interested in research programmes that combine methodological depth with real-world relevance — and in building communities where researchers from different disciplines can work together.</p>
        <External href={links.research} className="underlined">Research profile</External></div>
        <div className="timeline"><p className="timeline-kicker">SELECTED EXPERIENCE</p>{experience.map(e => <article className="timeline-item" key={e.title}><span>{e.time}</span><div><h3>{e.title}</h3><strong>{e.sub}</strong><p>{e.description}</p></div></article>)}</div>
      </div></section>

      <section id="contact" className="section contact"><div className="container contact-grid">
        <div><p className="kicker">LET'S CONNECT</p><h2>Have a research question or <em>idea for collaboration?</em></h2><p>I am happy to hear from researchers, institutions and partners interested in AI for food safety.</p><a href={'mailto:'+profile.email} className="button white">Email me <Arrow up /></a></div>
        <div className="contact-card"><span>CONTACT</span><a className="contact-email" href={'mailto:'+profile.email}>{profile.email} ↗</a><p>{profile.organisation}<br/>{profile.location}</p><div className="contact-links"><External href={links.research}>Research@WUR</External><External href={links.github}>GitHub</External><External href={links.wur}>WUR</External></div></div>
      </div></section>
    </main>
    <footer><div className="container footer"><div><strong>Bas van der Velden</strong><p>Research in trustworthy AI and food safety.</p></div><p>© {new Date().getFullYear()} Bas van der Velden</p><a href="#top">Back to top ↑</a></div></footer>
  </>;
}
