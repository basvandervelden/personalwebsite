// Website content is kept separate from the React layout.
export const profile = {
  name: 'Bas van der Velden',
  role: 'Principal Scientist · Head of Data Science & AI',
  organisation: 'Wageningen Food Safety Research',
  location: 'Wageningen, The Netherlands',
  email: 'bas.vandervelden@wur.nl',
  intro: 'I develop and apply trustworthy artificial intelligence to help anticipate, detect and understand risks in our food system.',
  bio: 'I lead the Data Science & AI team at Wageningen Food Safety Research. We connect advances in machine learning to the practical needs of food safety research, monitoring and decision-making. My interests lie at the intersection of explainable AI, foundation models, data-intensive science and emerging risk detection.'
};

export const links = {
  research: 'https://research.wur.nl/en/persons/bas-van-der-velden/',
  github: 'https://github.com/basvandervelden',
  review: 'https://github.com/basvandervelden/ai_food_safety_review',
  wur: 'https://www.wur.nl/en/research/food-safety',
};

export const themes = [
  { number:'01', title:'Trustworthy & explainable AI', text:'Understanding model behaviour, critically evaluating explanations and building AI that researchers and decision-makers can scrutinise.', labels:['Explainability','Validation','Responsible AI'] },
  { number:'02', title:'Foundation models for scientific data', text:'Developing reusable representations for chemical, biological and image data, including learning from limited labels.', labels:['Representation learning','Multimodal AI','Data efficiency'] },
  { number:'03', title:'AI for food safety', text:'Applying AI to hazard identification, early warning, monitoring and risk prioritisation.', labels:['Emerging risks','Food monitoring','Human-in-the-loop'] }
];

export const projects = [
  { title:'CHEFS', eyebrow:'OPEN DATA · FOOD MONITORING', subtitle:'CompreHensive European Food Safety database', summary:'Bringing European food monitoring results together in a harmonised, research-ready resource for understanding trends and risks.', link:'https://doi.org/10.1016/j.foodcont.2025.111816', linkLabel:'Read the paper', marker:'392M', markerCaption:'analytical results in the published paper', style:'lavender' },
  { title:'AI foundation models', eyebrow:'RESEARCH · SCIENTIFIC AI', subtitle:'Reusable models for scientific measurements', summary:'Exploring general-purpose representations of chemical and biological data to support downstream tasks with fewer labelled examples.', link:'https://research.wur.nl/en/persons/bas-van-der-velden/', linkLabel:'Explore research', marker:'FM', markerCaption:'models for science', style:'sage' },
  { title:'Living AI literature review', eyebrow:'OPEN SCIENCE · LITERATURE', subtitle:'A continuously evolving map of AI in food safety', summary:'Developing an open, community-oriented way of collecting, screening and understanding the evolving research literature.', link:'https://github.com/basvandervelden/ai_food_safety_review', linkLabel:'View the project', marker:'OPEN', markerCaption:'community-oriented research', style:'peach' }
];

export const publications = [
  {year:'2026', title:'Artificial intelligence in food safety', authors:'F. van Meer, M. Takeuchi, P. E. Ochieng, R. Tavelli, A. Gerssen & B. H. M. van der Velden', journal:'npj Science of Food · Review', url:'https://doi.org/10.1038/s41538-026-00925-1'},
  {year:'2025', title:'CompreHensive European Food Safety (CHEFS) database', authors:'N. Kızılilsoley and colleagues', journal:'Food Control · Research article', url:'https://doi.org/10.1016/j.foodcont.2025.111816'},
  {year:'2025', title:'Federated learning in food research', authors:'Z. Fendor, B. H. M. van der Velden, X. Wang, A. J. Carnoli, O. Mutlu & A. Hürriyetoğlu', journal:'Journal of Agriculture and Food Research · Review', url:'https://doi.org/10.1016/j.jafr.2025.102238'}
];

export const experience = [
 {time:'2026 — present', title:'Principal Scientist', sub:'Wageningen Food Safety Research', description:'Scientific leadership and the development of research programmes and collaborations.'},
 {time:'Current', title:'Head of Data Science & AI', sub:'Wageningen Food Safety Research', description:'Leading a multidisciplinary research team working on methods and applications for food safety.'},
 {time:'2017', title:'PhD in Medical Imaging', sub:'University Medical Center Utrecht', description:'Deep learning research at the intersection of imaging, modelling and clinical application.'}
];
