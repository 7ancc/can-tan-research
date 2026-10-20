from pathlib import Path
from html import escape as esc
import argparse
import hashlib
import json
import os
import shutil
ROOT=Path(__file__).resolve().parent.parent
MAIL='tancan872@gmail.com'
SCHOLAR='https://scholar.google.com/citations?view_op=list_works&hl=zh-CN&user=nFn48qkAAAAJ'
ORCID='https://orcid.org/0009-0008-6053-2371'
PLOS='https://doi.org/10.1371/journal.pone.0330645'
FRL='https://doi.org/10.1016/j.frl.2024.105688'
# Project content has one editable source; never overwrite it during a build.
PROJECTS=json.loads((ROOT/'projects.json').read_text(encoding='utf-8'))
ORDER=['credit','nlp','climate','aviation','ets','healthcare','neural','market','citrus','planting','venture','innovation-platform','innovation-patent','innovation-social','fishers','marine-heritage','early-warning','retail']
PROJECTS.sort(key=lambda p: ORDER.index(p['id']))
PAGES={}
SITE_CONFIG=json.loads((ROOT/'site-config.json').read_text()) if (ROOT/'site-config.json').exists() else {}
SITE_URL=os.environ.get('PORTFOLIO_SITE_URL',SITE_CONFIG.get('url','')).rstrip('/')
SITE_URL=SITE_URL+'/' if SITE_URL else ''

GROUPS={
 'business':{'name':'AI for Business & FinTech','desc':'Corporate risk, customer insights and the translation of AI-enabled systems into decisions.','label':'01 / PRIMARY FOCUS'},
 'ml':{'name':'AI & Machine Learning','desc':'Forecasting, language models, predictive risk analytics and interdisciplinary methods.','label':'02 / TECHNICAL RESEARCH'},
 'economics':{'name':'Economics & Quantitative Finance','desc':'Empirical policy analysis, corporate capital allocation and economic efficiency.','label':'03 / ECONOMIC FOUNDATIONS'}
}


EDUCATION = [{'id': 'sdu', 'university': 'Shandong University', 'faculty': 'School of Business · Graduate', 'date': 'Sep 2025 – Jun 2028 (expected)', 'degree': 'MSc in Applied Economics', 'area': 'Finance / Insurance', 'gpa': '90.91/100', 'rank': '8/46', 'admission': 'Ranked 1st in the school-wide postgraduate recommendation evaluation; admitted to Shandong University through the exam-exempt track.', 'honors': ['Second-Class University Scholarship', 'Outstanding Individual in Social Service'], 'courses': [('Intermediate and Advanced Econometrics', '99'), ('Intermediate and Advanced Macroeconomics', '95'), ('Artificial Intelligence in Business', '93'), ('Microeconomic Finance Theory', '90.5')]}, {'id': 'gou', 'university': 'Guangdong Ocean University', 'faculty': 'School of Management · Undergraduate', 'date': 'Sep 2021 – Jun 2025', 'degree': 'Bachelor’s in Financial Management', 'area': '', 'gpa': '4.13/5.00', 'rank': '1/151', 'admission': '', 'honors': ['National Scholarship', 'Top 10 Outstanding Student of the University', 'First-Class University Scholarship (awarded annually)', 'Outstanding Student Leader (University Level)', 'Zhengda Scholarship (Top 10 in the School · Top 0.31%)'], 'courses': [('Tax Planning', '98'), ('Mathematics for Economics', '97'), ('Marketing', '96'), ('Financial Accounting Simulation', '95'), ('Macroeconomics', '94'), ('Advanced Financial Management', '94'), ('Corporate Strategy and Risk Management', '93'), ('Investments', '93'), ('Probability and Mathematical Statistics', '92'), ('Financial Markets', '90'), ('Linear Algebra', '90'), ('Microeconomics', '88')]}]

