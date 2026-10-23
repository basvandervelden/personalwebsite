// Export the public-facing long CV as an editable Word document.
// This is generated from the same data and display rules as the website.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink,
  AlignmentType, Footer, PageNumber
} from 'docx';
import {
  formatPublicationAuthors, formatPublicationTitle, formatPublicationVenue, featuredAuthorName
} from '../src/publication-format.js';
import { publicationGroups, publicationSection, publicationDisplayType, isSupersededPreprint } from '../src/publication-groups.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cv = JSON.parse(await readFile(join(root,'src','cv-data.json'),'utf8'));
const colour = '675987';
const ink = '1D2432';
const muted = '66707C';
const font = 'Aptos';
const outfile = join(root,'public','Bas_van_der_Velden_CV_editable.docx');

const line = (text, options={}) => new Paragraph({
  children:[new TextRun({text:String(text ?? ''),font,size:20,...options})],
  spacing:{after:110,line:285},
});
const sectionHeading = (title,number) => new Paragraph({
  heading:HeadingLevel.HEADING_1,
  children:[new TextRun({text:String(number).padStart(2,'0')+'  '+title,color:colour,bold:true,font,size:27})],
  spacing:{before:340,after:170},keepNext:true,
});
const subsectionHeading = title => new Paragraph({
  heading:HeadingLevel.HEADING_2,
  children:[new TextRun({text:title,color:ink,bold:true,font,size:23})],
  spacing:{before:260,after:110},keepNext:true,
});
function authorParagraph(authors) {
  const result=[];
  const parts=String(authors).split(featuredAuthorName);
  parts.forEach((piece,i)=>{
    if(i>0)result.push(new TextRun({text:featuredAuthorName,bold:true,color:colour,font,size:18}));
    if(piece)result.push(new TextRun({text:piece,color:ink,font,size:18}));
  });
  return new Paragraph({children:result,spacing:{after:45,line:260}});
}
function linksFor(entry) {
  const urls=(entry.links || []).filter(item=>/^https:\/\//i.test(item.url || ''));
  const result=[];
  for(const link of urls){
    result.push(new Paragraph({
      children:[
        new TextRun({text:'Link: ',font,size:17,color:muted}),
        new ExternalHyperlink({
          link:link.url,
          children:[new TextRun({text:link.label || link.url,color:colour,underline:{color:colour},font,size:17})],
        }),
      ],
      spacing:{after:60},
    }));
  }
  return result;
}
function entryLines(entry,isPub=false) {
  const result=[];
  const title=isPub?formatPublicationTitle(entry.paperTitle || entry.title,entry.id):entry.title;
  result.push(new Paragraph({
    children:[
      new TextRun({text:title,bold:true,font,size:20,color:ink}),
      ...(entry.period?[new TextRun({text:'   '+entry.period,font,size:18,color:colour})]:[]),
    ],
    spacing:{before:135,after:75,line:290},
    keepNext:true,
  }));
  if(isPub) {
    if(entry.authors)result.push(authorParagraph(formatPublicationAuthors(entry.authors,entry.id)));
    const venue=formatPublicationVenue(entry.journal);
    const parts=[venue,publicationDisplayType(entry)];
    if(publicationSection(entry)==='journal'&&Number.isFinite(entry.impactFactor)&&entry.impactFactorYear)
      parts.push('JIF '+entry.impactFactorYear+': '+entry.impactFactor.toFixed(1));
    result.push(line(parts.filter(Boolean).join('  |  '),{color:muted,italics:true,size:17}));
  } else {
    if(entry.meta)result.push(line(entry.meta,{color:muted,italics:true,size:18}));
    if(entry.details)result.push(line(entry.details,{color:ink}));
  }
  result.push(...linksFor(entry));
  return result;
}
const children=[];
children.push(new Paragraph({
  children:[new TextRun({text:cv.profile.name,font,size:39,bold:true,color:ink})],
  spacing:{after:70},
}));
children.push(new Paragraph({
  children:[new TextRun({text:'ACADEMIC CURRICULUM VITAE',font,size:16,bold:true,color:colour})],
  spacing:{after:160},
}));
children.push(line(cv.profile.role,{size:21,color:ink}));
children.push(line(cv.profile.organisation,{color:muted}));
children.push(line(cv.profile.email+'  |  '+cv.profile.location,{color:muted,size:18}));
children.push(line('Website source: '+(cv.updated||'Current version')+'. Editable working copy; changes in this Word document are not automatically published online.',{color:muted,italics:true,size:16}));
children.push(new Paragraph({text:'',spacing:{after:130}}));

for(const section of cv.sections.filter(s=>s.number!==18)){
  const entries=(section.entries || []).filter(entry=>!isSupersededPreprint(entry));
  children.push(sectionHeading(section.title,section.number));
  if(section.description)children.push(line(section.description,{color:muted,italics:true,size:18}));
  if(section.number===13) {
    for(const group of publicationGroups){
      const groupEntries=entries.filter(entry=>publicationSection(entry)===group.key);
      if(!groupEntries.length)continue;
      children.push(subsectionHeading(group.label+' ('+groupEntries.length+')'));
      for(const entry of groupEntries)children.push(...entryLines(entry,true));
    }
  } else {
    for(const entry of entries)children.push(...entryLines(entry,false));
  }
}

const footer = new Footer({children:[new Paragraph({
  alignment:AlignmentType.RIGHT,
  children:[new TextRun({text:'Bas van der Velden  ·  ',size:15,color:muted}),new TextRun({children:[PageNumber.CURRENT],size:15,color:muted})],
})]});
const doc=new Document({
  creator:'Bas van der Velden',
  title:'Academic curriculum vitae — editable export',
  description:'Editable Word export of the public-facing personal academic CV',
  styles:{
    default:{document:{run:{font,size:20,color:ink},paragraph:{spacing:{line:285,after:95}}}},
  },
  sections:[{
    properties:{page:{size:{width:11906,height:16838},margin:{top:1060,bottom:1000,left:1040,right:1040}}},
    children,
    footers:{default:footer},
  }],
});
await mkdir(dirname(outfile),{recursive:true});
await writeFile(outfile,await Packer.toBuffer(doc));
const visible=cv.sections.filter(s=>s.number!==18).reduce((total,s)=>total+s.entries.filter(e=>!isSupersededPreprint(e)).length,0);
console.log('Editable CV exported to '+outfile+' ('+visible+' visible records, 17 sections).');
