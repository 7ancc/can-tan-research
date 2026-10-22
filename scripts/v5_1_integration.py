"""V5.1 integration into the existing generator, never the concept-preview document.

The established page shell, routes, media viewer, school cards and font tokens
remain authoritative. This module has no dependency on the external handoff.
"""
from html import escape as E
import re


STRENGTHS = [
    ('01 / CURIOSITY & LEARNING', 'Curiosity beyond disciplines',
     'I enjoy learning new methods when they offer a better way to answer a research question. My curiosity has led me from econometrics into NLP and time-series forecasting.',
     [('project-nlp.html', 'BERT & NLP reproduction'), ('project-climate.html', 'LSTM–ARIMA research')]),
    ('02 / RIGOUR & OWNERSHIP', 'Careful research, from start to finish',
     'I care about the details behind a result, from data quality and model assumptions to validation and interpretation. I enjoy taking responsibility for a study and seeing it through to manuscript writing.',
     [('project-credit.html', 'KMV–EDF & DID/DDD'), ('#publications', '2 first-author manuscripts submitted')]),
    ('03 / COLLABORATION & INITIATIVE', 'Learning and contributing with others',
     'Working with people from different backgrounds has taught me to listen carefully, communicate clearly and take initiative when a team needs support.',
     [('project-market.html', 'Led a five-member research team'), ('project-market.html', '434 valid surveys')]),
]

CONTRIBUTIONS = [
    ('Empirical & Causal Analysis',
     'Panel data preparation, DID/DDD estimation, robustness checks and result interpretation.',
     'KMV–EDF · Corporate default risk', 'project-credit.html', 'View research'),
    ('Machine Learning & NLP',
     'Text processing, predictive modelling, model evaluation and reproduction of selected ML workflows.',
     'BERT–BiLSTM–CNN · NLP research', 'project-nlp.html', 'View research'),
    ('Research Development',
     'Literature review, research visualisation, documentation and manuscript preparation.',
     'Published and first-author research', '#publications', 'View publications'),
]

CORE_METHODS = [
    ('Machine Learning & NLP', 'BERT · BiLSTM · CNN', 'XGBoost', 'Python · PyTorch',
     'Text classification, sentiment analysis, predictive modelling and model evaluation.',
     'project-nlp.html', 'Consumer review intelligence'),
    ('Causal Inference & Econometrics', 'DID · DDD · DDML', 'PSM-DID · Panel Data', 'Stata',
     'Policy evaluation, firm-level empirical analysis and robustness checks.',
     'project-credit.html', 'Corporate default-risk research'),
]

COMPLEMENTARY_METHODS = [
    ('Forecasting & Risk Analytics', 'LSTM · ARIMA · KMV–EDF',
     'Time-series forecasting and corporate risk measurement.',
     [('project-climate.html', 'Climate forecasting'), ('project-credit.html', 'Corporate default risk')]),
    ('Survey & Statistical Research', 'SPSS · ACSI · SO-PMI · Jieba',
     'Field research, satisfaction evaluation and text mining.',
     [('project-market.html', '434-response field study')]),
]

PROJECT_SUMMARIES = {
    'credit': "Developed a KMV-based measure of corporate default risk and evaluated China's 2018 environmental fee-to-tax reform with firm-level panel data. Extended the analysis from DID to DDD to examine financial restructuring and market-clearing mechanisms.",
    'citrus': 'Translated an AI-based pest recognition and early-warning system into product concepts, customer research, financial models and commercial strategy.',
    'market': 'Led a consumer-satisfaction study combining field research, 434 valid questionnaires and online review analysis to generate practical market recommendations.',
    'climate': 'Analysed global temperature records from 1880 to 2022 with neural and statistical time-series models, supported by correlation analysis of long-term climate dynamics.',
    'aviation': 'Explored flight-operation risks using anomaly detection, time-series forecasting and XGBoost classification to support early-warning analysis.',
    # Keep the original contribution boundary: analysis/writing and reproduction,
    # rather than imply independent development of the entire team NLP model.
    'nlp': 'Analysed review classification, sentiment, keywords and human–machine text detection, with research writing and independent reproduction of selected Transformer workflows.',
    'neural': 'Contributed to literature synthesis, mathematical-method screening and research communication for neural-dynamics work; co-inventor of a hyperspectral-detection patent.',
    'ets': 'Investigated whether emissions trading affects long-term capital allocation in pollution-intensive firms, drawing on firm-level policy evaluation and event-study evidence.',
    'healthcare': 'Contributed to a national study of healthcare input–output efficiency using DEA analysis and Origin visualisations.',
}