def education_cards():
 cards=[]
 for school in EDUCATION:
  a=school['id']
  degree=esc(school['degree'])+((' · '+esc(school['area'])) if school['area'] else '')
  honors=''.join('<li>'+esc(v)+'</li>' for v in school['honors'])
  courses=''.join('<li><span>'+esc(name)+'</span><strong>'+esc(score)+'</strong></li>' for name,score in school['courses'])
  admission=('<p class="admission-note"><strong>Academic distinction</strong> · '+esc(school['admission'])+'</p>') if school['admission'] else ''
  cards.append(f"""<article class="school-card school-{a}">
 <div class="school-top"><img class="school-logo" src="assets/{a}_logo.png" alt="{esc(school['university'])} emblem" loading="lazy"><span class="school-date">{esc(school['date'])}</span></div>
 <div class="school-faculty">{esc(school['faculty'])}</div>
 <h3>{esc(school['university'])}</h3><p class="school-degree">{degree}</p>
 <div class="school-metrics"><div><small>GPA</small><strong>{esc(school['gpa'])}</strong></div><div><small>Academic rank</small><strong>{esc(school['rank'])}</strong></div></div>
 {admission}
 <div class="school-detail"><h4>Honors &amp; scholarships</h4><ul class="school-honors">{honors}</ul></div>
 <div class="school-detail courses-panel"><h4>Courses &amp; grades</h4><ul class="school-courses">{courses}</ul></div>
 </article>""")
 return '<div class="school-grid">'+''.join(cards)+'</div>'

def header(page='home'):
 nav=[('About','index.html#about'),('Publications','index.html#publications'),('Research','index.html#research'),('Methods','index.html#methods'),('Education','index.html#education'),('Experience','experience.html'),('Contact','index.html#contact')]
 return '<a class="skip" href="#main">Skip to content</a><header class="header"><div class="wrap header-inner"><a class="brand" href="index.html">TAN Can<span>.</span></a><button class="hamburger" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav">Menu ☰</button><nav class="nav" id="site-nav" aria-label="Main navigation">'+''.join(f'<a href="{href}"'+(' aria-current="page"' if (page=='education' and title=='Education') or (page=='experience' and title=='Experience') else '')+'>'+title+'</a>' for title,href in nav)+'</nav></div></header>'

def footer():
 return '<footer class="footer"><div class="wrap"><span>© 2026 Can Tan · Academic research portfolio</span><span><a href="index.html">Home</a> · <a href="research.html">Research details</a> · <a href="experience.html">Additional experience</a></span></div></footer><script src="assets/site.js" defer></script>'

PAGE_META={
 'home':('index.html','Can Tan — visiting research portfolio in AI for Business, FinTech, machine learning and applied economics.'),
 'research':('research.html','Research questions, methods, individual contributions and publication status across nine projects by Can Tan.'),
 'education':('education.html','Can Tan’s academic background at Shandong University and Guangdong Ocean University, including coursework, grades and honors.'),
 'experience':('experience.html','Can Tan’s field research, finance practice, interdisciplinary AI projects, patents and academic leadership.')
}

def wrap_page(title,body,page='home'):
 filename,description=PAGE_META.get(page,(page+'.html','TAN Can — research, experience and original records.'))
 url=SITE_URL+('' if filename=='index.html' else filename)
 full_title=title+' | Can Tan'
 meta=(f'<link rel="canonical" href="{url}">'
       f'<meta property="og:type" content="website"><meta property="og:locale" content="en_US">'
       f'<meta property="og:site_name" content="Can Tan — Research Portfolio">'
       f'<meta property="og:title" content="{esc(full_title,quote=True)}">'
       f'<meta property="og:description" content="{esc(description,quote=True)}">'
       f'<meta property="og:url" content="{url}">'
       f'<meta property="og:image" content="{SITE_URL}assets/portrait.png">'
       f'<meta property="og:image:alt" content="Can Tan — professional portrait">'
       '<meta name="twitter:card" content="summary"><meta name="author" content="Can Tan">')
 html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>{esc(full_title)}</title><meta name="description" content="{esc(description,quote=True)}">{meta}<link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/styles.css"></head><body>{header(page)}<main id="main">{body}</main>{footer()}</body></html>'''
 # Intrinsic dimensions reserve space; existing CSS still sets display sizes.
 dimensions={'portrait.png':(253,289),'credit.png':(880,630),'climate_figure.jpg':(803,540),'ets.png':(880,540),'sdu_logo.png':(114,114),'gou_logo.png':(114,114)}
 for image,(width,height) in dimensions.items():
  html=html.replace(f'src="assets/{image}"',f'src="assets/{image}" width="{width}" height="{height}" decoding="async"')
 if not SITE_URL:
  import re
  meta=re.sub(r'<link rel="canonical"[^>]+>|<meta property="og:(?:url|image)"[^>]+>', '', meta)
  html=re.sub(r'<link rel="canonical"[^>]+>|<meta property="og:(?:url|image)"[^>]+>', '', html)
 html=html.replace('alt="Can Tan — professional portrait"','alt="Can Tan — professional portrait" fetchpriority="high"')
 return html


