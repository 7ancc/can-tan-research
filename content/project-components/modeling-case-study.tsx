"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import type { Contribution, Evidence } from "./project-content";
import type { ResearchDocument } from "./research-document-viewer";
import { modelingRequest } from "./material-access";
import { FlowText } from "./flow-text";

const stages = [
  ["FRAME", "Understand the real decision problem", "Move from a broad competition prompt to a tractable analytical question."],
  ["PREPARE", "Collect, clean and structure the data", "Resolve missing values, anomalies, text noise or feature representation before modeling."],
  ["MODEL", "Select appropriate analytical methods", "Match statistical, machine-learning or optimization methods to the structure of the problem."],
  ["VALIDATE", "Test performance and robustness", "Examine accuracy, fit, sensitivity, assumptions or constraint feasibility."],
  ["INTERPRET", "Translate outputs into domain meaning", "Ask what the numbers actually imply for the real scenario."],
  ["DELIVER", "Make technical work clear", "Connect assumptions, methods, figures and findings into a coherent final report."],
];
type ModelingCase = {
  id: string; nav: string; label: string; title: string; indexTitle: string; category: string; intro: string; indexIntro: string; question: string; challenge: string; methods: string;
  source: string; metric: string; metrics: [string, string][]; note?: string; workflow: [string, string][]; outputs?: string[]; figures: Evidence[]; role: string; contributions: Contribution[]; pages: number[]; report: string;
};
const figure = (id: string, name: string, title: string, subtitle: string): Evidence => ({ title, subtitle, image: `assets/materials/modeling/${id}/${name}.webp?v=20261007-refined` });
export const modelingCases: ModelingCase[] = [
  {
    id: "aviation", nav: "Aviation", label: "AVIATION SAFETY", title: "Aviation Safety Risk & Flight-Technique Evaluation", indexTitle: "Aviation Safety Risk & Flight-Technique Evaluation", category: "Risk Analytics · Time Series · Machine Learning",
    intro: "Turning high-frequency flight data into interpretable safety signals, pilot-operation evaluation and automated warning logic.", indexIntro: "Transforming QAR flight data into interpretable safety signals, flight-control evaluation and automated warning logic.",
    question: "How can QAR flight data be transformed into a practical framework for identifying key safety variables, quantifying unstable flight-control behavior and evaluating flight technique?",
    challenge: "The project required working across heterogeneous flight parameters, outlier-prone measurements and multiple analytical objectives—from identifying safety-critical variables to evaluating pilot-operation patterns and designing a real-time warning mechanism.", methods: "ARIMA · XGBoost · Simulated Annealing", source: "2023 MathorCup Mathematical Modeling Challenge · Second Prize", metric: "Competition modelling study", metrics: [],
    note: "Team competition study · research writing and analytical interpretation.",
    workflow: [["QAR Flight Data", "Multiple flight parameters"], ["Clean & Detect Outliers", "Prepare usable observations"], ["Select Safety Variables", "Identify key signals"], ["Analyze Flight Control", "Time-series behavior"], ["Construct Warning Bands", "ARIMA + boundaries"], ["Classify Flight Technique", "XGBoost"], ["Optimize Classification", "Simulated annealing"], ["Evaluate & Warn", "Risk and technique outputs"]],
    figures: [figure("aviation", "warning-boundaries", "Flight-Control Warning Boundaries", "Original report · Figure 9 · Fitted behavior and warning bounds"), figure("aviation", "feature-importance", "Flight-Technique Feature Importance", "Original report · Figure 18 · Selected flight-parameter contributions"), figure("aviation", "flight-control-series", "Flight-Control Time Series", "Original Word report · Fitted flight-control behavior"), figure("aviation", "exceedance-distribution", "Exceedance Events by Day Type", "Original report · Figure 16 · Workday and rest-day event distribution")],
    role: "Research Writing & Analysis Lead", contributions: [
      { title: "Data & Analysis", text: "Collected and preprocessed relevant flight data, supported empirical analysis and worked with the modeling member to interpret model outputs." },
      { title: "Research Integration", text: "Connected assumptions, analytical procedures, figures and results into a coherent technical narrative across the project’s five modeling tasks." },
      { title: "Final Delivery", text: "Led manuscript development, formatting, revision and final report integration, producing a technical submission including code." },
    ], pages: [1, 2, 3, 4, 5, 8, 12, 16, 20, 24, 25, 26, 28, 33], report: "Technical report",
  },
  {
    id: "early-warning", nav: "Early Warning", label: "EARLY-WARNING SYSTEMS", title: "Multi-Indicator Social-System Early Warning", indexTitle: "Social-System Early Warning", category: "Multi-Criteria Evaluation · Forecasting · Risk Indicators",
    intro: "Connecting multidimensional indicators with interpretable scoring, warning thresholds and temporal forecasting.", indexIntro: "Converting multidimensional institutional, economic and social indicators into an interpretable scoring, warning and forecasting framework.",
    question: "How can multidimensional economic, institutional and social indicators be combined into an interpretable system for risk scoring, warning-threshold construction and future trend forecasting?",
    challenge: "The project required turning heterogeneous country-level indicators into one structured analytical system, balancing indicator weighting, variable selection, early-warning logic and temporal prediction.", methods: "TOPSIS · LASSO · LSTM", source: "2023 Huashu Cup Mathematical Modeling Competition · Honorable Mention", metric: "15 Indicators · 20 Years", metrics: [["15", "Indicators"], ["2001–2020", "Data Horizon"], ["83%", "Summary-Reported Model Reliability"]], note: "The report summary describes 83% model reliability; the detailed LASSO analysis reports R² = 0.8143. These are internal study measures, rather than an independently validated forecasting accuracy.",
    workflow: [["Country-Level Data", "Multi-source indicators"], ["Process Missing Values", "Prepare consistent series"], ["Build Indicator System", "15 selected indicators"], ["Score & Weight", "TOPSIS + entropy weighting"], ["Examine Associations", "Spearman"], ["Select & Validate", "LASSO cross-validation"], ["Construct Warning Logic", "Domain-specific thresholds"], ["Forecast & Interpret", "LSTM + scenarios"]],
    figures: [figure("early-warning", "lasso-validation", "LASSO Cross-Validation", "Original report · Figure 3 · Regularization and model validation"), figure("early-warning", "model-fit", "Observed and Modeled Scores", "Original report · Comparison of LASSO model outputs"), figure("early-warning", "coefficient-paths", "Regularization Paths", "Original Word report · LASSO coefficient variation"), figure("early-warning", "indicator-correlations", "Indicator Associations", "Original Word report · Spearman correlation heatmap")],
    role: "First Team Member · Data Analysis & Research Writing", contributions: [
      { title: "Data Preparation", text: "Collected, integrated and preprocessed multi-source indicator data for subsequent modeling." },
      { title: "Modeling Collaboration", text: "Worked with the modeling member to connect TOPSIS, LASSO and LSTM outputs with the project’s early-warning logic and trend analysis." },
      { title: "Research Delivery", text: "Led the research-report writing process and co-produced the English version of the final submission." },
    ], pages: [1, 2, 6, 10, 13, 14, 15, 19, 23], report: "22-page English Technical Report",
  },
  {
    id: "retail", nav: "Retail", label: "OPERATIONS & PRICING", title: "Retail Pricing & Replenishment Optimization", indexTitle: "Retail Pricing & Replenishment Optimization", category: "Demand Forecasting · Pricing · Operations Research",
    intro: "Linking sales relationships, short-horizon forecasts and constrained optimization to operational decisions.", indexIntro: "Linking sales patterns, demand forecasting and constrained optimization to support fresh-food pricing and replenishment decisions.",
    question: "How should a fresh-food retailer forecast demand, determine pricing and allocate replenishment under perishability, assortment and minimum-display constraints?",
    challenge: "The project connected historical sales relationships with short-horizon demand forecasting and constrained optimization, moving from descriptive purchase patterns to operational replenishment and pricing decisions.", methods: "ARIMA · Ridge · Genetic Algorithm", source: "2023 China Undergraduate Mathematical Contest in Modeling · Guangdong Second Prize", metric: "29 SKUs Optimized", metrics: [["29", "Selected SKUs"], ["¥573.81", "Scenario Maximum Profit"], ["Provincial 2nd Prize", "Mathematical Modeling Competition"]], note: "The selected assortment and profit are results for the competition’s specified scenario, rather than realized commercial outcomes.",
    workflow: [["Historical Sales", "Transactions and categories"], ["Clean & Normalize", "Prepare comparable data"], ["Analyze Sales Patterns", "Spearman correlations"], ["Model Demand–Price Links", "Ridge regression"], ["Forecast Demand", "ARIMA · Seven-day horizon"], ["Define Constraints", "Assortment + minimum display"], ["Optimize Decisions", "Genetic algorithm"], ["Plan Pricing & Stock", "29 selected SKUs"]],
    figures: [figure("retail", "correlation-heatmap", "Category Correlation Heatmap", "Original report · Spearman associations between vegetable categories"), figure("retail", "sku-correlations", "SKU-Level Sales Associations", "Original Word report · Spearman correlation heatmap"), figure("retail", "sales-patterns", "Category Sales Patterns", "Original Word report · Historical sales across vegetable categories"), figure("retail", "replenishment-plan", "Demand Time-Series Diagnostics", "Original Word report · Cauliflower ACF/PACF diagnostics")],
    role: "", contributions: [], pages: [1, 2, 5, 6, 9, 10, 12, 18, 21, 24, 26, 27, 29], report: "38-page Technical Report",
  },  {
    id: "nlp", nav: "NLP", label: "CONSUMER NLP", title: "Consumer Review Intelligence with BERT–BiLSTM–CNN", indexTitle: "Consumer Review Intelligence", category: "NLP · Classification · Consumer Analytics",
    intro: "Moving from raw consumer text to product classification, sentiment signals, keyword interpretation and human–machine review detection.", indexIntro: "Using transformer-based and hybrid neural-network models to classify reviews, interpret sentiment, extract keywords and distinguish human from machine-generated text.",
    question: "How can unstructured review text be transformed into reliable signals about product categories, consumer sentiment, ratings and review authenticity?",
    challenge: "The project treated consumer reviews as a multi-task NLP problem rather than a single sentiment-classification exercise. The workflow combined text preprocessing, semantic classification, keyword extraction, rating-related analysis and human–machine review discrimination.", methods: "BERT · BiLSTM · CNN", source: "2023 IMMCHE · Consumer-review mathematical modeling study", metric: "≈92% Macro Performance", metrics: [["≈92%", "Macro Classification Performance"], ["5-Fold", "Cross-Validation"], ["4", "Integrated NLP Tasks"]], note: "Macro Precision, Recall and F1 were approximately 92% in the project study. The five-fold validation workflow also supported the rating and review-authenticity tasks.",
    workflow: [["Raw Review Text", "Unstructured consumer data"], ["Clean & Filter", "Remove text noise"], ["Represent Text Features", "Tokens and word vectors"], ["Encode Meaning", "BERT"], ["Learn Sequential Features", "BiLSTM"], ["Extract Local Features", "CNN"], ["Run Four NLP Tasks", "Classification + interpretation"], ["Evaluate Performance", "Metrics and cross-validation"]], outputs: ["Product Classification", "Keyword Extraction", "Sentiment / Rating Analysis", "Human vs. Machine Detection"],
    figures: [figure("nlp", "architecture", "BERT–BiLSTM–CNN Architecture", "Original Word report · Integrated NLP model structure"), figure("nlp", "macro-performance", "Macro Classification Performance", "Portfolio redraw · Precision 92.09% / Recall 92.08% / F1 92.09% · Report summary"), figure("nlp", "review-word-cloud", "Consumer Vocabulary", "Original report · Figure 5.1 · Word-frequency exploration"), figure("nlp", "keyword-examples", "BERT Keyword Examples", "Original report · Table 6.1 · Selected extracted product keywords")],
    role: "Analysis & Research Writing Lead", contributions: [
      { title: "Analysis", text: "Led interpretation and manuscript development across review classification, sentiment-related analysis, keyword extraction and model evaluation." },
      { title: "Technical Communication", text: "Synthesized multiple NLP tasks into one coherent English technical report, linking model construction, evaluation and consumer-facing implications." },
      { title: "Beyond the Competition", text: "Independently reproduced core transformer-based NLP workflows in Python after the project to strengthen hands-on understanding of the modeling pipeline." },
    ], pages: [1, 2, 3, 5, 8, 12, 14, 18, 20], report: "24-page English Technical Report",
  },

];
export const modelingDocuments: ResearchDocument[] = modelingCases.map(item => ({
  id: `modeling-${item.id}`, title: `${item.nav} · Selected Report Pages`, kind: `${item.report} · ${item.pages.length} selected pages`, requestHref: modelingRequest,
  excerpts: item.pages.map(page => ({ image: `assets/materials/modeling/${item.id}/preview-${String(page).padStart(3, "0")}.webp?v=20261007-refined`, label: `Original report · PDF page ${page}` })),
}));
const acrossRoles = [
  ["Problem Structuring", "Turning broad questions into workable analytical tasks", "I helped translate open-ended competition prompts into research structures that connected data, models, outputs and final conclusions."],
  ["Data & Analysis", "Making imperfect data usable", "Across structured, time-series and text-based datasets, I worked on data collection, preprocessing, empirical analysis and interpretation."],
  ["Modeling Collaboration", "Connecting technical models with the research question", "I worked closely with modeling teammates to understand assumptions, interpret outputs and ensure that the analytical workflow answered the underlying problem."],
  ["Technical Writing", "Making complex analysis explainable", "Research writing became a recurring responsibility across projects—from organizing methodology and explaining results to aligning figures, arguments and conclusions into a coherent technical narrative."],
  ["Final Delivery", "From analysis to submission-ready work", "I helped carry projects through revision, formatting, translation and final integration, turning collaborative analytical work into complete competition-ready deliverables."],
];

