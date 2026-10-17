"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Evidence, Project } from "./project-content";
import type { ResearchDocument } from "./research-document-viewer";
import { materialRequest } from "./material-access";
import { ProjectFigure, ProjectVideo } from "./innovation-media";

const request = materialRequest("Request for Automated Seedling Project Materials", "I would like to learn more about the Intelligent Automated Seedling Cultivation System and its selected business, financial or product materials.");
const asset = (name: string) => `assets/materials/seedling/${name}.webp`;
const proof = (name: string, title: string, subtitle: string): Evidence => ({ image: asset(name), title, subtitle });
const planPages = [2,3,4,5,6,7,8,9,10,11,12,57,70,80,81,82,111,112,113,114,115,117,118,119,120,121,128,131];
const deckPages = [1,2,5,6,9,10,16,18,19,25,27,33,34,39];
const plan: ResearchDocument = { id: "seedling-plan", title: "Selected Business Plan", kind: "169-page business plan · 28 selected pages", requestHref: request, excerpts: planPages.map(n => ({image: asset(`plan-${String(n).padStart(3,"0")}`), label: `Original business plan · PDF page ${n}${n<=4?" · Complete contents":n<=12?" · Project overview":n>=111&&n<=128?" · Financial planning and projections":""}`})) };
const deck: ResearchDocument = { id: "seedling-deck", title: "Selected Competition Deck", kind: "42-slide provincial deck · 14 selected slides", requestHref: request, excerpts: deckPages.map(n => ({image: asset(`deck-${String(n).padStart(3,"0")}`), label: `Original provincial competition deck · Slide ${n}`})) };
const awards = [
  proof("award-swan", "National First Prize · Swan Cup", "9th International Smart Agricultural Equipment Innovation Competition · 2024"),
  proof("award-national-bronze", "National Bronze Award", "China International College Students’ Innovation Competition · 2024 · Named team member"),
  proof("award-provincial-silver", "Provincial Silver Award", "集“种”生智 · Original project certificate"),
  proof("award-provincial-bronze", "Provincial Bronze Award", "Smart seedling technology & Agriculture 5.0 · Original project certificate"),
  proof("award-campus-silver", "University Silver Award", "Smart planting project · Original award certificate"),
  proof("award-chuangqing", "Chuangqing Competition · Silver Award", "Original project competition record"),
  proof("award-huaju", "Huaju Cup · Third Prize", "Guangdong Ocean University selection · Original award certificate"),
  proof("award-innovation", "Innovation Launch Competition · Second Prize", "University final · Original award certificate"),
];
const awardDocument: ResearchDocument = { id: "seedling-awards", title: "Project Recognition", kind: "8 selected project award records", requestHref: request, excerpts: awards.map(a => ({image:a.image,label:`${a.title} · ${a.subtitle}`})) };
const agreements = [
  proof("agreement-stamped-1", "Selected Commercial Agreement", "Original purchase agreement · Company seal retained · Personal identifiers removed"),
  proof("agreement-stamped-2", "Selected Commercial Agreement", "Original purchase agreement · Company seal retained · Personal identifiers removed"),
];
const streams = [
  { name: "Strategy & Market", title: "Business Strategy & Market Positioning", verb: "Developed", text: "the project’s initial commercial framework and led market and competitive analysis using PEST, Porter’s Five Forces, SWOT and product benchmarking. Shaped target-market positioning, the B2B/B2G order-based business model and commercial priorities, working closely with the project leader on key strategic decisions.", output: "Market Analysis · Business Model Design · Strategic Decision-Making", images: [proof("deck-019", "Business Model & Market Positioning", "Original provincial deck · Slide 19 · Business model and customer channels")] },
  { name: "Financial Modeling", title: "End-to-End Financial Planning & Analysis", verb: "Independently developed", text: "the project’s financial framework, including budgets, cost and revenue models, fund-flow tracking and projected financial statements. Calculated investment appraisal and performance indicators—including NPV, payback period, profitability, solvency, operating efficiency and growth—to evaluate financial feasibility and risks.", output: "Independent Financial Modeling · Financial Forecasting · Investment Appraisal", images: [{image: "assets/materials/seedling/financial-forecast.svg", title: "Financial Forecasting & Investment Evaluation", subtitle: "Business-plan projections · Revenue, net profit, NPV and payback period"}] },
  { name: "Partnerships & Contracts", title: "Commercial Partnerships & Contract Execution", verb: "Served", text: "as a principal business-side coordinator for external agreements, managing partner communications, commercial documentation, contract terms and signing procedures for five purchase orders. Supported the execution of the project’s order-based sales model and coordination of related payment arrangements through the university.", output: "5 Signed Purchase Orders · Partner Coordination · Contract Execution", images: agreements },
  { name: "Team Leadership", title: "Business Team Leadership & Project Delivery", verb: "Led", text: "the commercial workstream from its early development through successive competition submissions. Coordinated major decisions with the project leader, delegated follow-up tasks, guided junior members and reviewed business plans, financial materials and presentation revisions to maintain quality and consistency.", output: "Workstream Leadership · Delegation & Review · Project Delivery", images: [] },
];
const workflow = ["Market Research", "Business Model Design", "Financial Evaluation", "Partnership Agreements", "Team Delivery"];