def project_card(p):
 visual=f'<div class="project-visual"><img src="assets/{p["image"]}" alt="Simple overview diagram for {esc(p["title"])}" loading="lazy"></div>' if p.get('image') else ''
 return f'''<article class="project-card{' featured' if p.get('featured') else ''}" data-project="{p['id']}" data-track="{p['group']}" >
 <div class="card-copy"><div class="card-status">{esc(p['status'])}</div><h3>{esc(p['title'])}</h3><p class="card-role">{esc(p['role'])}</p><p class="desc">{esc(p['desc'])}</p><div class="methods">{esc(p['methods'])}</div><div class="mini-label">{esc(p['result'])}</div><a href="research.html#{p['id']}">Research question, methods & contribution ↗</a></div>{visual}</article>'''

home='''
<section class="wrap hero" id="about"><div class="hero-text"><div class="kicker">Prospective visiting research / exchange student</div><h1>AI for Business &amp; FinTech, <span class="hilite">grounded in economics.</span></h1><p class="hero-lead">I am pursuing a master's degree in <strong>Applied Economics at Shandong University</strong>, admitted through the recommendation-based postgraduate track after <strong>ranking first in my undergraduate school in the recommendation evaluation.</strong></p><p class="hero-note">I am deeply interested in the intersection of finance, economics, machine learning and emerging AI applications. I enjoy turning research questions into evidence—through rigorous analysis, interdisciplinary learning and sustained execution.</p><div class="actions"><a class="btn btn-main" href="#research">Explore selected research ↗</a><a class="btn btn-outline" href="#education">Academic background ↗</a></div></div><figure class="profile"><div class="profile-photo"><img src="assets/portrait.png" alt="Can Tan — professional portrait"></div><figcaption><span class="profile-name">TAN Can</span><small>MSc Applied Economics · Shandong University (2025–2028 expected)</small><small>Finance / Insurance · School of Business</small><div class="profile-links"><a href="https://scholar.google.com/citations?view_op=list_works&amp;hl=zh-CN&amp;user=nFn48qkAAAAJ" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a><a href="https://orcid.org/0009-0008-6053-2371" target="_blank" rel="noopener noreferrer">ORCID ↗</a></div></figcaption></figure></section>
<div class="proofline"><div class="wrap"><div class="proof"><b>1st</b><span>Undergraduate postgraduate-recommendation ranking</span></div><div class="proof"><b>2</b><span>Published peer-reviewed papers</span></div><div class="proof"><b>2</b><span>First-author manuscripts submitted</span></div><div class="proof"><b>90.91/100</b><span>Master's academic GPA</span></div></div></div>
<section class="block" id="strengths"><div class="wrap"><div class="section-top"><div><div class="kicker">About me</div><h2>Three strengths I bring to research.</h2></div></div><div class="strengths"><article class="strength"><div class="num">01 / RESEARCH CURIOSITY &amp; LEARNING</div><h3>Curiosity &amp; independent learning</h3><p>Research genuinely excites me: I enjoy asking why a method works and learning what it takes to test an idea. That curiosity has taken me from econometrics to LSTM forecasting, NLP and AI workflows.</p><div class="proof-tag">Evidence: cross-disciplinary papers &amp; independent Python reproductions</div></article><article class="strength"><div class="num">02 / RIGOUR &amp; RESILIENCE</div><h3>End-to-end research execution</h3><p>I can take an empirical study through question formulation, data preparation, modelling, validation, figures and manuscript writing. I sustain parallel academic commitments without losing attention to detail.</p><div class="proof-tag">Evidence: Rank 1/151 · 30+ national/provincial honours · published articles &amp; submitted first-author work</div></article><article class="strength"><div class="num">03 / COLLABORATION &amp; INITIATIVE</div><h3>Work across disciplines and people</h3><p>Field research, financial practice, AI product commercialisation and academic organising have trained me to communicate with technical, business and research collaborators.</p><div class="proof-tag">Evidence: 434 valid surveys · AI-enabled projects · research-community leadership</div></article></div></div></section>
<section class="block beige" id="publications"><div class="wrap"><div class="section-top"><div><div class="kicker">Research outputs</div><h2>Publications &amp; manuscripts.</h2></div></div><div class="pub-grid">
<article class="pub"><div class="state">PUBLISHED · 2025 · FIRST-LISTED EQUAL CONTRIBUTOR</div><h3>Forecasting and analysing global average temperature trends based on LSTM and ARIMA models</h3><p><i>PLOS One</i>, 20(9), e0330645 · Tan, C. et al.</p><a href="https://doi.org/10.1371/journal.pone.0330645" target="_blank" rel="noopener noreferrer">Read published article ↗</a></article>
<article class="pub"><div class="state">PUBLISHED · 2024 · THIRD AUTHOR</div><h3>Revolutionizing healthcare: Unveiling China's healthcare efficiency quest and path to progress</h3><p><i>Finance Research Letters</i>, 67, 105688 · Li, H. et al.</p><a href="https://doi.org/10.1016/j.frl.2024.105688" target="_blank" rel="noopener noreferrer">Read published article ↗</a></article>
<article class="pub submitted"><div class="state">SUBMITTED · FIRST AUTHOR · NOT YET PUBLISHED</div><h3>Environmental Fee-to-Tax Reform and Corporate Debt Default Risk</h3><p>The dual perspectives of internal financial restructuring and external market clearing · Submitted to <i>Securities Market Herald</i>.</p><a href="research.html#credit">Study &amp; contribution ↗</a></article>
<article class="pub submitted"><div class="state">SUBMITTED · FIRST AUTHOR · NOT YET PUBLISHED</div><h3>The Dark Side of Carbon Markets? ETS-Induced Reduction in Corporate Patient Capital</h3><p>Empirical research on China's high-pollution industries · Submitted to <i>Ecological Economics</i>.</p><a href="research.html#ets">Study &amp; contribution ↗</a></article>
</div></div></section>
<section class="block white" id="research"><div class="wrap"><div class="section-top"><div><div class="kicker">Selected research · methods and outcomes</div><h2>Research &amp; project experience.</h2></div><p class="summary">Projects are ordered from financial and machine-learning research to interdisciplinary applications. All projects are visible below; use the links to move between groups.</p></div><nav class="tab-bar project-navigation" aria-label="Project groups"><a class="tab" href="#core-projects">Core research</a><a class="tab" href="#economic-projects">Economics &amp; finance</a><a class="tab" href="#applied-projects">Applied AI &amp; field research</a><a class="tab" href="#further-projects">Further quantitative research</a></nav><div class="project-groups">__PROJECTS__</div><div class="link-row"><a class="inline-cta" href="research.html">View all project details &amp; research contributions ↗</a></div></div></section>
<section class="block sage" id="methods"><div class="wrap"><div class="section-top"><div><div class="kicker">Technical preparation</div><h2>Research methods &amp; tools.</h2></div><p class="summary">Methods I have used across empirical research, forecasting and applied machine-learning projects.</p></div><div class="tool-table"><div class="tool-row"><strong>Econometrics &amp; causal inference</strong><span>DID / DDD · PSM-DID · DDML · panel data · Stata</span><a href="research.html#credit">Corporate default-risk research ↗</a></div><div class="tool-row"><strong>Financial risk &amp; efficiency</strong><span>KMV–EDF · DEA · financial ratio analysis</span><a href="research.html#healthcare">Corporate risk / healthcare efficiency ↗</a></div><div class="tool-row"><strong>AI, forecasting &amp; NLP</strong><span>Python · PyTorch · scikit-learn · LSTM · ARIMA · XGBoost · BERT</span><a href="research.html#nlp">Climate, NLP &amp; aviation studies ↗</a></div><div class="tool-row"><strong>Data, fieldwork &amp; evidence</strong><span>SPSS · Jieba · SO-PMI · ACSI · Origin · survey research</span><a href="research.html#market">434-response research project ↗</a></div></div><div class="full-tools"><strong>Additional research &amp; working tools</strong><p>Transformers · time-series forecasting · predictive modelling · CiteSpace · Vensim / system dynamics · Excel · Git/GitHub · LaTeX · LLM / agentic workflows · API/RAG familiarity. Languages: Mandarin Chinese (native), English (CET-6).</p></div></div></section>
<section class="block academic-block" id="education"><div class="wrap"><div class="section-top"><div><div class="kicker">Academic record</div><h2>Education.</h2></div></div>__EDUCATION_CARDS__</div></section>
<section class="block white" id="experience"><div class="wrap"><div class="section-top"><div><div class="kicker">Beyond publications</div><h2>Additional research-relevant experience.</h2></div><p class="summary">Practical experiences are summarised here, with detailed contributions and photos reserved for a separate page.</p></div><div class="experience-strip"><a href="experience.html#fieldwork"><span class="meta">FIELD RESEARCH</span><h3>On-the-ground research</h3><p>Consumer interviews, 434 questionnaires, field validation and stakeholder communication across real research settings.</p></a><a href="experience.html#practice"><span class="meta">FINANCE &amp; ANALYTICS</span><h3>Financial decision contexts</h3><p>IPO due diligence, transaction verification, corporate financial analysis and traceable evidence reporting.</p></a><a href="experience.html#interdisciplinary"><span class="meta">INNOVATION &amp; TEAMWORK</span><h3>AI applications &amp; collaboration</h3><p>Neural dynamics, intelligent detection, agritech commercialisation, patents and academic research initiatives.</p></a></div><div class="link-row"><a class="inline-cta" href="experience.html">Explore additional experience &amp; achievements ↗</a></div></div></section>
<section class="block sage" id="research-value"><div class="wrap"><div class="contribution"><h3>How I can support a research group.</h3><p>From literature review and research design to <strong>data preparation, empirical modelling, validation, visualisation and manuscript development</strong>—I can contribute across the research workflow, particularly where machine learning meets business or financial questions. <a href="research.html#credit" class="inline-cta">See the evidence ↗</a></p></div></div></section>
<section class="contact" id="contact"><div class="wrap contact-layout"><div><div class="kicker">Research interests &amp; contact</div><h2>Research discussions &amp; learning.</h2><p>I enjoy exploring questions at the intersection of AI, finance and economics. I value thoughtful academic exchange, fresh perspectives and opportunities to learn through research.</p><div class="actions"><a class="btn btn-main" href="mailto:tancan872@gmail.com?subject=Visiting%20Research%20Opportunity">Email ↗</a><a class="btn btn-outline" href="#education">Academic record ↗</a></div></div><div class="contact-card"><h3>Academic profile</h3><p>Can Tan · MSc Applied Economics<br>Shandong University · Expected graduation June 2028</p><a href="mailto:tancan872@gmail.com">tancan872@gmail.com ↗</a><a href="https://scholar.google.com/citations?view_op=list_works&amp;hl=zh-CN&amp;user=nFn48qkAAAAJ" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a><a href="https://orcid.org/0009-0008-6053-2371" target="_blank" rel="noopener noreferrer">ORCID ↗</a><p class="fineprint" style="color:#d1ded0">Academic CV available with application email. Additional manuscripts and research materials available upon request.</p></div></div></section>
'''
GROUP_ORDER=[('core-projects','Core research',['credit','nlp','climate','aviation']),('economic-projects','Economics & finance',['ets','healthcare']),('applied-projects','Applied AI & field research',['neural','market','citrus','planting','venture','innovation-platform','innovation-patent','innovation-social']),('further-projects','Further quantitative research',['fishers','marine-heritage','early-warning','retail'])]
project_groups=''.join('<section class="project-group" id="'+id+'"><h3 class="project-group-title">'+esc(title)+'</h3><div class="project-list">'+''.join(project_card(p) for p in PROJECTS if p['id'] in ids)+'</div></section>' for id,title,ids in GROUP_ORDER)
home=home.replace('__PROJECTS__',project_groups).replace('__EDUCATION_CARDS__',education_cards())
PAGES['index.html']=wrap_page('AI for Business & FinTech · Visiting Research',home)