function WorkflowPreview({ item, onViewEvidence }: { item: ModelingCase; onViewEvidence: (item: Evidence) => void }) {
  const diagrams = [figure(item.id, "workflow", `${item.nav} · Analytical Workflow`, "Supplied project flowchart · Click to enlarge")];
  if (item.id === "aviation" || item.id === "nlp") diagrams.push(figure(item.id, "research-framework", `${item.nav} · Research Framework`, "Supplied project logic map · Click to enlarge"));
  return <div className={`modeling-flow-preview${diagrams.length > 1 ? " modeling-flow-pair" : ""}`}>
    {diagrams.length === 1 && <div><h4>Analytical Workflow</h4><p>{item.methods}</p><small>View the complete flowchart</small></div>}
    {diagrams.map(d => <figure key={d.image}><button type="button" onClick={() => onViewEvidence(d)} aria-label={`Enlarge ${d.title}`}><img src={d.image} alt={d.title} loading="lazy" /><ArrowUpRight size={17} /></button><figcaption>{d.title}</figcaption></figure>)}
  </div>;
}
function Trajectories({ active, compact = false, onSelect }: { active: string; compact?: boolean; onSelect: (id: string) => void }) {
  return <div className={`modeling-trajectories${compact ? " is-compact" : ""}`} aria-label="Four cases across one analytical workflow">
    <div className="modeling-trajectory-labels"><span>4 CASES × 1 WORKFLOW</span>{stages.map(([label]) => <small key={label}>{label}</small>)}</div>
    {modelingCases.map(item => <button type="button" key={item.id} className={active === item.id ? "is-current" : ""} aria-current={active === item.id ? "true" : undefined} onClick={() => onSelect(item.id)}><strong>{item.nav === "NLP" ? "Consumer NLP" : item.nav}</strong>{stages.map(([label], i) => <span key={label} aria-hidden="true"><i />{i < 5 && <b />}</span>)}</button>)}
  </div>;
}
function Figure({ item, onViewEvidence }: { item: Evidence; onViewEvidence: (item: Evidence) => void }) {
  return <figure className="modeling-result-figure"><button type="button" onClick={() => onViewEvidence(item)} aria-label={`View preview: ${item.title}`}><img src={item.image} alt={item.title} loading="lazy" /><ArrowUpRight size={17} /></button><figcaption><strong>{item.title}</strong><span>{item.subtitle}</span></figcaption></figure>;
}

