// Structured editorial content. Treat published copy as approved; see AGENTS.md and CONTENT_EDITING.md.
export const site = {
  name: 'Bas van der Velden',
  tagline: 'AI for Food Safety',
  role: 'Principal Scientist | Head of Data Science & AI',
  organisation: 'Wageningen Food Safety Research',
  location: 'Wageningen, the Netherlands',
  email: 'bas.vandervelden@wur.nl',
  intro: 'Developing trustworthy artificial intelligence and putting it to work for food safety research.',
  about: [
    'I work at the intersection of artificial intelligence and food safety, connecting advances in machine learning with the questions and practical constraints of scientific research.',
    'As Head of Data Science & AI at Wageningen Food Safety Research, I lead a multidisciplinary team working on data-driven methods for monitoring, hazard detection, prediction and decision support.',
    'My research interests include explainable and trustworthy AI, foundation models for scientific data, and emerging risk detection. I am particularly interested in research programmes that bring methods, data, domain expertise and people together.'
  ],
  links: {
    wur: 'https://www.wur.nl/en/research/food-safety',
    research: 'https://research.wur.nl/en/persons/bas-van-der-velden/',
    scholar: 'https://scholar.google.com/citations?hl=nl&user=JWT2FmgAAAAJ',
    github: 'https://github.com/basvandervelden',
    review: 'https://github.com/basvandervelden/ai_food_safety_review'
  }
};

export const navigation = [
  {label:'Home', path:'/'},
  {label:'Research', path:'/research'},
  {label:'Projects', path:'/projects'},
  {label:'Publications', path:'/publications'},
  {label:'Academic activities', path:'/academic-activities'},
  {label:'About', path:'/about'}
];

export const researchAreas = [
  {
    slug:'trustworthy-ai',
    number:'01',
    title:'Trustworthy & explainable AI',
    short:'Understanding what models learn, how reliable their predictions are, and whether explanations are useful to domain experts.',
    lead:'AI models can be accurate without being informative or reliable in the settings where they are used. Trustworthiness requires more than performance on a benchmark.',
    perspective:'My interest lies in the intersection of model behaviour, scientific validation and domain expertise. Explainability is valuable when it helps us challenge assumptions, identify model weaknesses and understand decisions.',
    approach:[
      'Interpretability and explanation methods, with attention to the validity and stability of explanations.',
      'Evaluation under distribution shift, label limitations and data scarcity.',
      'Human-in-the-loop assessment in which domain experts can question and improve model outputs.'
    ],
    applications:['Interpretation of food safety monitoring and analytical results','Explaining predictions of chemical and microbiological hazards','Evaluation of AI-assisted prioritisation and screening'],
    media:'Research framework / explainability figure',
    related:['early-warning','foundation-models']
  },
  {
    slug:'foundation-models',
    number:'02',
    title:'Foundation models for scientific data',
    short:'Using, adapting and building general-purpose representations of chemical, biological and image data that can be reused across tasks.',
    lead:'Scientific datasets are often small, heterogeneous and expensive to annotate. Representation learning offers a way to reuse information across experiments, instruments and applications.',
    perspective:'Rather than training a new model from scratch for every task, we explore self-supervised and transfer-learning approaches that can support multiple downstream problems. Model efficiency and scientific validation matter as much as scale.',
    approach:[
      'Self-supervised and latent-predictive learning on scientific measurements.',
      'Multimodal learning across complementary analytical modalities and metadata.',
      'Transfer learning and resource-efficient training under limited labelled data.'
    ],
    applications:['Mass spectrometry and chemical profiling','Microscopy and other laboratory imaging','Cross-dataset representation learning for food research'],
    media:'Representation-learning architecture',
    related:['foundation-models']
  },
  {
    slug:'ai-food-safety',
    number:'03',
    title:'AI for food safety',
    short:'Translating data and modelling advances into earlier hazard detection, better monitoring and more informed decisions.',
    lead:'Food safety presents a combination of rich laboratory data, changing hazards and difficult decisions under uncertainty. AI is useful when it strengthens the underlying evidence.',
    perspective:'A central challenge is the connection between methodological research and practical food safety questions. This includes knowing what data represent, understanding limitations and designing tools around decisions rather than algorithms.',
    approach:[
      'Integrating monitoring data, scientific publications and emerging signals.',
      'Predictive models for screening, forecasting and prioritising risks.',
      'Transparent, expert-guided workflows that make model outputs actionable.'
    ],
    applications:['Chemical and microbiological food hazards','Emerging risks and weak-signal detection','Risk-based monitoring and inspection'],
    media:'Food safety AI applications map',
    related:['chefs','living-review','early-warning']
  }
];