def detail_project(p,i):
 caption=("Published climate research figure excerpt (Tan et al., 2025, Fig. 6; CC BY). For the full context see the linked paper." if p["id"]=="climate" else "Conceptual method schematic, not an empirical estimate. Original figures and supporting documents may be available upon request.")
 image=f'<figure class="evidence-image"><img loading="lazy" src="assets/{p["image"]}" alt="Visual reference for {esc(p["title"])}"><figcaption>{esc(caption)}</figcaption></figure>' if p.get('image') else ''
 note=f'<p class="fineprint">{esc(p["notes"])}</p>' if p.get('notes') else ''
 src=''
 if p['id']=='climate':src=f'<p><a class="inline-cta" href="{PLOS}" target="_blank" rel="noopener noreferrer">Published article ↗</a></p>'
 if p['id']=='healthcare':src=f'<p><a class="inline-cta" href="{FRL}" target="_blank" rel="noopener noreferrer">Published article ↗</a></p>'
 return f'''<section class="detail" id="{p['id']}"><div class="wrap"><div class="detail-head"><div class="detail-index">{i:02d} / {p['group'].upper()}</div><div><div class="eyebrow">{esc(p['status'])}</div><h2>{esc(p['title'])}</h2><p class="detail-summary">{esc(p['desc'])}</p><div class="facts"><div class="fact"><small>My role</small><strong>{esc(p['role'])}</strong></div><div class="fact"><small>Methods</small><strong>{esc(p['methods'])}</strong></div><div class="fact"><small>Output or recognition</small><strong>{esc(p['result'])}</strong></div></div><div class="detail-body"><div><h3>Research question</h3><p>{esc(p['question'])}</p><p>{esc(p['desc'])}</p>{src}</div><div><h3>My specific contributions</h3><ul>{''.join('<li>'+esc(x)+'</li>' for x in p['contrib'])}</ul>{note}</div></div>{image}</div></div></div></section>'''
