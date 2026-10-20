"""User screenshot-directed refinement,2026-10-16. Local only."""
from html import escape as E
import json,re

def apply(pages,projects,wrap,root):
 by={p['id']:p for p in projects}
 # Original high-resolution assets; crop only the transparent canvas through CSS.
 for name,html in list(pages.items()):
  if not name.endswith('.html'):continue
  html=html.replace('src="assets/portrait.png" width="253" height="289"','src="assets/portrait-original.jpg" width="1122" height="1402"')
  html=html.replace('src="assets/sdu_logo.png"','src="assets/sdu-original.png"').replace('src="assets/gou_logo.png"','src="assets/gou-original.png"')
  html=html.replace('class="school-logo" src="assets/sdu-original.png"','class="school-logo sdu-supplied" src="assets/sdu-original.png"')
  html=html.replace('class="school-logo" src="assets/gou-original.png"','class="school-logo gou-supplied" src="assets/gou-original.png"')
  html=re.sub(r'<img class="school-logo sdu-supplied"[^>]+>', '<svg class="school-logo sdu-supplied" viewBox="202 100 235 225" role="img" aria-label="Shandong University emblem"><image href="assets/sdu-original.png" width="639" height="327"/></svg>',html)
  pages[name]=html
 home=pages['index.html']
 home=re.sub(r'<a class="btn btn-outline" href="#education">Academic background ↗</a>','',home)
 home=re.sub(r'<p class="strength-more">.*?</p>','',home)
 # Restore the template's compact, clickable three-track research block.
 badges={
  'credit':['Submitted','First-author manuscript','Outstanding thesis · 96/100'],
  'citrus':['Applied AI','Business & commercialisation lead','Provincial First Prize'],
  'market':['Team lead','434 valid surveys','CP Cup Second Prize'],
  'climate':['Published · PLOS ONE (2025)','First-listed co-first author','Asia–Pacific MCM First Prize'],
  'aviation':['Competition research','Research writing lead','MathorCup Second Prize'],
  'nlp':['Applied NLP','Analysis & research writing lead','Independent reproduction'],
  'neural':['Granted patent','Co-inventor','Research contributor'],
  'ets':['Submitted','First-author manuscript','Ecological Economics'],
  'healthcare':['Published','Third author','Finance Research Letters (2024)']}
 def card(id,featured=False):
  p=by[id];image=('climate_figure.jpg' if id=='climate' else p.get('image',''))
  visual='<div class="project-visual"><img src="assets/'+E(image)+'" alt="'+E('Published forecasting figure' if id=='climate' else 'Conceptual study overview',quote=True)+'" loading="lazy"></div>' if featured and image else ''
  badgegroup='<div class="project-badges" aria-label="Status, role and outcomes">'+''.join('<span>'+E(x)+'</span>' for x in badges[id])+'</div>'
  return '<article class="project-card'+(' featured' if featured else ' supporting')+(' with-visual' if visual else '')+'" data-project="'+id+'"><div class="card-copy"><h3>'+E(p['title'])+'</h3>'+badgegroup+'<p class="desc">'+E(p['desc'])+'</p><p class="methods">'+E(p['methods'])+'</p><a class="project-cta" href="project-'+id+'.html">Research question, methods &amp; contribution <span aria-hidden="true" class="cta-arrow">↗</span></a></div>'+visual+'</article>'
 groups=[('business','AI for Business & FinTech',['credit','citrus','market'],'Corporate risk, customer insights and the translation of AI-enabled systems into decisions.'),('ml','AI & Machine Learning',['climate','aviation','nlp','neural'],'Forecasting, NLP, predictive risk analytics and interdisciplinary AI methods.'),('economics','Economics & Finance',['ets','healthcare'],'Empirical policy analysis, corporate capital allocation and economic efficiency.')]
 tabs='<div class="tab-bar" role="tablist" aria-label="Research direction">'+''.join('<button type="button" class="tab" role="tab" id="tab-'+key+'" data-filter="'+key+'" aria-controls="panel-'+key+'" aria-selected="'+str(i==0).lower()+'" tabindex="'+('0' if i==0 else '-1')+'">'+E(label)+' <span class="count">'+str(len(ids))+'</span></button>' for i,(key,label,ids,desc) in enumerate(groups))+'</div>'
 panels=''
 for i,(key,label,ids,desc) in enumerate(groups):
  panels+='<div role="tabpanel" class="research-panel" id="panel-'+key+'" aria-labelledby="tab-'+key+'"'+(' hidden' if i else '')+'><div class="filter-status" data-track="'+key+'"><div><strong>'+E(label)+'</strong><p>'+E(desc)+'</p></div><span class="group-count">'+str(len(ids))+' projects</span></div><div class="project-list">'+''.join(card(id,id in ['credit','climate','aviation','ets']) for id in ids)+'</div></div>'
 research='<section class="block white" id="research"><div class="wrap"><div class="section-top"><div><div class="kicker">Selected research · methods and outcomes</div><h2>Research &amp; project experience.</h2></div><p class="summary">Choose one direction to explore the selected projects. Open a study for its full research context, contributions and original materials.</p></div>'+tabs+panels+'<div class="link-row"><a class="inline-cta" href="research.html">View all18 projects &amp; complete contributions ↗</a></div></div></section>'
 a=home.index('<section class="block white" id="research">');b=home.index('<section class="block sage" id="methods">',a)
 home=home[:a]+research+'\n'+home[b:]
 # One additional-tools block: deduplicate the previous appended paragraph.
 a=home.index('<div class="full-tools">',home.index('id="methods"'));b=home.index('</section>',a)
 block='<div class="full-tools"><strong>Additional research &amp; working tools</strong><p>Transformers · CiteSpace · Vensim / system dynamics · Excel · Git/GitHub · LaTeX · NoteExpress · PowerPoint · Word · VS Code · Agents · MCP · API/RAG · Prompt engineering · LLM workflows.</p><p>Professional foundations: Junior Accounting Professional Qualification · National Computer Rank Examination Level 2. Languages: Mandarin Chinese (native), English (CET-6).</p></div></div></section>'
 home=home[:a]+block+home[b+len('</section>'):]
 # Only the homepage is curated; the complete Education page keeps all12undergraduate courses.
 a=home.index('<article class="school-card school-gou">');b=home.index('</article>',a)
 school=home[a:b];cs=school.index('<ul class="school-courses">');ce=school.index('</ul>',cs)
 li=re.findall(r'<li>.*?</li>',school[cs:ce],re.S)
 # Preserve quantitative and finance preparation while reducing12to8.
 keep={'Mathematics for Economics','Macroeconomics','Advanced Financial Management','Investments','Probability and Mathematical Statistics','Financial Markets','Linear Algebra','Microeconomics'}
 chosen=[x for x in li if any('<span>'+n+'</span>' in x for n in keep)]
 school=school[:cs]+'<ul class="school-courses">'+''.join(chosen)+school[ce:]
 school=school.replace('<h4>Courses &amp; grades</h4>','<h4>Selected courses &amp; grades</h4>')
 home=home[:a]+school+home[b:]
 pages['index.html']=home
 # A link must open the complete project, rather than just a summary anchor.
 for name,html in list(pages.items()):
  if not name.endswith('.html'):continue
  for p in projects:html=html.replace('href="research.html#'+p['id']+'"','href="project-'+p['id']+'.html"')
  pages[name]=html
 fragments=json.loads((root/'content/full-project-fragments.json').read_text())
 for p in projects:
  body='<section class="page-hero"><div class="wrap"><div class="detail-nav"><a href="index.html#research">← Selected research</a><a href="research.html">All projects</a></div><h1>'+E(p['title'])+'</h1><p>'+E(p['status'])+'</p></div></section><div class="wrap full-project" id="full-project" data-project="'+p['id']+'">'+fragments[p['id']]+'</div>'
  html=wrap(p['title'],body,page='project-'+p['id'])
  # Shared viewer and navigation are the same native components as the local homepage.
  viewer=re.search(r'<dialog class="media-dialog".*?</dialog>',pages['index.html']).group()
  html=html.replace('<script src="assets/site.js" defer></script>',viewer+'<script src="assets/site.js" defer></script><script src="assets/material-viewer.js" defer></script><script src="assets/full-project.js" defer></script>')
  html=html.replace('</head>','<link rel="stylesheet" href="assets/full-project.css"></head>')
  pages['project-'+p['id']+'.html']=html
 # Make the research page a usable overview; complete details are one click away.
 html=pages['research.html']
 for p in projects:
  marker='<section class="detail" id="'+p['id']+'">';a=html.find(marker)
  if a<0:continue
  b=html.index('</section>',a);section=html[a:b];pos=section.rfind('</div></div></div>')
  section=section[:pos]+'<div class="project-actions"><a class="btn btn-outline" href="project-'+p['id']+'.html">Complete project experience &amp; materials ↗</a></div>'+section[pos:]
  html=html[:a]+section+html[b:]
 pages['research.html']=html