function WorkstreamEvidence({ items, onView }: { items: Evidence[]; onView: (item: Evidence) => void }) {
  const [index, setIndex] = useState(0);
  return <div className="workstream-evidence"><ProjectFigure item={items[index]} onView={onView}/>{items.length>1&&<div className="workstream-image-controls" aria-label="Select supporting material">{items.map((item,i)=><button type="button" key={item.image} aria-pressed={index===i} aria-label={`Show supporting material ${i+1}: ${item.title}`} onClick={()=>setIndex(i)}>{i+1}</button>)}<span>{index+1} / {items.length}</span></div>}</div>;
}

export function SeedlingCaseStudy({ project, onViewEvidence, onViewDocument }: { project: Project; onViewEvidence: (item: Evidence) => void; onViewDocument: (item: ResearchDocument) => void }) {
  const [stream, setStream] = useState(0);
  const selected = streams[stream];
  return <div className="seedling-story innovation-story">
    <header className="innovation-hero seedling-hero"><div><h2 id="project-modal-title">Intelligent Automated Seedling Cultivation System</h2><p className="innovation-role">{project.role}</p><p className="innovation-description">{project.summary}</p><div className="innovation-focus"><span>FOCUS</span><p>{project.methods}</p></div></div><ProjectFigure item={proof("product-hero", "Automated Multi-Tier Seedling Equipment", "Original project render · Cultivation trays, vertical circulation and monitoring")} onView={onViewEvidence} className="seedling-hero-product"/></header>

    <section className="innovation-section seedling-results"><div className="innovation-section-title"><h3>Project Outcomes</h3><p>Reported team results during the documented project period.</p></div><div className="seedling-result-grid"><div><strong>32</strong><span>Units Sold</span></div><div><strong>≈¥3.8m</strong><span>Reported Sales</span></div><div><strong>6</strong><span>Enterprise Agreements</span></div></div></section>

    <section className="innovation-section"><div className="innovation-section-title"><h3>My Commercial Leadership</h3><p>From early project leadership to directing commercial strategy, financial planning, partnership execution and team delivery.</p></div><div className="workstream-tabs" aria-label="Explore my commercial leadership">{streams.map((s,i)=><button key={s.name} type="button" aria-pressed={stream===i} aria-controls="seedling-workstream" onClick={()=>setStream(i)}><small>0{i+1}</small><span>{s.name}</span><ArrowRight size={15}/></button>)}</div><div className={`workstream-panel${selected.images.length ? "" : " workstream-text-only"}`} id="seedling-workstream" key={stream}><div><h4>{selected.title}</h4><p><strong>{selected.verb}</strong> {selected.text}</p><p className="workstream-output">{selected.output}</p></div>{selected.images.length>0&&<WorkstreamEvidence items={selected.images} onView={onViewEvidence}/>}</div></section>

    <section className="innovation-section seedling-workflow"><div className="innovation-section-title"><h3>From Market Insight to Project Delivery</h3></div><ol className="commercial-workflow" aria-label="Commercial workflow, five steps" tabIndex={0}>{workflow.map((title,i)=><li key={title}><span>0{i+1}</span><strong>{title}</strong>{i<workflow.length-1&&<ArrowRight size={16} aria-hidden="true"/>}</li>)}</ol></section>

    <section className="innovation-section"><div className="innovation-section-title"><h3>Product in Action</h3><p>Team-developed equipment, prototype operation and crop-monitoring tools.</p></div><div className="innovation-media-pair"><ProjectVideo name="system-architecture" title="System Architecture" caption="Selected equipment animation · Multi-tier structure and tray circulation"/><ProjectVideo name="prototype-operation" title="Prototype in Operation" caption="Complete 176-second demonstration · Mechanical equipment and moving cultivation trays"/></div><div className="innovation-media-pair seedling-product-records"><ProjectFigure item={proof("prototype", "Cultivation Equipment in Application", "Original project material · Multi-tier nursery equipment")} onView={onViewEvidence}/><ProjectFigure item={proof("monitoring-interface", "Crop-Monitoring Interface", "Original project screenshot · Environmental readings and live monitoring")} onView={onViewEvidence}/></div></section>

    <section className="innovation-section"><div className="innovation-section-title"><h3>Commercial Evidence</h3><p>Selected business planning, financial analysis and agreement excerpts.</p></div><div className="innovation-document-pair">{[{doc:plan,img:"plan-002",text:"Complete contents, project overview, market and business-model analysis, and selected financial forecasts."},{doc:deck,img:"deck-019",text:"Equipment, process, business model, reported commercial results, project development and financial analysis."}].map(({doc,img,text})=><button type="button" key={doc.id} onClick={()=>onViewDocument(doc)}><img src={asset(img)} alt={doc.title} loading="lazy"/><span><strong>{doc.title}</strong><small>{doc.kind}</small><p>{text}</p><span>View selected pages <ArrowUpRight size={15}/></span></span></button>)}</div><details className="innovation-details"><summary>Selected agreement excerpts <span>2 previews · Company seals retained · Personal identifiers removed</span></summary><div className="innovation-media-pair">{agreements.map(a=><ProjectFigure key={a.image} item={a} onView={onViewEvidence}/>)}</div></details></section>

    <section className="innovation-section"><div className="innovation-section-title"><h3>Recognition & Project Film</h3><p>Competition recognition and a visual account of the wider team’s work.</p></div><div className="seedling-recognition-film"><div className="seedling-recognition"><h4>Selected Recognition</h4>{awards.slice(0,2).map(a=><button type="button" className="innovation-award" key={a.image} onClick={()=>onViewEvidence(a)}><img src={a.image} alt={a.title} loading="lazy"/><span><strong>{a.title}</strong><small>{a.subtitle}</small></span><ArrowUpRight size={16}/></button>)}<button type="button" className="innovation-text-action" onClick={()=>onViewDocument(awardDocument)}>8 project awards documented <ArrowUpRight size={16}/></button></div><div className="seedling-film"><h4>Project Film</h4><ProjectVideo name="project-film" title="The Project Story" caption="A 64-second visual overview of the equipment, its applications and collaborative project work."/></div></div></section>

    <div className="innovation-material-request"><div><h4>Explore the work behind the project</h4><p>Full business plans, decks and supplementary product or commercial materials are available by email for recruiting, academic review or collaboration.</p></div><a href={request}>Request materials <ArrowUpRight size={17}/></a></div>
  </div>;
}