research_body='''<section class="page-hero"><div class="wrap"><div class="kicker">Methods · contributions · research outputs</div><h1>Selected research &amp; project details.</h1><p>Each project is presented once with an explicit research question, actual work and role attribution. For published articles, the DOI links provide the authoritative record.</p><div class="detail-nav"><a href="index.html#research">← Back to research overview</a><a href="#credit">Business &amp; FinTech</a><a href="#climate">AI &amp; ML</a><a href="#ets">Economics &amp; Finance</a></div></div></section>'''+''.join(detail_project(p,i) for i,p in enumerate(PROJECTS,1))+'''<section class="block sage"><div class="wrap"><h2>Need more detail?</h2><p class="section-intro">Unpublished manuscripts, working-paper figures and certain supporting project documents can be shared in an appropriate academic context upon request.</p><div class="page-actions"><a class="btn btn-main" href="mailto:tancan872@gmail.com?subject=Research%20Materials%20Request">Request research materials ↗</a><a class="btn btn-outline" href="index.html">Return home ↗</a></div></div></section>'''
PAGES['research.html']=wrap_page('Research & Project Details',research_body,page='research')

education_body='''<section class="page-hero"><div class="wrap"><div class="kicker">Academic background</div><h1>Education.</h1><p>Academic preparation, coursework and honors presented in full.</p><div class="page-actions"><a class="btn btn-outline" href="index.html#education">← Back to main research portfolio</a></div></div></section><section class="block academic-block"><div class="wrap">__EDUCATION_CARDS__</div></section>'''
education_body=education_body.replace('__EDUCATION_CARDS__',education_cards())
PAGES['education.html']=wrap_page('Education & Academic Background',education_body,page='education')

