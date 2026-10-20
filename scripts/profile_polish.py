"""Scoped homepage refinement. User-supplied final copy is intentionally verbatim."""
from html import escape as E
import re

def apply(pages):
 s=pages['index.html']
 s=s.replace('<button type="button" class="btn btn-outline" data-cv>Academic CV ↗</button>', '<a class="btn btn-outline" href="assets/can-tan-academic-cv.pdf" target="_blank" rel="noopener noreferrer">Academic CV ↗</a>',1)
 s=s.replace('Academic CV is available in the online viewer.', 'Academic CV is available as a PDF.')
 s=s.replace('<h1>AI for Business &amp; FinTech, <span class="hilite">grounded in economics.</span></h1>', '<h1 class="profile-title"><span class="hero-heading-line">AI for Business &amp; FinTech,</span><span class="hero-heading-line hilite">grounded in economics.</span></h1>',1)
 s=re.sub(r'<p class="hero-lead">.*?</p>', '<p class="hero-lead">I am pursuing a master\'s degree in <strong>Applied Economics at Shandong University</strong>, admitted through China\'s <strong>exam-exempt postgraduate recommendation scheme</strong> after ranking <strong>first in my undergraduate school</strong> in the selection process.</p>',s,count=1)
 stats=[('1st','Undergraduate school-wide rank',"Exam-exempt master's selection"),('2','Peer-reviewed publications',''),('2','First-author manuscripts submitted',''),('90.91/100',"Master's average grade",'')]
 strip='<div class="proofline profile-stats" aria-label="Academic highlights"><div class="wrap">'
 for number,primary,secondary in stats:
  strip+='<div class="proof"><b>'+E(number)+'</b><div class="stat-labels"><span class="stat-primary">'+E(primary)+'</span>'+('<span class="stat-secondary">'+E(secondary)+'</span>' if secondary else '')+'</div></div>'
 strip+='</div></div>'
 a=s.index('<div class="proofline">');b=s.index('<section',a);s=s[:a]+strip+s[b:]
 cards=[('01 / RESEARCH CURIOSITY & LEARNING','Curiosity & independent learning','What draws me to research is the process of understanding why a method works and how an idea can be tested rigorously. It has gradually taken me from econometrics into LSTM forecasting, NLP and AI-assisted research workflows.',['Cross-disciplinary papers','Independent Python reproductions']),('02 / RIGOROUS EXECUTION','End-to-end research execution','I can take an empirical study from question formulation and data preparation through modelling, validation and manuscript writing. I pay close attention to detail and follow projects through to completion.',['Rank 1/151','30+ honours','Published and submitted research']),('03 / COLLABORATION & RESEARCH FIT','Collaboration across disciplines','My experience in field research, financial practice and interdisciplinary AI projects has taught me to work with people from different backgrounds. I value clear communication, feedback and dependable contributions to shared research tasks.',['434 valid surveys','AI-enabled projects','Research-community leadership'])]
 about='<section class="block profile-strengths" id="strengths"><div class="wrap"><div class="section-top"><div><div class="kicker">About me</div><h2>Three strengths I bring to a research group.</h2></div></div><div class="strengths">'
 for cat,title,body,outcomes in cards:
  about+='<article class="strength"><div class="num">'+E(cat)+'</div><h3>'+E(title)+'</h3><p class="strength-body">'+E(body)+'</p><footer class="strength-outcomes"><h4>Selected outcomes</h4><div class="outcome-items">'+''.join('<span>'+E(x)+'</span>' for x in outcomes)+'</div></footer></article>'
 about+='</div></div></section>'
 a=s.index('<section class="block" id="strengths">');b=s.index('</section>',a)+10;s=s[:a]+about+s[b:]
 # Preserve the five existing destination URLs, make each card a single accessible target.
 a=s.index('id="publications"');b=s.index('</section>',a)
 block=s[a:b]
 def publication(m):
  html=m.group();link=re.search(r'<a([^>]*?)href="([^"]+)"([^>]*)>(.*?)</a>',html,re.S)
  if not link:return html
  href=link.group(2);attrs=link.group(1)+link.group(3);label=link.group(4)
  html=html[:link.start()]+'<span class="publication-action">'+label+'</span>'+html[link.end():]
  html=re.sub(r'^<article class="([^"]+)"',lambda x:'<a class="'+x.group(1)+' publication-card" href="'+href+'"'+attrs,html,count=1)
  return re.sub(r'</article>$','</a>',html)
 block=re.sub(r'<article class="pub(?: submitted)?">.*?</article>',publication,block,flags=re.S)
 s=s[:a]+block+s[b:]
 # Bound the new styling to this page so shared assets do not restyle other routes.
 s=s.replace('<body>','<body class="profile-refined">')
 pages['index.html']=s
