// Generate directly indexable, shareable HTML landing pages for the
// hash-routed GitHub Pages app. The interactive site remains unchanged.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectEntries, researchAreas, site } from '../src/content.js';

const dir = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const home = 'https://basvandervelden.github.io/personalwebsite/';
const image = home + 'bas.jpeg';
const papers = JSON.parse(readFileSync(new URL('../src/featured-papers.json', import.meta.url), 'utf8'));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json = obj => JSON.stringify(obj).replace(/</g,'\\u003c');
const urls = [home];
const css = `*{box-sizing:border-box}body{margin:0;background:#f8f7fc;color:#20202a;font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.7}main{max-width:900px;margin:9vh auto;padding:0 28px}.eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:.14em;font-weight:750;color:#81659c}h1{font-size:clamp(32px,5vw,54px);letter-spacing:-.045em;line-height:1.15;margin:18px 0 28px}p{font-size:17px;line-height:1.8;max-width:730px}a{color:#70508f;text-decoration:underline;text-underline-offset:3px}a:focus-visible{outline:3px solid #70508f;outline-offset:3px}.btn{display:inline-block;margin:25px 0;background:#25212c;color:#fff;text-decoration:none;padding:14px 21px;font-weight:650}.meta{color:#62616c;font-size:13px}.footer{margin-top:80px;padding-top:20px;border-top:1px solid #d4d2d9;font-size:12px}`;
function createPage(relativePath,{title,description,eyebrow,summary,ctaLabel,readerPath,schema,type='website',paper}) {
 const canonical=home+relativePath+'/';
 const redirect=home+'#'+readerPath;
 const md={
  '@context':'https://schema.org',
  ...schema
 };
 const html=`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="index,follow">
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="${esc(type)}">
<meta property="og:site_name" content="Bas van der Velden">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${image}">
<meta property="og:image:alt" content="Portrait of Bas van der Velden">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<title>${esc(title)} | Bas van der Velden</title>
<script type="application/ld+json">${json(md)}</script>
<style>${css}</style>
</head><body><main>
<a href="${home}">← Bas van der Velden</a>
<div class="eyebrow" style="margin-top:55px">${esc(eyebrow)}</div>
<h1>${esc(title)}</h1>
<p>${esc(summary)}</p>
${paper? `<p class="meta">${esc(paper.journal)} · ${esc(paper.year)} · <a href="https://doi.org/${encodeURIComponent(paper.doi)}">DOI: ${esc(paper.doi)}</a></p>`:''}
<a class="btn" href="${esc(redirect)}">${esc(ctaLabel)} →</a>
<p class="footer">Wageningen Food Safety Research · ${esc(site.role)}</p>
</main></body></html>`;
 const path=resolve(dir,relativePath,'index.html');
 mkdirSync(resolve(dir,relativePath),{recursive:true});
 writeFileSync(path,html);
 urls.push(canonical);
}
for(const paper of papers){
 createPage('papers/'+paper.slug,{
  title:paper.title,
  description:`${paper.title}. ${paper.journal} (${paper.year}). DOI: ${paper.doi}.`,
  eyebrow:'Selected scientific publication',
  summary:paper.authors,
  ctaLabel:'Read the interactive paper',
  readerPath:'/papers/'+paper.slug,
  paper,
  type:'article',
  schema:{
   '@type':'ScholarlyArticle',
   headline:paper.title,
   author:paper.authors,
   datePublished:String(paper.year),
   isPartOf:{'@type':'Periodical',name:paper.journal},
   identifier:'https://doi.org/'+paper.doi,
   url:home+'#/papers/'+paper.slug,
   isAccessibleForFree:true,
   ...(paper.license.startsWith('CC BY')?{license:paper.license.includes('NC-ND')?'https://creativecommons.org/licenses/by-nc-nd/4.0/':'https://creativecommons.org/licenses/by/4.0/'}:{})
  }
 });
}
for(const p of projectEntries){
 createPage('projects/'+p.slug,{
  title:p.title,description:p.summary,eyebrow:p.category,
  summary:p.lead,ctaLabel:'Explore this project',
  readerPath:'/projects/'+p.slug,
  schema:{'@type':'ResearchProject',name:p.title,description:p.summary,url:home+'#/projects/'+p.slug}
 });
}
for(const p of researchAreas){
 createPage('research/'+p.slug,{
  title:p.title,description:p.short,eyebrow:'Research area',
  summary:p.lead,ctaLabel:'Explore this research area',
  readerPath:'/research/'+p.slug,
  schema:{'@type':'WebPage',name:p.title,description:p.short,url:home+'#/research/'+p.slug}
 });
}
createPage('about',{
 title:'About Bas van der Velden',
 description:'Research background, scientific leadership and academic profile of Bas van der Velden.',
 eyebrow:'About',
 summary:site.about[0],
 ctaLabel:'Explore academic profile',
 readerPath:'/about',
 schema:{'@type':'ProfilePage',name:'About Bas van der Velden',mainEntity:{'@type':'Person',name:site.name}}
});
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
 urls.map(url=>'  <url><loc>'+esc(url)+'</loc></url>').join('\n')+'\n</urlset>\n';
writeFileSync(resolve(dir,'sitemap.xml'),sitemap);
writeFileSync(resolve(dir,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+home+'sitemap.xml\n');
console.log('SEO landing pages: '+(urls.length-1)+'; sitemap URLs: '+urls.length);