experience_body='''<section class="page-hero"><div class="wrap"><div class="kicker">Complementary experience</div><h1>Additional experience &amp; achievements.</h1><p>A selective record of fieldwork, finance, interdisciplinary research and leadership. These experiences are available for professors seeking evidence of collaboration, initiative and practical research readiness.</p><div class="detail-nav"><a href="index.html#experience">← Back to overview</a><a href="#fieldwork">Field research</a><a href="#practice">Finance</a><a href="#interdisciplinary">AI &amp; innovation</a><a href="#leadership">Leadership</a></div></div></section><section class="block" id="fieldwork"><div class="wrap"><div class="kicker">Field research &amp; consumer evidence</div><h2>Working directly with real-world questions.</h2><div class="edu-grid"><div class="edu-card"><h3>Consumer satisfaction research</h3><p><strong>Team lead · Five-member team.</strong> Designed and coordinated field research on recreational fisheries, combining 434 valid questionnaire responses, Python/Jieba and SO-PMI text analysis, SPSS and ACSI evaluation. Produced a 105-page report and received the Provincial Second Prize in the CP Cup.</p><p><a class="inline-cta" href="research.html#market">Research methods and contribution ↗</a></p></div><div class="edu-card"><h3>Agritech field validation</h3><p><strong>Deputy project lead · Commercialisation.</strong> Field engagement with growers, business partners and technical collaborators on an AI-enabled citrus pest monitoring system. Translated stakeholder feedback into product concepts, business models and market plans.</p><p><a class="inline-cta" href="research.html#citrus">Research-to-market contribution ↗</a></p></div></div><p class="section-aside">Fieldwork photographs are intentionally kept off the main research homepage to preserve focus. Selected original documentation may be provided upon request.</p></div></section><section class="block beige" id="practice"><div class="wrap"><div class="kicker">Finance practice</div><h2>Data-intensive work in financial settings.</h2><div class="subsection"><h3>Sinolink Securities · IPO due diligence · Jun–Sep 2026</h3><p>Reviewed 4,350+ procurement and sales records, 45 material contracts and over 43,000 bank transactions; analysed 330+ shareholders' dividend flows. Assisted in prospectus and sponsorship-material revision and drafted transaction-related due-diligence sections and working papers.</p></div><div class="subsection"><h3>Zhuhai Da Heng Qin Group · Finance intern · 2023–2024</h3><p>Prepared operating analysis for two subsidiaries, including revenue, cost, cash flow, liquidity and profitability indicators, producing more than 60 pages of management presentation materials and supporting finance operations across seven subsidiaries.</p></div><div class="subsection"><h3>Zhuhai Municipal Construction · Finance specialist · Mar–Jun 2025</h3><p>Reviewed more than 400 invoices, supported tax compliance, handled Kingdee ERP accounting procedures and processed over RMB 18 million of payments.</p></div></div></section><section class="block" id="interdisciplinary"><div class="wrap"><div class="kicker">Applied AI &amp; cross-disciplinary work</div><h2>Learning across research and industry.</h2><div class="pub-grid"><div class="pub"><div class="state">RESEARCH &amp; INTELLECTUAL PROPERTY</div><h3>Neural dynamics &amp; intelligent detection</h3><p>Supported ACGND-related research through literature review, mathematical method screening, figure preparation and research communication. Co-inventor on a granted hyperspectral detection patent, ZL202410627687.5.</p><a href="research.html#neural">Research role ↗</a></div><div class="pub"><div class="state">AI PRODUCT &amp; MARKET APPLICATION</div><h3>Intelligent agriculture initiatives</h3><p>Supported product commercialisation, financial models and industry collaboration across AI-enabled citrus monitoring and intelligent unmanned planting systems; earned selected national and provincial innovation recognition.</p><a href="research.html#citrus">Applied AI project ↗</a></div><div class="pub"><div class="state">QUANTITATIVE MODELLING</div><h3>Forecasting, NLP &amp; risk analytics</h3><p>Modelled time series and review text through LSTM, ARIMA, BERT–BiLSTM–CNN and XGBoost research studies, with additional independent reproduction of core Python workflows.</p><a href="research.html#nlp">Modelling studies ↗</a></div><div class="pub"><div class="state">ENTREPRENEURSHIP &amp; EXECUTION</div><h3>From research to commercial decisions</h3><p>Led financial and business analysis in a prepared-seafood commercialisation venture receiving national recognition and coverage by major media. Work included market intelligence, cost models and field coordination.</p><a href="mailto:tancan872@gmail.com?subject=Further%20Portfolio%20Materials">Further materials on request ↗</a></div></div></div></section><section class="block sage" id="leadership"><div class="wrap"><div class="kicker">Academic community</div><h2>Research-oriented leadership.</h2><p class="section-intro">As a Graduate Student Union leader, I have helped organise academic exchange and peer-learning initiatives, including an “AI for Research” seminar concept and research-needs survey work. These experiences complement—not replace—my technical research training.</p><div class="callout">The value I hope to bring to a visiting research group is not simply a long list of activities, but consistent follow-through, collaboration across backgrounds and willingness to learn unfamiliar methods.</div><div class="page-actions"><a class="btn btn-main" href="index.html#contact">Visiting research opportunity ↗</a><a class="btn btn-outline" href="index.html#research">Research overview ↗</a></div></div></section>'''
PAGES['experience.html']=wrap_page('Additional Experience & Achievements',experience_body,page='experience')
# These generated files are checked in for simple static hosting.
PAGES['sitemap.xml']='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+SITE_URL+('' if name=='index.html' else name)+'</loc></url>' for name,_ in PAGE_META.values())+'</urlset>\n'
from merge_content import apply
apply(PAGES,PROJECTS,wrap_page,header,footer,ROOT)
from reference_refinement import apply as refine_reference
refine_reference(PAGES,PROJECTS,wrap_page,ROOT)
from profile_polish import apply as polish_profile
polish_profile(PAGES)
from v5_1_integration import apply as integrate_v5_1
integrate_v5_1(PAGES)
if SITE_URL:
 PAGES['sitemap.xml']='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+SITE_URL+('' if name=='index.html' else name)+'</loc></url>' for name in PAGES if name.endswith('.html'))+'</urlset>\n'
 PAGES['robots.txt']='User-agent: *\nAllow: /\nSitemap: '+SITE_URL+'sitemap.xml\n'
