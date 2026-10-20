"""Local-only merge. Pinned V4 layout stays authoritative; disputed fields stay at V4 values."""
import json,re
from html import escape as E

def apply(pages,projects,wrap,header,footer,root):
 original=json.loads((root/'content/original-content.json').read_text())
 records=json.loads((root/'content/research-records.json').read_text())
 media=json.loads((root/'content/evidence.json').read_text())
 by={p['id']:p for p in projects}
 aliases={'environmental-tax':'credit','consumer':'market','patient-capital':'ets','neural-dynamics':'neural'}
 def path(v):return 'assets/materials/'+v.removeprefix('assets/').lstrip('/')
 def gallery(p):
  entries=[{'path':path(f.get('image',f.get('path',''))),'title':f.get('title',p['title']),'caption':f.get('subtitle',f.get('caption',''))} for f in p.get('figures',[]) if f.get('image') or f.get('path')]
  if not entries:return ''
  return '<button class="inline-cta media-trigger" type="button" data-gallery="'+E(json.dumps(entries),quote=True)+'">Original figures &amp; project records ↗</button>'
 def contribution(p):
  return '<div class="card-contributions"><h4>My contribution</h4><ul>'+''.join('<li>'+E(x)+'</li>' for x in p.get('contrib',[]))+'</ul></div>'
 # All independent projects are visible without JavaScript or direction filters.
 home=pages['index.html'].replace('FIRST-LISTED EQUAL CONTRIBUTOR','FIRST-LISTED CO-FIRST AUTHOR')
 for p in projects:
  marker='<a href="research.html#'+p['id']+'">Research question, methods &amp; contribution ↗</a>'
  # Existing escaping omits &amp; in the literal anchor label.
  marker2='<a href="research.html#'+p['id']+'">Research question, methods & contribution ↗</a>'
  for m in [marker,marker2]:
   if m in home:home=home.replace(m,contribution(p)+'<div class="project-actions">'+m+gallery(p)+'</div>')
 pub='<article class="pub"><div class="state">PUBLISHED · 2024 · FIRST AUTHOR</div><h3>Research trends in transformational leadership in China</h3><p>国内变革型领导的热点演变与热点领域 · Tan Can and Wen Mingming. <i>Science Technology and Industry</i>, 24(20), 287–292. English title is a translation of the Chinese article title.</p><a href="assets/materials/papers/transformational-leadership.pdf">Read published article ↗</a></article>'
 # Append to existing publication grid without moving the section.
 start=home.index('id="publications"'); end=home.index('</section>',start)
 section=home[start:end]; pos=section.rfind('</div></div>');section=section[:pos]+pub+section[pos:];home=home[:start]+section+home[end:]
 tools='<p class="source-tools">'+E('Research & communication: Origin · LaTeX · NoteExpress · Excel · PowerPoint · Word · Data Visualisation · Research Writing. AI-assisted development: AI IDEs · VS Code · Agents · MCP · API · RAG · Git/GitHub · Prompt Engineering · LLM Workflows. Professional qualification: Junior Accounting Professional Qualification · National Computer Rank Examination Level 2. Languages: Mandarin Chinese (native) · English (CET-6).')+'</p>'
 home=home.replace('</div></div></section>\n<section class="block academic-block"',tools+'</div></div></section>\n<section class="block academic-block"')
 home=home.replace('<a class="btn btn-outline" href="#education">Academic background ↗</a>','<a class="btn btn-outline" href="#education">Academic background ↗</a><button type="button" class="btn btn-outline" data-cv>Academic CV ↗</button>')
 home=home.replace('Academic CV available with application email.','Academic CV is available in the online viewer.')
 # Restore earlier explicit personal-profile preference without changing layout.
 home=home.replace('Prospective visiting research / exchange student','AI, finance &amp; empirical research')
 home=home.replace('?subject=Visiting%20Research%20Opportunity','?subject=Research%20Discussion')
 home=home.replace('<div class="link-row"><a class="inline-cta" href="experience.html">Explore additional experience &amp; achievements ↗</a></div>','<div class="link-row"><a class="inline-cta" href="experience.html">Explore additional experience &amp; achievements ↗</a><a class="inline-cta" href="achievements.html">All honours &amp; original records ↗</a></div>')
 pages['index.html']=home
 # Detail body is still the V4 detail topology. Add evidence actions, preserving all V4 disputed fields.
 detail=pages['research.html']
 for p in projects:
  start=detail.find('<section class="detail" id="'+p['id']+'"')
  if start<0:continue
  end=detail.index('</section>',start)
  section=detail[start:end]; pos=section.rfind('</div></div></div>')
  section=section[:pos]+'<div class="project-actions">'+gallery(p)+'</div>'+section[pos:]
  detail=detail[:start]+section+detail[end:]
 detail=detail.replace('Selected research &amp; project details.','Research &amp; project details.')
 detail=detail.replace('<a href="#credit">Business &amp; FinTech</a><a href="#climate">AI &amp; ML</a><a href="#ets">Economics &amp; Finance</a>','<a href="#credit">Credit risk</a><a href="#nlp">NLP</a><a href="#climate">Forecasting</a><a href="#ets">Economics &amp; finance</a><a href="#neural">Applied projects</a><a href="records.html">Complete research records</a>')
 pages['research.html']=detail
 # Full finance information, chronological ordering, baseline typography and section placement.
 finance=''
 for x in original['experiences']:
  finance+='<article class="subsection"><h3>'+E(x['company'])+'</h3><p class="card-role">'+E(x['period']+' · '+x['role']+' · '+x['location'])+'</p>'+''.join('<p>'+E(s)+'</p>' for s in x['details'])+'</article>'
 exp=pages['experience.html'];a=exp.index('<section class="block beige" id="practice">');b=exp.index('</section>',a)+len('</section>')
 exp=exp[:a]+'<section class="block beige" id="practice"><div class="wrap"><div class="kicker">Finance practice</div><h2>Data-intensive work in financial settings.</h2>'+finance+'</div></section>'+exp[b:]
 extra=original['extras']['leadership.tsx'];lead='<article class="subsection"><h3>Graduate student leadership</h3><p>Shandong University · Campus Graduate Student Union</p><p>Volunteer, Academic Exchange Department → President, Campus Graduate Student Union.</p><p>Class role: Organisation Committee Member.</p></article>'
 for x in extra['systems']:lead+='<article class="subsection"><h3>'+E(x['title'])+'</h3><p>'+E(x['text'])+'</p><p class="methods">'+E(' · '.join(x['activities']))+'</p></article>'
 def plain(value):
  if isinstance(value,str):return value
  if isinstance(value,list):return ''.join(plain(v) for v in value)
  if isinstance(value,dict):return plain(value.get('props',{}).get('children',''))
  return ''
 for group in ['graduateWork','undergraduateWork']:
  for x in extra[group]:
   lead+='<article class="subsection"><h3>'+E(x['title'])+'</h3><p>'+E(plain(x['body']))+'</p>'
   if x.get('facts'):lead+='<p>'+E(x['facts'])+'</p>'
   lead+='</article>'
 for label,title,text in extra['classContributions']:lead+='<article class="subsection"><h3>'+E(title)+'</h3><p>'+E(text)+'</p></article>'
 idx=exp.index('<div class="callout">',exp.index('id="leadership"'));exp=exp[:idx]+lead+exp[idx:]
 exp=exp.replace('Visiting research opportunity ↗','Research discussions ↗')
 exp=exp.replace('Fieldwork photographs are intentionally kept off the main research homepage to preserve focus. Selected original documentation may be provided upon request.','Original fieldwork photographs and project records are available with their corresponding studies.')
 exp=exp.replace('<a class="inline-cta" href="research.html#market">Research methods and contribution ↗</a>','<a class="inline-cta" href="research.html#market">Research methods and contribution ↗</a>'+gallery(by['market']))
 exp=exp.replace('<a class="inline-cta" href="research.html#citrus">Research-to-market contribution ↗</a>','<a class="inline-cta" href="research.html#citrus">Research-to-market contribution ↗</a>'+gallery(by['citrus']))
 exp=exp.replace('Further materials on request ↗','Full venture record ↗').replace('href="mailto:tancan872@gmail.com?subject=Further%20Portfolio%20Materials"','href="research.html#venture"')
 pages['experience.html']=exp
 # Independent detailed records retain all22 source records, including umbrella studies.
 record_body='<section class="page-hero"><div class="wrap"><h1>Research records.</h1><p>Full project records and research development, with links to original materials.</p><div class="detail-nav"><a href="research.html">Research overview</a><a href="achievements.html">Honours &amp; materials</a></div></div></section>'
 for i,r in enumerate(records,1):
  id=r['id']; pid=aliases.get(id,id);p=by.get(pid)
  # Pending claims are deliberately not promoted from source to the new visible profile.
  role=p['role'] if p else r['role'];result=p['result'] if p else r['result'];status=p['status'] if p else r['status']
  contributions=p['contrib'] if p and pid in ['climate','ets','aviation'] else [x['text'] for x in r.get('contributions',[])]
  figures={'title':r['title'],'figures':r.get('evidence',[])}
  record_body+='<section class="detail" id="'+E(id)+'"><div class="wrap"><p class="card-status">'+E(status)+'</p><h2>'+E(r['title'])+'</h2><p class="card-role">'+E(role)+'</p><p class="detail-summary">'+E(r['summary'])+'</p><div class="full-tools"><strong>Methods</strong><p>'+E(r['methods'])+'</p><p>'+E(result)+'</p></div><h3>Research contributions</h3><ul>'+''.join('<li>'+E(x)+'</li>' for x in contributions)+'</ul>'+''.join('<p>'+E(x)+'</p>' for x in r.get('notes',[]))+gallery(figures)+'</div></section>'
 pages['records.html']=wrap('Research Records',record_body,page='records')
 #75recognitions: exact title, year, level, subtitle and source image. Historical GPA keeps its dated caption.
 honours=''
 for r in original['recognitions']:
  ref=path(r['image'])
  honours+='<article class="recognition-record" data-record data-category="'+E(r['category'],quote=True)+'"><p class="card-status">'+E(r['year']+' · '+r['level']+' · '+r['category'])+'</p><h3>'+E(r['title'])+'</h3><p>'+E(r['subtitle'])+'</p><button class="inline-cta media-trigger" type="button" data-media="'+E(ref,quote=True)+'" data-title="'+E(r['title'],quote=True)+'" data-caption="'+E(r['subtitle'],quote=True)+'">View original record ↗</button></article>'
 cats=sorted({r['category'] for r in original['recognitions']})
 controls='<div class="archive-controls"><label>Search honours<input type="search" data-search placeholder="Title, year or distinction"></label><label>Category<select data-category><option value="">All categories</option>'+''.join('<option>'+E(c)+'</option>' for c in cats)+'</select></label><p role="status" aria-live="polite" data-count>75 records</p><button type="button" class="tab" data-clear>Clear search</button></div>'
 body='<section class="page-hero"><div class="wrap"><h1>Honours &amp; achievements.</h1><p>The complete record of academic, research, innovation and professional recognition.</p><div class="detail-nav"><a href="experience.html">Experience</a><a href="materials.html">Original materials</a><a href="records.html">Complete research records</a></div></div></section><section class="block"><div class="wrap">'+controls+'<p data-empty hidden>No matching records. Clear the search to view all honours.</p><div class="recognition-list">'+honours+'</div></div></section>'
 pages['achievements.html']=wrap('Honours & Achievements',body,page='achievements')
 materials=''
 for m in media:
  materials+='<article class="material-record" data-record data-category="'+E(m['group'],quote=True)+'"><div><h3>'+E(m['title'])+'</h3><p>'+E(m['subtitle'])+'</p><p class="small">'+E(m['group']+' · '+m['type'].upper())+'</p></div><button class="inline-cta media-trigger" type="button" data-media="'+E(path(m['path']),quote=True)+'" data-title="'+E(m['title'],quote=True)+'" data-caption="'+E(m['subtitle'],quote=True)+'">Open material ↗</button></article>'
 groups=sorted({m['group'] for m in media})
 control=controls.replace('Search honours','Search materials').replace('75 records','520 records').replace('Title, year or distinction','Title or project').replace(''.join('<option>'+E(c)+'</option>' for c in cats),''.join('<option>'+E(g)+'</option>' for g in groups))
 pages['materials.html']=wrap('Original Materials','<section class="page-hero"><div class="wrap"><h1>Original materials.</h1><p>Original figures, photographs, papers and project documentation.</p><div class="detail-nav"><a href="achievements.html">Honours &amp; achievements</a><a href="research.html">Research &amp; projects</a></div></div></section><section class="block"><div class="wrap">'+control+'<p data-empty hidden>No matching materials. Clear the search to view all records.</p>'+materials+'</div></section>',page='materials')
 # Strengths retain the complete user-owned source text on a detail page without overcrowding the homepage.
 strengths='<section class="page-hero"><div class="wrap"><h1>Research approach &amp; leadership.</h1><div class="detail-nav"><a href="index.html#strengths">Research profile</a><a href="experience.html#leadership">Academic leadership</a></div></div></section>'
 for x in original['strengths']:
  strengths+='<section class="detail"><div class="wrap"><h2>'+E(x['title'])+'</h2>'+''.join('<p>'+E(text)+'</p>' for text in x['detail'])+'</div></section>'
 strengths=strengths.replace('National Silver Award in the “Internet+” Innovation and Entrepreneurship Competition','National Silver Award in the “Internet+” Innovation and Entrepreneurship Competition')
 pages['approach.html']=wrap('Research Approach & Leadership',strengths,page='approach')
 pages['index.html']=pages['index.html'].replace('Evidence: 434 valid surveys · AI-enabled projects · research-community leadership</div>','Evidence: 434 valid surveys · AI-enabled projects · research-community leadership</div><p class="strength-more"><a class="inline-cta" href="approach.html">Research approach &amp; full experience ↗</a></p>')
 # Archive source text retained verbatim as a downloadable provenance input, not rewritten as factual claims.
 # Accessible native media viewer in the same V4 palette.
 viewer='<dialog class="media-dialog" id="media-dialog" aria-labelledby="media-title"><header><h2 id="media-title">Original material</h2><button type="button" class="close-dialog">Close ×</button></header><div class="media-content"></div><p class="media-caption"></p><div class="gallery-controls"><button type="button" data-prev>Previous</button><span data-position></span><button type="button" data-next>Next</button></div></dialog>'
 for name,html in list(pages.items()):
  if not name.endswith('.html'):continue
  html=html.replace('<script src="assets/site.js" defer></script>',viewer+'<script src="assets/site.js" defer></script><script src="assets/material-viewer.js" defer></script>')
  html=html.replace('<a href="experience.html">Additional experience</a>','<a href="experience.html">Additional experience</a> · <a href="achievements.html">Honours &amp; records</a>')
  html=html.replace('across nine projects','across eighteen projects')
  pages[name]=html
