"use client";

import { useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import type { Evidence, Project } from "./project-content";
import type { ResearchDocument } from "./research-document-viewer";
import { consumerRequest } from "./material-access";

const asset = (name: string) => `assets/materials/consumer/${name}.webp?v=20261007-refined`;
export const consumerDocuments: ResearchDocument[] = [
  { id: "consumer-report", title: "Research Report", kind: "105-page report · 35 selected pages", requestHref: consumerRequest, excerpts: [1, 2, 3, 4, 5, 6, 11, 12, 14, 16, 21, 24, 26, 31, 33, 34, 35, 36, 38, 39, 40, 41, 54, 55, 56, 58, 60, 65, 70, 76, 83, 97, 99, 101, 103].map(page => ({ image: `assets/materials/consumer/previews/report-${String(page).padStart(3, "0")}.webp?v=20261007-refined`, label: `Original report · PDF page ${page}` })) },
  { id: "consumer-deck", title: "Competition Deck", kind: "52-slide presentation · 18 selected slides", requestHref: consumerRequest, excerpts: [1, 2, 3, 6, 7, 8, 12, 18, 24, 28, 31, 35, 38, 42, 45, 48, 49, 51].map(page => ({ image: `assets/materials/consumer/previews/deck-${String(page).padStart(3, "0")}.webp?v=20261007-refined`, label: `Original presentation · Slide ${page}` })) },
  { id: "consumer-questionnaire", title: "Survey Instrument", kind: "Consumer satisfaction questionnaire · 4 selected excerpts", requestHref: consumerRequest, excerpts: [1, 4, 7, 10].map(page => ({image: `assets/materials/consumer/previews/questionnaire-${String(page).padStart(3, "0")}.webp?v=20261007-refined`, label: `Questionnaire · Selected page ${page}`})) },
];
const chapters = [["challenge", "Overview"], ["design", "Method"], ["analysis", "Analysis"], ["findings", "Findings"], ["strategy", "Strategy"], ["evidence", "Evidence"]];
const roles = [
  ["Research Design", "Defined the research framework, coordinated a five-member team, and helped structure the consumer-satisfaction questionnaire and research workflow."],
  ["Field Research", "Coordinated online and offline survey collection and on-site research in Zhanjiang, covering recreational-fishery attractions including Jinshawan and Techeng Island."],
  ["Analytical Integration", "Integrated questionnaire analysis, online-review text analytics and statistical modeling into one coherent consumer-insight framework."],
  ["Insight & Delivery", "Synthesized findings into strategic recommendations and led the production of the final research report and competition presentation."],
];
const steps = [
  { label: "Literature", title: "Literature Mapping", tools: "CiteSpace · Web of Science", text: "Mapped research trends and keyword clusters in the recreational-fisheries literature to establish the analytical context.", metric: "1,966", caption: "Publications mapped · 2013–2023" },
  { label: "Survey Design", title: "Survey Design", tools: "ACSI · Likert Scale · Sampling Design", text: "Designed an ACSI-informed consumer-satisfaction framework using five-point Likert scales and multi-level indicators covering expectations, perceived quality, value and tourism experience. Conducted a pilot survey, refined the questionnaire and calculated the minimum required sample size.", metric: "5-point", caption: "Likert scales · Multi-level indicators" },
  { label: "Field Research", title: "Field Research", tools: "Online Survey · On-site Interviews", text: "Coordinated a four-day online/offline survey campaign, including three days of on-site field research in Zhanjiang. Formal collection ran from 30 January to 2 February 2023.", metric: "4 days", caption: "Including 3 days of on-site research" },
  { label: "Text Analytics", title: "Online Review Analytics", tools: "Python · Jieba · SO-PMI", text: "Scraped and cleaned consumer reviews, performed Chinese word segmentation and frequency analysis, and used SO-PMI-based sentiment analysis to identify recurring positive and negative experience signals.", metric: "Text + survey", caption: "Complementary sources of evidence" },
  { label: "Statistical Modeling", title: "Statistical Modeling", tools: "SPSS · ACSI · Fuzzy Evaluation", text: "Tested questionnaire reliability and validity, then combined satisfaction modeling, fuzzy comprehensive evaluation and importance–satisfaction analysis to quantify experience gaps.", metric: "3 tracks", caption: "Reliability · Evaluation · Priorities" },
  { label: "Recommendations", title: "From Insight to Recommendations", tools: "Governance · Experience · Brand · Sustainability", text: "Translated quantitative and qualitative findings into practical recommendations for operators, industry organizations and policymakers.", metric: "4", caption: "Strategic action areas" },
];
const fieldPhotos: Evidence[] = [
  { title: "On-site questionnaire collection", subtitle: "Consumer survey · Zhanjiang field research", image: asset("field-survey-02") },
  { title: "Conversations with local stakeholders", subtitle: "On-site interviews · Zhanjiang coast", image: asset("field-survey-03") },
  { title: "Field interviews and survey collection", subtitle: "Online and offline research · Zhanjiang", image: asset("field-survey-04") },
];
const archive: Evidence[] = [
  { title: "Research Summary Preview", subtitle: "Supplied visual summary · Selected portfolio preview", image: asset("original-research-summary") },
  { title: "Literature Co-occurrence Map", subtitle: "CiteSpace · International research themes", image: asset("literature-cooccurrence") },
  { title: "Literature Cluster Map", subtitle: "CiteSpace · Research-theme clusters", image: asset("literature-clusters") },
];
type Props = { project: Project; onViewEvidence: (item: Evidence) => void; onViewDocument: (item: ResearchDocument) => void };

function Figure({ item, onViewEvidence, className = "" }: { item: Evidence; onViewEvidence: Props["onViewEvidence"]; className?: string }) {
  return <figure className={`consumer-figure ${className}`}><button type="button" onClick={() => onViewEvidence(item)} aria-label={`View full preview: ${item.title}`}><img src={item.image} alt={item.title} loading="lazy" /><span><ArrowUpRight size={18} /></span></button><figcaption>{item.subtitle}</figcaption></figure>;
}

function Heading({ title, text }: { title: string; text?: string }) {
  return <div className="consumer-section-heading"><div><h3>{title}</h3>{text && <p>{text}</p>}</div></div>;
}

function SentimentChart({ onViewEvidence }: { onViewEvidence: Props["onViewEvidence"] }) {
  const [active, setActive] = useState(0);
  const values = [{ label: "Positive", value: 76, color: "#243c55" }, { label: "Neutral", value: 16, color: "#b6bcb5" }, { label: "Negative", value: 8, color: "#af8261" }];
  return <figure className="consumer-sentiment"><button type="button" className="consumer-donut" aria-label="View original sentiment chart: 76% positive, 16% neutral, 8% negative" onClick={() => onViewEvidence({ title: "Online Review Sentiment", subtitle: "Original sentiment analysis · 76% positive / 16% neutral / 8% negative", image: asset("sentiment-original") })}><span><strong>{values[active].value}%</strong><small>{values[active].label}</small></span></button><figcaption>{values.map((item, index) => <button type="button" key={item.label} aria-pressed={active === index} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><i style={{ background: item.color }} /><span>{item.label}</span><strong>{item.value}%</strong></button>)}<small>Online-review sentiment · Competition deck, slide 42</small></figcaption></figure>;
}

export function ConsumerCaseStudy({ project, onViewEvidence, onViewDocument }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const story = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const step = steps[activeStep];
  function goToChapter(id: string) {
    const section = story.current?.querySelector<HTMLElement>(`#consumer-${id}`);
    const modal = story.current?.closest<HTMLElement>(".consumer-modal");
    if (section && modal) modal.scrollTo({ top: modal.scrollTop + section.getBoundingClientRect().top - modal.getBoundingClientRect().top - 120, behavior: reducedMotion ? "instant" : "smooth" });
  }

  return <div className="consumer-story" ref={story}>
    <div className="consumer-metrics">
      {[['434', 'Valid Survey Responses'], ['1,966', 'WOS Records Analyzed'], ['105 Pages', 'Research Report'], ['Provincial 2nd Prize', '“CP Cup” Market Survey Competition']].map(([value, label]) => <div className="consumer-stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}
    </div>
    <div className="consumer-stack"><h3>RESEARCH APPROACH</h3><div>{["Field Research", "Literature Mapping", "Text Analytics", "Survey Analytics", "Satisfaction Modeling"].map(method => <span key={method}>{method}</span>)}</div></div>
    <nav className="consumer-chapters" aria-label="Case study sections">{chapters.map(([id, label]) => <button type="button" key={id} onClick={() => goToChapter(id)}>{label}</button>)}</nav>

    <section className="consumer-section" id="consumer-challenge">
      <Heading title="The Challenge" />
      <div className="consumer-challenge"><p>Zhanjiang has strong coastal tourism and fishery resources, yet <strong>consumer-oriented research</strong> on its recreational-fisheries sector remained limited. Our goal was to understand what actually drives visitor satisfaction, identify the most urgent <strong>experience gaps</strong>, and convert the findings into practical recommendations for operators, industry organizations and policymakers.</p><blockquote><span>RESEARCH QUESTION</span><p>What matters most to recreational-fishery visitors — and where should the industry improve first?</p></blockquote></div>
    </section>

    <section className="consumer-section" id="consumer-role">
      <Heading title="My Role — Team Lead" />
      <div className="consumer-role-grid">{roles.map(([title, text], index) => <article key={title}><div className="consumer-role-label"><span>0{index + 1}</span><i /><h4>{title}</h4></div><p><strong>{text.split(" ")[0]}</strong>{text.slice(text.indexOf(" "))}</p></article>)}</div>
    </section>

    <section className="consumer-section" id="consumer-design">
      <Heading title="Research Design" text="A mixed-method workflow, from literature mapping to practical recommendations." />
      <div className="consumer-timeline" role="group" aria-label="Research workflow stages">{steps.map((item, index) => <button type="button" key={item.title} className={activeStep === index ? "is-active" : ""} aria-pressed={activeStep === index} aria-controls="consumer-stage-detail" onMouseEnter={() => setActiveStep(index)} onFocus={() => setActiveStep(index)} onClick={() => setActiveStep(index)}><small>0{index + 1}</small><strong>{item.label}</strong>{index < steps.length - 1 && <ArrowRight size={14} aria-hidden="true" />}</button>)}</div>
      <div className="consumer-stage-detail" id="consumer-stage-detail"><div><span>{step.tools}</span><h4>{step.title}</h4><p>{step.text}</p></div><div className="consumer-stage-metric"><strong>{step.metric}</strong><span>{step.caption}</span></div></div>
      <div className="consumer-architecture"><h4>Research Architecture</h4><p>Structured and unstructured evidence converge into one consumer-insight framework.</p><Figure item={{ title: "Research Architecture", subtitle: "Online reviews and survey responses connect literature, analysis and recommendations", image: asset("research-architecture") }} onViewEvidence={onViewEvidence} /></div>
    </section>

    <section className="consumer-section" id="consumer-analysis">
      <Heading title="Data & Analysis" text="Three complementary tracks connect unstructured reviews with structured survey evidence." />
      <div className="consumer-field-heading"><h4>Field Research in Zhanjiang</h4><p>Four days of online/offline collection, including three days on site · 30 Jan – 2 Feb 2023</p></div>
      <div className="consumer-sample-flow">{[['501', 'Collected'], ['434', 'Valid Responses'], ['106', 'Valid Offline Responses'], ['3 Days', 'On-site Field Research']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      <p className="consumer-field-rate">86.6% valid-response rate · 434 / 501 questionnaires</p>
      <div className="consumer-field-photos">{fieldPhotos.map(item => <Figure key={item.image} item={item} onViewEvidence={onViewEvidence} />)}</div>
      <article className="consumer-analysis-track"><div className="consumer-track-copy"><span className="consumer-kicker">TRACK 01</span><h4>Online Review Analytics</h4><div className="consumer-track-tools">Python · Jieba · SO-PMI</div><p>Scraped and cleaned consumer reviews, performed Chinese word segmentation and frequency analysis, and used SO-PMI-based sentiment analysis to identify recurring positive and negative experience signals.</p></div><SentimentChart onViewEvidence={onViewEvidence} /></article>
      <div className="consumer-word-clouds"><Figure item={{ title: "Consumer Review Word Cloud", subtitle: "Original report · Complete consumer review word cloud", image: asset("review-word-cloud") }} onViewEvidence={onViewEvidence} /><Figure item={{ title: "Negative Experience Signals", subtitle: "Original report · Negative consumer experience word cloud", image: asset("negative-word-cloud") }} onViewEvidence={onViewEvidence} /></div>
      <article className="consumer-analysis-track"><div className="consumer-track-copy"><span className="consumer-kicker">TRACK 02</span><h4>Survey Analytics</h4><div className="consumer-track-tools">SPSS · Reliability & Validity Testing</div><p>Tested questionnaire reliability and validity before moving into satisfaction modeling.</p><button type="button" className="consumer-source-link" onClick={() => onViewEvidence({ title: "Reliability & Validity Tests", subtitle: "Original SPSS results · Competition deck, slide 28", image: asset("reliability-tests") })}>View original test results <ArrowUpRight size={15} /></button></div><div className="consumer-analysis-metrics"><div><strong>0.985</strong><span>Cronbach’s α</span></div><div><strong>0.982</strong><span>KMO</span></div></div></article>
      <article className="consumer-analysis-track"><div className="consumer-track-copy"><span className="consumer-kicker">TRACK 03</span><h4>Satisfaction Modeling</h4><div className="consumer-track-tools">ACSI · Fuzzy Comprehensive Evaluation · Importance–Satisfaction Matrix</div><p>Combined consumer-expectation, perceived-quality and perceived-value indicators to quantify overall satisfaction and identify high-priority improvement areas.</p></div><div className="consumer-analysis-metrics consumer-satisfaction-metrics"><div><strong>3.91<small> / 5</small></strong><span className="satisfaction-stars" aria-label="Approximately four out of five stars">{[0,1,2,3].map(i => <Star key={i} size={17} fill="currentColor" aria-hidden="true" />)}</span><span>Overall Satisfaction</span></div><div><strong>0.878</strong><span>Weight of Perceived Quality</span></div></div></article>
      <div className="consumer-model-figures"><Figure item={{ title: "ACSI-Informed Satisfaction Framework", subtitle: "Consumer expectations, perceived quality and value · Report figure 10", image: asset("acsi-framework") }} onViewEvidence={onViewEvidence} /><Figure item={{ title: "Fuzzy Comprehensive Evaluation", subtitle: "Original modeling workflow · Report figure 11", image: asset("fuzzy-evaluation") }} onViewEvidence={onViewEvidence} /></div>
    </section>

    <section className="consumer-section" id="consumer-findings">
      <Heading title="Findings & Strategy" />
      <div className="consumer-findings-grid"><article><span>01 / SATISFACTION</span><h4>Positive — but not frictionless.</h4><p>Consumers were generally satisfied, but the gap between expectations and perceived experience pointed to clear room for improvement.</p></article><article><span>02 / DRIVER</span><h4>Perceived quality is the primary lever.</h4><p>Perceived quality carried the largest weight in the evaluation framework, pointing to the on-site consumer experience as a central improvement priority.</p></article></div>
      <div className="consumer-priorities"><Figure item={{ title: "Importance–Satisfaction Matrix", subtitle: "Experience priorities from the original study · Report figure 33", image: asset("importance-satisfaction") }} onViewEvidence={onViewEvidence} /><div><span className="consumer-kicker">03 / IMPROVEMENT PRIORITIES</span><h4>Not every problem deserves equal attention.</h4><div className="consumer-priority-lists"><div><h5>Priority Areas</h5><ul><li>Dining & accommodation convenience</li><li>Signage and wayfinding</li><li>Fishing-village cultural experience</li><li>Shopping environment</li></ul></div><div><h5>Existing Strengths</h5><ul><li>Activity safety</li><li>Public security</li><li>Service attitude</li><li>Island sightseeing</li><li>Transport convenience</li></ul></div></div></div></div>
    <div className="consumer-strategy" id="consumer-strategy"><h4>From Insight to Action</h4><p>Recommendations address the visitor experience and the industry systems that support it.</p>
      <div className="consumer-strategy-grid">{[['Governance', 'Strengthen industry planning, supervision and cross-stakeholder coordination.'], ['Experience', 'Improve service quality, infrastructure, activity safety and product diversity.'], ['Brand & Growth', 'Build distinctive fishing-culture brands, broaden digital marketing and attract diversified investment.'], ['Sustainability', 'Improve transport accessibility, environmental awareness and long-term fishery-resource protection.']].map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h4>{title}</h4><p>{text}</p></article>)}</div>
    </div></section>

    <section className="consumer-section" id="consumer-evidence">
      <Heading title="Selected Evidence" text="Selected artifacts from the original team research project." />
      <div className="material-access-notice"><span>ACCESS TO PROJECT MATERIALS</span><p>Selected materials are shown for portfolio review only. Full reports, presentation decks and project files are not publicly downloadable in order to protect collaborative intellectual property. For recruiting, academic review or research collaboration, please contact me with your affiliation and intended use.</p><div><button type="button" onClick={() => onViewDocument(consumerDocuments[0])}>View Selected Materials <ArrowUpRight size={16} /></button><a href={consumerRequest}>Request Full Access <ArrowUpRight size={16} /></a></div></div>
      <h4 className="evidence-group-heading">Primary Deliverables</h4>
      <div className="consumer-deliverables">{consumerDocuments.map((item, index) => <button type="button" className="consumer-material" key={item.id} onClick={() => onViewDocument(item)}><div className={`consumer-material-preview consumer-material-${index}`}><img src={item.excerpts[0].image} alt={`${item.title} cover`} loading="lazy" /></div><div><span>{index === 0 ? '105 pages' : index === 1 ? '52 slides' : 'Consumer Satisfaction Questionnaire'}</span><h4>{item.title}</h4><small className="consumer-material-caption">{index === 0 ? "Selected methodology, analysis and findings." : index === 1 ? "Selected competition presentation slides." : "Selected structure and measurement design."}</small><small className="consumer-material-access">Full materials available on request</small><p>{index === 0 ? 'Preview Selected Pages' : index === 1 ? 'Preview Selected Slides' : 'View Selected Excerpt'} <ArrowUpRight size={17} /></p></div></button>)}<button type="button" className="consumer-material" onClick={() => onViewEvidence(project.evidence[0])}><div className="consumer-material-preview"><img src={project.evidence[0].image} alt="Provincial Second Prize certificate" loading="lazy" /></div><div><span>Provincial Second Prize</span><h4>Award</h4><p>View Certificate <ArrowUpRight size={17} /></p></div></button></div>
      <h4 className="evidence-group-heading">Research Evidence</h4>
      <div className="consumer-archive-grid">{archive.map(item => <div key={item.image}><Figure item={item} onViewEvidence={onViewEvidence} /><h4>{item.title}</h4></div>)}</div>
    </section>
  </div>;
}