MANIFEST=ROOT/'scripts/generated-sha256.json'

def digest(data):
 return hashlib.sha256(data).hexdigest()

def main():
 parser=argparse.ArgumentParser(description='Build the V4 static site without silently overwriting direct HTML edits.')
 parser.add_argument('--check',action='store_true',help='Check generated output without writing any files')
 parser.add_argument('--force',action='store_true',help='Explicitly replace direct edits after backing them up')
 parser.add_argument('--output',type=Path,help='Export only deployable files to a separate directory')
 args=parser.parse_args()
 if args.check and (args.force or args.output):
  parser.error('--check cannot be combined with --force or --output')
 if args.check:
  stale=[name for name,content in PAGES.items() if not (ROOT/name).is_file() or (ROOT/name).read_bytes()!=content.encode('utf-8')]
  expected={name:digest(content.encode('utf-8')) for name,content in PAGES.items()}
  if stale or not MANIFEST.exists() or json.loads(MANIFEST.read_text(encoding='utf-8'))!=expected:
   raise SystemExit('Generated files or manifest are out of date: '+', '.join(stale)+'. Run python3 scripts/build.py after reviewing source changes.')
  print('PASS: generated pages and manifest match the merged sources.')
  return
 # Guard exports too: direct edits must be reconciled before publishing.
 previous=json.loads(MANIFEST.read_text(encoding='utf-8')) if MANIFEST.exists() else {}
 changed=[name for name,sha in previous.items() if (ROOT/name).exists() and digest((ROOT/name).read_bytes())!=sha]
 if changed and not args.force:
  raise SystemExit('REFUSED: direct edits detected in '+', '.join(changed)+'. Back up these edits and move them into scripts/build.py / projects.json. Use --force only after reconciliation.')
 output=args.output.resolve() if args.output else ROOT
 if args.output and (output==ROOT or ROOT.is_relative_to(output) or output==(ROOT/'assets') or (ROOT/'assets') in output.parents or output==(ROOT/'scripts') or (ROOT/'scripts') in output.parents):
  parser.error('--output must be a separate export directory, such as _site')
 output.mkdir(parents=True,exist_ok=True)
 for name,content in PAGES.items():
  (output/name).write_text(content,encoding='utf-8')
 if args.output:
  shutil.copytree(ROOT/'assets',output/'assets',dirs_exist_ok=True)
  shutil.copytree(ROOT/'content',output/'content',dirs_exist_ok=True)
  (output/'.nojekyll').touch()
 else:
  MANIFEST.write_text(json.dumps({name:digest((ROOT/name).read_bytes()) for name in PAGES},indent=2)+'\n',encoding='utf-8')
 print('Generated',len([n for n in PAGES if n.endswith('.html')]),'HTML pages with',len(PROJECTS),'distinct projects in',output)

if __name__=='__main__':
 main()