export const projectEntries = [
  {
    slug:'chefs',
    title:'CHEFS',
    category:'Open data · Food monitoring',
    summary:'A harmonised database that makes European food safety monitoring results more accessible for analysis.',
    lead:'The CompreHensive European Food Safety (CHEFS) database brings together analytical monitoring results from European food safety datasets, enabling new ways to analyse trends and explore risks.',
    context:'Official food monitoring produces a substantial volume of data. Before those data can support analysis or AI, differences in structure and terminology need to be resolved.',
    contribution:'CHEFS integrates and harmonises publicly available data into a reusable foundation for research. The published work describes 392 million analytical results across European monitoring datasets from 2000–2024.',
    next:'The wider opportunity is to use such data foundations for transparent trend analysis, risk modelling and early warning.',
    link:'https://doi.org/10.1016/j.foodcont.2025.111816',
    linkLabel:'Read the Food Control paper',
    media:'CHEFS dashboard / data overview',
    secondaryMedia:'Food monitoring map / database visual'
  },
  {
    slug:'living-review',
    title:'Living AI literature review',
    category:'Open science · Evidence synthesis',
    summary:'An evolving, community-oriented overview of AI research in food safety.',
    lead:'The research landscape for AI in food safety changes rapidly. A living literature review can make updates more transparent and keep evidence accessible beyond a single publication.',
    context:'Traditional reviews are valuable snapshots, but their coverage becomes outdated as new papers appear. The challenge is to combine efficient discovery and screening with traceable, expert-reviewed categorisation.',
    contribution:'This ongoing platform explores systematic literature discovery, machine-assisted screening, structured annotation and community input. Decisions about access to full texts and potential selection bias are part of the methodology.',
    next:'The aim is an open, reproducible workflow for maintaining an up-to-date picture of research methods, domains and applications.',
    link:'https://github.com/basvandervelden/ai_food_safety_review',
    linkLabel:'View the GitHub project',
    media:'Literature review platform screenshot',
    secondaryMedia:'Review methodology / screening diagram'
  },
  {
    slug:'foundation-models',
    title:'Foundation models for analytical data',
    category:'Methods · Scientific machine learning',
    summary:'Investigating transferable representations for complex laboratory measurements.',
    lead:'Analytical data can contain transferable structure that is difficult to capture when every study is modelled in isolation.',
    context:'Mass spectrometry and other laboratory measurements vary by experiment, instrument and acquisition setting. Labels are limited and evaluation requires careful handling of these differences.',
    contribution:'Our research explores reusable pretraining objectives, multimodal information and transfer to downstream scientific tasks. We are interested in what representations capture and when they generalise.',
    next:'A focus is on benchmarks that separate generalisation from data leakage or pretraining advantages.',
    link:'https://research.wur.nl/en/persons/bas-van-der-velden/',
    linkLabel:'Related research',
    media:'Scientific spectra / model illustration',
    secondaryMedia:'Transfer-learning workflow'
  },
  {
    slug:'holifood',
    title:'HOLiFOOD',
    category:'Horizon Europe · Emerging risks',
    summary:'Developing AI methods and data-driven approaches to anticipate emerging food safety risks.',
    lead:'HOLiFOOD explored more holistic approaches to emerging food safety risks in a changing food system.',
    context:'Early warning relies on information from different sources, including monitoring data, news, scientific evidence and drivers of change.',
    contribution:'Our work at Wageningen Food Safety Research combined predictive modelling, weak-signal mining and expertise from the food safety domain to investigate ways of detecting and evaluating emerging risks.',
    next:'A key lesson is that better models alone are not enough. Early-warning systems also need sound data, expert validation and clear links to risk assessment and decision-making. The project concluded with a joint HOLiFOOD–FoodSafeR symposium in Wageningen in June 2026.',
    link:'https://holifoodproject.eu/',
    linkLabel:'HOLiFOOD project website',
    media:'HOLiFOOD research and emerging risks',
    secondaryMedia:'Holistic AI and emerging-risk methods'
  },
  {
    slug:'early-warning',
    title:'Early warning & emerging risks',
    category:'Applied AI · Risk intelligence',
    summary:'Combining weak signals, monitoring data and domain knowledge to identify possible emerging food safety hazards.',
    lead:'Emerging hazards rarely arrive as clean, labelled prediction problems. Signals may first appear in scientific reports, news or fragmented monitoring data.',
    context:'Potential signals need to be detected efficiently, but false alarms and missing context can be costly. Expert judgement remains central.',
    contribution:'We investigate human-in-the-loop machine learning, text analysis and structured evaluation to support signal discovery and prioritisation.',
    next:'The objective is not to automate decisions, but to improve the evidence available to researchers and risk assessors.',
    link:'https://research.wur.nl/en/persons/bas-van-der-velden/',
    linkLabel:'Related research',
    media:'Early-warning workflow / visualisation',
    secondaryMedia:'Signal evaluation diagram'
  }
];

// The canonical publication inventory is CV section 13 in cv-data.json.

export const activitySections = [
  {
    title:'Invited talks & scientific exchange',
    description:'Sharing methods and applications with researchers, scientific societies and organisations working on food safety.',
    entries:['Invited contributions to EFSA discussions on trustworthy and explainable AI','Presentations on AI, foundation models and food safety at scientific events']
  },
  {
    title:'Building the research community',
    description:'Creating opportunities for collaboration across AI, analytical science and food safety.',
    entries:['Co-organising the AI for Food Safety (AIFS) scientific community and conference activities','Interdisciplinary research collaborations within Wageningen University & Research and internationally']
  },
  {
    title:'Scientific leadership & mentorship',
    description:'Developing research programmes and supporting the people delivering them.',
    entries:['Principal Scientist at Wageningen Food Safety Research since September 2026','Leadership of the Data Science & AI research team','Supervision and mentoring of researchers and students']
  }
];

export const milestones = [
  {date:'2026 — present', title:'Principal Scientist', institution:'Wageningen Food Safety Research'},
  {date:'Current', title:'Head of Data Science & Artificial Intelligence', institution:'Wageningen Food Safety Research'},
  {date:'2017', title:'PhD in Medical Imaging', institution:'University Medical Center Utrecht'}
];