def heading(kicker, title, summary=''):
    summary_html = (''.join('<span class="summary-line">' + E(line) + '</span>' for line in summary)
                    if isinstance(summary, (tuple, list)) else E(summary))
    return ('<div class="section-top"><div><div class="kicker">' + E(kicker)
            + '</div><h2>' + E(title) + '</h2></div>'
            + ('<p class="summary">' + summary_html + '</p>' if summary else '') + '</div>')


def section(id, tone, content):
    return '<section class="block v51-section ' + tone + '" id="' + id + '"><div class="wrap">' + content + '</div></section>'


def block(html, id):
    start = html.rfind('<section', 0, html.index('id="' + id + '"'))
    end = html.index('</section>', start) + len('</section>')
    return html[start:end]


def apply(pages):
    # The recommendation distinction belongs to the undergraduate school.
    # All other card markup, course values and honours stay byte-identical.
    for name in ('index.html', 'education.html'):
        html = pages[name]
        start = html.index('<article class="school-card school-sdu">')
        end = html.index('</article>', start)
        sdu = html[start:end]
        note = re.search(r'<p class="admission-note">.*?</p>', sdu).group()
        html = html[:start] + sdu.replace(note, '') + html[end:]
        start = html.index('<article class="school-card school-gou">')
        end = html.index('</article>', start)
        gou = html[start:end]
        pos = gou.index('<div class="school-detail">')
        gou = gou[:pos] + note + '\n ' + gou[pos:]
        pages[name] = re.sub(r'[ \t]+\n', '\n', html[:start] + gou + html[end:])

    html = pages['index.html']
    hero = block(html, 'about')
    hero = re.sub(r'<p class="hero-lead">.*?</p>',
        '<p class="hero-lead">I am a master\'s student in <strong>Applied Economics at Shandong University</strong>, admitted through China\'s exam-exempt postgraduate recommendation scheme after ranking <strong>first in my undergraduate school\'s selection</strong>.</p>', hero)
    hero = re.sub(r'<p class="hero-note">.*?</p>',
        '<p class="hero-note">My research experience spans <strong class="inline-focus">causal inference for corporate risk, NLP-based text analysis and time-series forecasting</strong>. I am particularly interested in how AI and information credibility influence business and financial decisions.</p>', hero)

    start = html.index('<div class="proofline profile-stats"')
    end = html.index('<section', start)
    stats = html[start:end].replace('<b>2</b><div class="stat-labels"><span class="stat-primary">Peer-reviewed publications', '<b>3</b><div class="stat-labels"><span class="stat-primary">Peer-reviewed publications')

    about = heading('About me', 'What drives my research.')
    about += '<div class="v51-strength-grid">' + ''.join(
        '<article class="v51-strength"><div class="num">' + E(cat) + '</div><h3>' + E(title)
        + '</h3><p>' + E(body) + '</p><footer class="v51-practice"><h4>In practice</h4><div class="practice-links">'
        + ''.join('<a href="' + href + '">' + E(label) + '</a>' for href, label in links)
        + '</div></footer></article>' for cat, title, body, links in STRENGTHS) + '</div>'

    # Reuse real publication cards and their destinations from the existing site.
    old_publications = block(html, 'publications')
    cards = re.findall(r'<a class="pub[^>]*>.*?</a>', old_publications, re.S)
    assert len(cards) == 5
    cards = [c if 'target="_blank"' in c else c.replace('<a ', '<a target="_blank" rel="noopener noreferrer" ', 1) for c in cards]
    published = [c for c in cards if 'pub submitted' not in c]
    submitted = [c for c in cards if 'pub submitted' in c]
    assert len(published) == 3 and len(submitted) == 2
    published[2] = published[2].replace('Tan Can and Wen Mingming.', 'Tan Can (first author); Wen Mingming (second and corresponding author).')
    publications = heading('Research outputs', 'Publications & manuscripts.')
    for label, css, items in [('Published Research', 'v51-published', published), ('Submitted Manuscripts', 'v51-submitted', submitted)]:
        # Keep link-adjacent helpers injected by browser extensions inside a slot,
        # rather than allowing them to become additional publication grid items.
        slots = ''.join('<div class="v51-publication-slot">' + card + '</div>' for card in items)
        publications += '<div class="v51-publication-group ' + css + '"><div class="v51-split-head"><h3>' + label + '</h3><span class="count">' + str(len(items)) + '</span></div><div class="pub-grid">' + slots + '</div></div>'

    research = block(html, 'research')
    research = re.sub(r'(<p class="summary">).*?(</p>)',
        r'\1<span class="summary-line">Choose a research direction.</span><span class="summary-line">Explore methods and personal contributions.</span>\2', research, count=1)
    research = research.replace('View all18 projects &amp; complete contributions ↗', 'View all 18 projects &amp; contributions ↗')
    for id, summary in PROJECT_SUMMARIES.items():
        pattern = r'(<article[^>]+data-project="' + id + r'".*?<p class="desc">).*?(</p>)'
        research = re.sub(pattern, lambda m: m[1] + E(summary) + m[2], research, flags=re.S)
    research = research.replace('project-card featured" data-project="aviation"', 'project-card featured v51-horizontal" data-project="aviation"')
    research = research.replace('project-card supporting" data-project="healthcare"', 'project-card supporting v51-horizontal" data-project="healthcare"')

    contribution = heading('Research contribution', 'How I can contribute.')
    contribution += '<div class="v51-contribution-grid">' + ''.join(
        '<article class="v51-contribution"><span class="contrib-number">0' + str(i) + '</span><h3>' + E(title) + '</h3><p>' + E(body)
        + '</p><footer class="v51-relevant"><h4>Relevant experience</h4><p>' + E(proof)
        + '</p><a class="inline-cta" href="' + href + '">' + E(label) + ' ↗</a></footer></article>'
        for i, (title, body, proof, href, label) in enumerate(CONTRIBUTIONS, 1)) + '</div>'
    contribution += '<p class="v51-contrib-contact">Interested in discussing potential research collaboration? <a class="inline-cta" href="#contact">Get in touch →</a></p>'

    methods = heading('Technical preparation', 'Research methods & skills.',
        'Core research capabilities supported by selected projects.')
    methods += '<div class="v51-core-grid">'
    for i, (title, primary, secondary, implementation, task, href, label) in enumerate(CORE_METHODS, 1):
        methods += '<article class="v51-method v51-core"><div class="capability-label">0' + str(i) + ' / Core capability</div><h3>' + E(title) + '</h3><div class="v51-key-methods"><h4>Key methods</h4><p class="primary-methods">' + E(primary) + '</p><p class="secondary-methods">' + E(secondary) + '</p></div><div class="v51-implementation"><h4>Implementation</h4><p>' + E(implementation) + '</p></div><p class="method-task">' + E(task) + '</p><div class="method-links"><a href="' + href + '">' + E(label) + ' ↗</a></div></article>'
    methods += '</div><h3 class="v51-subheading">Complementary research capabilities</h3><div class="v51-complement-grid">'
    for i, (title, tools, task, links) in enumerate(COMPLEMENTARY_METHODS, 3):
        methods += '<article class="v51-method v51-complement"><h3><span class="complement-number">0' + str(i) + '</span>' + E(title) + '</h3><p class="tools">' + E(tools) + '</p><p class="method-task">' + E(task) + '</p><div class="method-links">' + ''.join('<a href="' + href + '">' + E(label) + ' ↗</a>' for href, label in links) + '</div></article>'
    tool_groups = [
        ('Academic Workflow', 'LaTeX · NoteExpress · CiteSpace · Vensim', '<path d="M4 4h7a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4zM14 7a3 3 0 0 1 3-3h3v14h-2a4 4 0 0 0-4 3"/>'),
        ('Development & Data', 'Git/GitHub · VS Code · Excel', '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M8 21h8m-4-4v4m-3-9-3-2 3-2m6 0 3 2-3 2"/>'),
        ('AI & Automation', 'LLM Workflows · API/RAG · Agents · MCP', '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 2v5m4-5v5m-4 10v5m4-5v5M2 10h5m-5 4h5m10-4h5m-5 4h5"/>'),
    ]
    methods += '</div><div class="v51-additional-tools"><h3>Additional research tools</h3><div class="v51-tool-grid">'
    for i, (title, tools, icon) in enumerate(tool_groups):
        methods += '<article class="v51-tool"><h4><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">' + icon + '</svg>' + E(title) + '</h4><p>' + E(tools) + '</p>' + ('<small>Additional familiarity</small>' if i == 2 else '') + '</article>'
    methods += '</div></div><div class="v51-credentials"><div><h3>Languages</h3><ul><li>Mandarin Chinese · Native</li><li>English · CET-6</li></ul></div><div><h3>Professional qualifications</h3><ul><li>Junior Accounting Professional Qualification</li><li>National Computer Rank Examination · Level 2</li></ul></div></div>'

    education = block(html, 'education')

    awards = heading('Academic recognition', 'Selected Honours & Awards.',
        ('Four selected distinctions, with full records', 'available in the honours archive.'))
    distinctions = [
        ('National Scholarship', 'Academic excellence', 'capabilities/national-scholarship.webp'),
        ('Top 10 Outstanding Student', 'University distinction', 'capabilities/top-ten-student.webp'),
        ('Asia–Pacific MCM First Prize', 'Mathematical modelling', None),
        ('National Silver Award', 'China International College Students’ Innovation Competition', 'evidence/venture-national-silver.webp'),
    ]
    # Simple authored line icons follow the approved reference without loading a library.
    icons = ['<path d="M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/>', '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>', '<path d="m12 3 9 9-9 9-9-9z"/>', '<path d="M12 3v18M3 12h18m-15-6 12 12M6 18 18 6"/>']
    awards += '<div class="v51-awards-grid">'
    for (title, note, image), icon in zip(distinctions, icons):
        awards += '<a class="v51-award" href="achievements.html"><span class="award-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">' + icon + '</svg></span><h3>' + E(title) + '</h3><p>' + E(note) + '</p></a>'
    awards += '</div><div class="v51-awards-footer"><a class="inline-cta" href="achievements.html">All honours &amp; original records ↗</a></div>'

    experience = heading('Beyond publications', 'Additional experience.',
        ('Selected practical experience, with detailed contributions', 'and supporting materials on the Experience page.'))
    experiences = [
        ('FIELD RESEARCH', 'On-the-ground research', 'Consumer interviews, 434 questionnaires, field validation and stakeholder communication.', 'fieldwork'),
        ('FINANCE & ANALYTICS', 'Financial decision contexts', 'IPO due diligence, transaction verification, corporate financial analysis and evidence reporting.', 'practice'),
        ('INNOVATION & TEAMWORK', 'Cross-disciplinary collaboration', 'Intelligent detection, agritech commercialisation, patent research and academic initiatives.', 'interdisciplinary'),
    ]
    experience += '<div class="v51-experience-grid">' + ''.join(
        '<a class="v51-experience" href="experience.html#' + id + '"><span class="eyebrow">' + E(cat) + '</span><h3>' + E(title) + '</h3><p>' + E(body) + '</p><span class="inline-cta">Explore experience ↗</span></a>' for cat, title, body, id in experiences) + '</div>'

    contact = '''<div class="v51-contact-panel"><div><div class="kicker">Visiting Research Opportunities</div><h2>Interested in collaborative research.</h2><p>I am seeking opportunities to join a research group as a visiting master's student, particularly in AI for Business, FinTech and empirical finance. I would welcome the chance to learn from ongoing work and contribute through empirical analysis, modelling and interdisciplinary collaboration.</p><p class="availability-note">MSc Applied Economics · Shandong University · Expected graduation: June 2028</p></div><div class="v51-contact-info"><a class="btn btn-main" href="mailto:tancan872@gmail.com?subject=Visiting%20Research%20Enquiry">Discuss visiting research ↗</a><a href="assets/can-tan-academic-cv.pdf" target="_blank" rel="noopener noreferrer">Academic CV ↗</a><a href="https://scholar.google.com/citations?view_op=list_works&amp;hl=zh-CN&amp;user=nFn48qkAAAAJ" target="_blank" rel="noopener noreferrer">Google Scholar ↗</a><a href="https://orcid.org/0009-0008-6053-2371" target="_blank" rel="noopener noreferrer">ORCID ↗</a><a href="mailto:tancan872@gmail.com">tancan872@gmail.com ↗</a></div></div>'''

    main = '\n'.join([
        hero, stats, section('strengths', 'white', about),
        section('publications', 'beige', publications), research,
        section('contributions', 'beige', contribution),
        section('methods', 'white', methods), education,
        section('awards', 'white', awards),
        section('experience', 'beige', experience),
        section('contact', 'white', contact),
    ])
    html = re.sub(r'(<main id="main">).*?(</main>)', lambda m: m[1] + main + m[2], html, flags=re.S)
    html = html.replace('<body class="profile-refined">', '<body class="profile-refined v51">')
    html = html.replace('</head>', '<link rel="stylesheet" href="assets/v5-1.css"></head>')
    # Retain every prior navigation destination; add the two new homepage sections.
    html = html.replace('<a href="index.html#methods">Methods</a>', '<a href="index.html#contributions">Contribution</a><a href="index.html#methods">Methods</a>')
    html = html.replace('<a href="index.html#education">Education</a>', '<a href="index.html#education">Education</a><a href="index.html#awards">Awards</a>')
    html = html.replace('Can Tan — visiting research portfolio in AI for Business, FinTech, machine learning and applied economics.', 'Can Tan — Applied Economics master’s student researching AI for Business, FinTech, NLP, forecasting and corporate default risk. Three published papers and two submitted first-author manuscripts.')
    pages['index.html'] = html