export function ModelingCaseStudy({ onViewEvidence, onViewDocument }: { onViewEvidence: (item: Evidence) => void; onViewDocument: (item: ResearchDocument) => void }) {
  const story = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0), [activeCase, setActiveCase] = useState("aviation"), [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  function go(id: string) { document.getElementById(`modeling-${id}`)?.scrollIntoView({behavior:"auto",block:"start"}); }
  function goCase(id: string) { setActiveCase(id); go(`case-${id}`); }
  useEffect(() => {
    const modal = story.current?.closest<HTMLElement>(".modeling-modal");
    if (!modal) return;
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const line = modal.getBoundingClientRect().top + modal.clientHeight * .45; const sections = [...story.current!.querySelectorAll<HTMLElement>(".modeling-case")]; const current = sections.find(e => e.getBoundingClientRect().bottom > line && e.getBoundingClientRect().top <= line); if (current) setActiveCase(current.dataset.case!); }); };
    modal.addEventListener("scroll", update, { passive: true }); update();
    return () => { modal.removeEventListener("scroll", update); cancelAnimationFrame(frame); };
  }, []);
  return <div className="modeling-story" ref={story}>
    <div id="modeling-overview" className="consumer-metrics modeling-metrics">{[["4", "Applied Modeling Cases"], ["120+", "Pages of Technical Reports"], ["4", "Application Domains"], ["2023–2024", "Portfolio Period"]].map(([value,label]) => <div className="consumer-stat" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <p className="modeling-position">My strength is not tied to one algorithm. It lies in carrying complex problems from ambiguous questions and imperfect data to interpretable models, defensible conclusions and polished technical delivery.</p>
    <nav className="modeling-chapters" aria-label="Modeling portfolio sections"><button type="button" onClick={() => go("overview")}>Overview</button><button type="button" onClick={() => go("framework")}>Framework</button><div className="modeling-cases-nav"><button type="button" aria-expanded={menuOpen} aria-controls="modeling-case-menu" onClick={() => setMenuOpen(value => !value)}>Cases <ChevronDown size={13} /></button>{menuOpen && <div id="modeling-case-menu">{modelingCases.map(item => <button type="button" key={item.id} onClick={() => goCase(item.id)}>{item.nav}</button>)}<button type="button" onClick={() => go("index")}>All Cases</button></div>}</div><button type="button" onClick={() => go("role")}>My Role</button><button type="button" onClick={() => go("evidence")}>Evidence</button></nav>

    <section className="modeling-section" id="modeling-framework"><span className="modeling-kicker">ONE FRAMEWORK</span><h3>One analytical workflow,<br />across very different problems</h3><div className="modeling-stage-grid">{stages.map(([label,text],i) => <button type="button" key={label} className={activeStage === i ? "is-active" : ""} aria-pressed={activeStage === i} aria-controls="modeling-stage-description" onMouseEnter={() => setActiveStage(i)} onFocus={() => setActiveStage(i)} onClick={() => setActiveStage(i)}><small>0{i+1}</small><strong>{label}</strong><span>{text}</span><ArrowRight size={15} /></button>)}</div><div className="modeling-stage-explanation" id="modeling-stage-description"><strong>{stages[activeStage][0]}</strong><p>{stages[activeStage][2]}</p></div><Trajectories active={activeCase} onSelect={goCase} /></section>
    <section className="modeling-section" id="modeling-index"><span className="modeling-kicker">CASE INDEX</span><h3>Four cases, four problem environments</h3><div className="modeling-index-grid">{modelingCases.map((item,i) => <button type="button" key={item.id} onClick={() => goCase(item.id)}><span>0{i+1} / {item.category}</span><h4>{item.indexTitle}</h4><p><FlowText text={item.indexIntro}/></p><strong>{item.metric}</strong><footer><small>{item.methods}</small><ArrowUpRight size={20} /></footer></button>)}</div></section>
    <section className="modeling-section modeling-atlas"><span className="modeling-kicker">METHODS ATLAS</span><h3>Methods in service of the question</h3><div>{[["FORECAST", ["ARIMA", "LSTM", "Time-Series Analysis", "ADF / ACF / PACF"]], ["LEARN", ["BERT", "BiLSTM", "CNN", "XGBoost", "Classification"]], ["OPTIMIZE", ["Genetic Algorithm", "Simulated Annealing", "Constrained Search", "Pricing & Replenishment"]], ["EVALUATE", ["TOPSIS", "Entropy Weighting", "LASSO", "Spearman", "Chi-Square", "Sensitivity Analysis"]]].map(([title, methods]) => <article key={String(title)}><h4>{title}</h4><ul>{(methods as string[]).map(method => <li key={method}>{method}</li>)}</ul></article>)}</div></section>

    <div className="modeling-case-group"><div className="modeling-case-rail"><Trajectories active={activeCase} compact onSelect={goCase} /></div>{modelingCases.map((item,i) => <section className="modeling-case" data-case={item.id} id={`modeling-case-${item.id}`} key={item.id}>
      <span className="modeling-kicker">CASE 0{i+1} / {item.label}</span><h3>{item.title}</h3><p className="modeling-source">{item.source}</p><p className="modeling-case-intro"><FlowText text={item.intro}/></p><div className="modeling-question"><h4>The Question</h4><p><FlowText text={item.question}/></p></div><p><FlowText text={item.challenge}/></p>
      <WorkflowPreview item={item} onViewEvidence={onViewEvidence} />
      <div className={`modeling-result-metrics ${item.metrics.length === 2 ? "two-metrics" : ""}`}>{item.metrics.map(([value,label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><p className="modeling-result-note"><FlowText text={item.note}/></p>
      <div className="modeling-result-grid">{item.figures.map(f => <Figure key={f.image} item={f} onViewEvidence={onViewEvidence} />)}</div>
      {item.contributions.length > 0 && <div className="modeling-case-role"><span className="modeling-kicker">MY ROLE</span><h4>{item.role}</h4><div>{item.contributions.map(c => <article key={c.title}><h5>{c.title}</h5><p><FlowText text={c.text}/></p></article>)}</div></div>}
      <div className="modeling-case-actions"><button type="button" onClick={() => onViewDocument(modelingDocuments[i])}>View Selected Pages <ArrowUpRight size={16} /></button><button type="button" onClick={() => onViewEvidence(item.id === "aviation" ? {title:"MathorCup Second Prize",subtitle:"2023 · Award certificate",image:"assets/materials/evidence/mathorcup-second-prize.webp"} : figure(item.id,"award",item.id === "nlp" ? "IMMCHE · Participation Certificate" : item.id === "early-warning" ? "Huashu Cup · Honorable Mention" : "Provincial Second Prize",item.id === "nlp" ? "2023 · Successful Participant · Original certificate" : item.source))}>{item.id === "nlp" ? "View Participation Record" : "View Award"} <ArrowUpRight size={16} /></button><span>{item.report} · Full report available on reasonable request</span></div>
    </section>)}</div>

    <section className="modeling-section" id="modeling-role"><span className="modeling-kicker">MY ROLE ACROSS PROJECTS</span><h3>A consistent way of contributing</h3><ol className="modeling-across-roles">{acrossRoles.map(([label,title,text],i) => <li key={label}><span>0{i+1} / {label}</span><div><h4>{title}</h4><p><FlowText text={text}/></p></div></li>)}</ol></section>
    <section className="modeling-section" id="modeling-evidence"><span className="modeling-kicker">SELECTED EVIDENCE</span><h3>The work behind the analysis</h3><p>Selected process visuals and result excerpts demonstrate the depth of the original work without publicly releasing full collaborative materials.</p><div className="modeling-evidence-grid">{modelingDocuments.map((doc,i) => <button type="button" key={doc.id} onClick={() => onViewDocument(doc)}><div><img src={doc.excerpts[0].image} alt={`${modelingCases[i].nav} report cover preview`} loading="lazy" /></div><span>{modelingCases[i].nav}</span><h4>{modelingCases[i].report}</h4><p>{doc.excerpts.length} selected pages · Framework, results and interpretation</p><strong>View Selected Pages <ArrowUpRight size={17} /></strong><small>Full report available on reasonable request</small></button>)}</div>
      <div className="material-access-notice"><span>ADDITIONAL MATERIALS</span><p>Full reports, presentation decks, source files and complete project materials are not publicly downloadable in order to protect collaborative intellectual property. Selected excerpts are provided for portfolio review only. For recruiting, academic review or research collaboration, I am happy to share additional materials upon a reasonable request with affiliation and intended use.</p><div><a href={modelingRequest}>Request Additional Materials <ArrowUpRight size={16} /></a></div></div>
    </section>
  </div>;
}
