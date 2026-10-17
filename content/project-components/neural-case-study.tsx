"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { Evidence, Project } from "./project-content";
import type { ResearchDocument } from "./research-document-viewer";
import { materialRequest } from "./material-access";
import { FlowText } from "./flow-text";

const request = materialRequest("Request for Neural Dynamics & Intelligent Detection Materials", "I am contacting you regarding the Neural Dynamics & Intelligent Detection research experience on your portfolio.");
const certificate: Evidence = { title: "Hyperspectral Image Target Detection Method", subtitle: "Co-inventor · ZL 2024 1 0627687.5 · Granted 19 July 2024", image: "assets/materials/neural/patent-certificate.webp" };
const reference: ResearchDocument = {
  id: "acgnd-reference", title: "ACGND · Research Stream Reference", kind: "Published research reference · 7 selected pages", requestHref: request,
  excerpts: [1, 2, 6, 8, 10, 13, 14].map(page => ({ image: `assets/materials/neural/paper-${String(page).padStart(2, "0")}.webp`, label: `Ye et al. (2024) · Original article page ${page}` })),
};
const phases = [
  ["Dynamic Tensor Inversion", "Time-varying, high-dimensional data", "The research asks how an evolving tensor can be inverted while keeping pace with a dynamic system."],
  ["Traditional / ZND", "Matrix-inversion cost · O(n³)", "Matrix inversion introduces a substantial computational burden; conventional numerical approaches may also lag behind time-varying inputs."],
  ["Adaptive-Coefficient GND", "Adaptive coefficients · No matrix inversion", "The ACGND research combines gradient-based dynamics with adaptive coefficients and activation functions."],
  ["A more efficient formulation", "Reported complexity · O(n²)", "The paper reports lower computational complexity while preserving convergence, supported by simulation and an engineering application."],
];
const learning = [
  ["Decode", "Literature & terminology", "Reviewed literature and screened mathematical methods to build working knowledge of neural dynamics, tensor computation and unfamiliar technical terminology."],
  ["Reconstruct", "Equations, methods & workflows", "Traced mathematical assumptions, comparative methods and experimental logic, reconstructing how the research question connects to its analytical workflow."],
  ["Validate", "Data, figures & comparative logic", "Supported data sourcing and figure preparation, and examined how simulations and comparative results support the research narrative under faculty guidance."],
  ["Translate", "Research writing & IP documentation", "Organized technical material into structured research notes and manuscript-ready content, and contributed to intellectual-property documentation."],
];
const contributions = [
  ["Research Orientation", "Conducted", " literature review and method screening to build working knowledge of neural dynamics, tensor computation and related high-dimensional methods."],
  ["Technical Synthesis", "Traced", " core mathematical assumptions, experimental logic and comparative methods, helping translate unfamiliar technical material into structured research notes and manuscript-ready content."],
  ["Research Support", "Supported", " data sourcing, figure preparation, workflow reconstruction and manuscript drafting under faculty guidance."],
  ["IP Documentation", "Contributed", " to research documentation and intellectual-property preparation within the broader intelligent-detection research stream."],
];

function TensorVisual({ phase, reduced }: { phase: number; reduced: boolean }) {
  const positions = Array.from({ length: 64 }, (_, i) => {
    const x = i % 4, y = Math.floor(i / 4) % 4, z = Math.floor(i / 16);
    return phase === 0 ? [95 + (x - y) * 28 + 83, 225 + (x + y) * 13 - z * 34] : phase === 1 ? [70 + i % 8 * 34, 55 + Math.floor(i / 8) * 30] : [115 + x * 48, 90 + y * 48];
  });
  return <svg className="neural-tensor-svg" viewBox="0 0 390 340" role="img" aria-label={phase < 2 ? "Conceptual dense tensor and numerical formulation" : "Conceptual adaptive neural-dynamics topology"}>
    <defs><radialGradient id="neural-tensor-halo"><stop stopColor="#dce6e8"/><stop offset="1" stopColor="#f5f6f3" stopOpacity="0"/></radialGradient></defs>
    <circle cx="195" cy="166" r="158" fill="url(#neural-tensor-halo)"/>
    {phase === 0 && [0, 1, 2, 3].map(z => <path key={z} d={`M178 ${225-z*34} l84 39 l-84 39 l-84 -39 Z`} fill="none" stroke="#8096a4" strokeWidth="1" opacity=".35"/>)}
    {phase >= 2 && Array.from({length:16}, (_,i)=>{const x=i%4,y=Math.floor(i/4);return <g key={i} stroke="#8197a5" strokeWidth="1.2">{x<3&&<line x1={115+x*48} y1={90+y*48} x2={163+x*48} y2={90+y*48}/>} {y<3&&<line x1={115+x*48} y1={90+y*48} x2={115+x*48} y2={138+y*48}/>}</g>;})}
    {positions.map(([x,y],i)=><motion.circle key={i} initial={{cx:x,cy:y,r:3.4,opacity:1}} animate={{cx:x,cy:y,opacity:phase>=2&&i>=16?0:1,r:phase>=2?5:3.4}} transition={{duration:reduced?0:.65,ease:"easeInOut"}} fill={i%7===0?"#b59a70":"#284a62"}/>)}
    <text x="195" y="322" textAnchor="middle" fill="#7b8a8c" fontSize="10" letterSpacing="1.5">{phase===0?"TENSOR REPRESENTATION":phase===1?"NUMERICAL FORMULATION":phase===2?"ADAPTIVE COEFFICIENTS":"EFFICIENT DYNAMIC SOLUTION"}</text>
  </svg>;
}

function SpectralVisual({ value }: { value: number }) {
  const layers = Math.max(1, Math.round(value / 14));
  const colors = ["#335b74", "#507b85", "#729489", "#a4ae88", "#b7a37b", "#97745e", "#776c87"];
  return <svg viewBox="0 0 430 330" role="img" aria-label={value<20?"Conceptual RGB scene":value<80?"Conceptual hyperspectral data layers":"Conceptual target highlighted in a spectral layer"}>
    <defs><linearGradient id="spectral-scene" x2="0" y2="1"><stop stopColor="#e3edf0"/><stop offset="1" stopColor="#c5d6cc"/></linearGradient></defs>
    {Array.from({length:layers},(_,i)=><g key={i} transform={`translate(${28+i*11} ${27+i*8})`} opacity={i===layers-1?1:.55}>
      <rect width="290" height="190" rx="3" fill={i===0?"url(#spectral-scene)":colors[(i-1)%colors.length]} stroke="#f5f6f3" strokeWidth="2"/>
      <path d="M0 141 L62 91 L109 130 L190 63 L290 128 V190 H0Z" fill={i===0?"#638477":"#183b52"} opacity=".55"/>
      <path d="M0 172 L105 152 L185 169 L290 149 V190 H0Z" fill={i===0?"#8aa18a":"#e8e4cd"} opacity=".5"/>
      <rect x="187" y="109" width="22" height="25" fill={i===0?"#a68a66":"#e3c49d"}/>
      {value>=80&&i===layers-1&&<g fill="none" stroke="#f6e6bd" strokeWidth="2"><rect x="177" y="99" width="43" height="46"/><path d="M220 99 h31"/><text x="237" y="92" fill="#fff8e8" stroke="none" fontSize="10">TARGET</text></g>}
    </g>)}
    <text x="215" y="312" textAnchor="middle" fill="#6f7f87" fontSize="11" letterSpacing="1.2">{value<20?"RGB VIEW":value<80?"SPECTRAL LAYERS":"TARGET IDENTIFICATION"}</text>
  </svg>;
}

export function NeuralCaseStudy({ project, onViewEvidence, onViewDocument }: { project: Project; onViewEvidence: (item: Evidence) => void; onViewDocument: (item: ResearchDocument) => void }) {
  const story = useRef<HTMLDivElement>(null), complexity = useRef<HTMLDivElement>(null);
  const [phase,setPhase] = useState(0), [step,setStep] = useState(0), [spectrum,setSpectrum] = useState(0);
  const reduced = !!useReducedMotion();
  function go(id: string) { document.getElementById(`neural-${id}`)?.scrollIntoView({behavior:"auto",block:"start"}); }
  useEffect(()=>{const thumb=story.current?.querySelector('[role="slider"]');thumb?.setAttribute("aria-labelledby","spectral-label");thumb?.setAttribute("aria-valuetext",spectrum<20?"RGB representation":spectrum<80?"Hyperspectral layer representation":"Target highlighted in spectral data");},[spectrum]);
  useEffect(()=>{const modal=story.current?.closest<HTMLElement>(".neural-modal");if(!modal)return;let frame=0;const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const box=complexity.current?.getBoundingClientRect();if(!box)return;const line=modal.getBoundingClientRect().top+modal.clientHeight*.48;if(box.top<line&&box.bottom>line)setPhase(Math.min(3,Math.max(0,Math.floor((line-box.top)/box.height*4))));});};modal.addEventListener("scroll",update,{passive:true});return()=>{cancelAnimationFrame(frame);modal.removeEventListener("scroll",update);};},[]);
  return <div className="neural-story" ref={story}>
    <header className="neural-overview" id="neural-overview"><div><h2 id="project-modal-title">Neural Dynamics &amp;<br/> Intelligent Detection</h2><p className="neural-subtitle">From High-Dimensional Computation to Hyperspectral Sensing</p><p className="neural-role">{project.role}</p><p><FlowText text={project.summary}/></p></div><aside className="neural-patent-outcome"><span>FORMAL IP OUTPUT</span><strong>1</strong><h4>Granted Invention Patent</h4><p>Co-inventor<br/>Hyperspectral Image Target Detection Method</p><small>ZL 2024 1 0627687.5</small><button type="button" onClick={()=>go("detection")}>Explore Patent <ArrowUpRight size={16}/></button></aside></header>
    <div className="neural-exposure"><span>RESEARCH EXPOSURE</span><p>Neural Dynamics · Dynamic Tensor Inversion · High-Dimensional Computing · Hyperspectral Detection · Technical Research Writing</p></div>
    <p className="neural-attribution">Supported a broader neural-dynamics research stream associated with ACGND work published in <em>Complex &amp; Intelligent Systems</em>; <strong>not a listed author of the publication.</strong></p>
    <nav className="neural-chapters" aria-label="Neural research sections">{[["overview","Overview"],["tracks","Tracks"],["acgnd","ACGND"],["workflow","Workflow"],["detection","Patent"],["reflection","Reflection"]].map(([id,label])=><button type="button" key={id} onClick={()=>go(id)}>{label}</button>)}</nav>
    <section className="neural-section" id="neural-tracks"><span className="neural-kicker">TWO RESEARCH TRACKS</span><h3>One research experience,<br/>two technical directions</h3><div className="neural-track-origin">RESEARCH CONTRIBUTOR</div><div className="neural-tracks">{[["01","Neural Dynamics","Dynamic Tensor Inversion → GND / ZND → ACGND → Simulation → Engineering Validation","acgnd"],["02","Intelligent Detection","Hyperspectral Data → Feature Representation → Target Detection → Patent Documentation → Granted IP","detection"]].map(([n,title,path,id])=><button type="button" key={id} onClick={()=>go(id)}><span>TRACK {n}</span><h4>{title}</h4><ol>{path.split(" → ").map((node,i)=><li key={node}><span>{node}</span>{i<4&&<ArrowRight size={13}/>}</li>)}</ol><footer>Explore Track <ArrowUpRight size={16}/></footer></button>)}</div></section>
    <section className="neural-section" id="neural-acgnd"><span className="neural-kicker">TRACK 01 / NEURAL DYNAMICS</span><h3>Inside ACGND</h3><blockquote>How can high-dimensional, time-varying tensor inversion be solved quickly enough for dynamic AI and engineering systems?</blockquote><p>Dynamic Tensor Inversion is relevant to tensor-based AI frameworks such as TensorFlow and PyTorch. Conventional numerical methods can incur lagging errors in dynamic settings; neural-dynamics approaches address this challenge, with different trade-offs in accuracy and computational cost.</p>
      <div className="neural-complexity" ref={complexity}><div className="neural-phase-list">{phases.map(([title,subtitle],i)=><button type="button" key={title} className={phase===i?"is-active":""} aria-pressed={phase===i} aria-controls="neural-phase-description" onClick={()=>setPhase(i)}><span>0{i+1}</span><div><h4>{title}</h4><small>{subtitle}</small></div></button>)}</div><div className="neural-complexity-visual"><TensorVisual phase={phase} reduced={reduced}/><div className="neural-complexity-values"><span>O(n³)</span><ArrowRight size={20}/><strong>O(n²)</strong></div><p id="neural-phase-description" aria-live="polite">{phases[phase][2]}</p><small>Conceptual illustration · Complexity improvement reported by the research stream</small></div></div>
      <div className="neural-research-evidence">{[{title:"DTI Simulation Comparison",subtitle:"Ye et al. (2024) · Figure 4 · Original published research",image:"assets/materials/neural/dti-comparison.webp"},{title:"Engineering Validation",subtitle:"Ye et al. (2024) · Figure 7 · Two-link robotic manipulator simulation",image:"assets/materials/neural/engineering-validation.webp"}].map(item=><figure key={item.image}><button type="button" onClick={()=>onViewEvidence(item)}><img src={item.image} alt={item.title} loading="lazy"/><ArrowUpRight size={16}/></button><figcaption><strong>{item.title}</strong><span>{item.subtitle}</span></figcaption></figure>)}</div>
      <div className="neural-reference"><span>RESEARCH STREAM REFERENCE</span><p>Ye, A., Xiao, X., Xiao, H., Jiang, C. &amp; Lin, C. (2024). ACGND: towards lower complexity and fast solution for dynamic tensor inversion. <em>Complex &amp; Intelligent Systems</em>, 10, 6143–6157.</p><div><button type="button" onClick={()=>onViewDocument(reference)}>View Selected Research Pages <ArrowUpRight size={16}/></button><a href="https://doi.org/10.1007/s40747-024-01480-6" target="_blank" rel="noreferrer">Published Article <ArrowUpRight size={16}/></a></div></div>
    </section>
    <section className="neural-section" id="neural-workflow"><span className="neural-kicker">MY RESEARCH WORKFLOW</span><h3>From unfamiliar to workable</h3><div className="neural-learning">{learning.map(([title,subtitle],i)=><button type="button" key={title} className={step===i?"is-active":""} aria-pressed={step===i} aria-controls="neural-learning-detail" onMouseEnter={()=>setStep(i)} onFocus={()=>setStep(i)} onClick={()=>setStep(i)}><span>0{i+1}</span><h4>{title}</h4><small>{subtitle}</small>{i<3&&<ArrowRight size={14}/>}</button>)}</div><div id="neural-learning-detail" className="neural-learning-detail"><strong>{learning[step][0]}</strong><p><FlowText text={learning[step][2]}/></p></div></section>
    <section className="neural-section" id="neural-detection"><span className="neural-kicker">TRACK 02 / INTELLIGENT DETECTION</span><h3>From spectral data<br/>to target identification</h3><div className="neural-detection-grid"><div className="neural-spectral"><SpectralVisual value={spectrum}/><label id="spectral-label">Explore spectral representation</label><Slider aria-labelledby="spectral-label" min={0} max={100} step={1} value={[spectrum]} onValueChange={v=>setSpectrum(v[0])}/><div className="neural-spectrum-labels"><span>RGB</span><span>Spectral layers</span><span>Target</span></div><p>Conceptual illustration of spectral representation and target identification; not a patent experiment or a reconstruction of the patented algorithm.</p></div><div className="neural-patent-record"><span className="neural-kicker">GRANTED INVENTION PATENT</span><h4>Hyperspectral Image<br/>Target Detection Method</h4><dl><div><dt>My role</dt><dd>Co-inventor</dd></div><div><dt>Patent number</dt><dd>ZL 2024 1 0627687.5</dd></div><div><dt>Granted</dt><dd>19 July 2024</dd></div><div><dt>Patent holder</dt><dd>Guangdong Ocean University</dd></div></dl><button type="button" className="neural-certificate" onClick={()=>onViewEvidence(certificate)}><img src={certificate.image} alt="Granted invention patent certificate naming Can Tan as co-inventor" loading="lazy"/><span>View Patent Certificate <ArrowUpRight size={16}/></span></button><p className="neural-inventors">Inventors: 叶爱萍 · 林聪 · <strong>谭灿</strong> · 高升</p></div></div><p className="neural-patent-meaning">The patent provides a tangible output from the broader intelligent-detection research stream in which I participated, and marks my first granted invention patent within a growing portfolio of intellectual-property work.</p></section>
    <section className="neural-section" id="neural-contribution"><span className="neural-kicker">MY CONTRIBUTION</span><h3>Turning technical learning<br/>into research support</h3><div className="neural-contributions">{contributions.map(([title,verb,text],i)=><article key={title}><span>0{i+1}</span><h4>{title}</h4><p><strong>{verb}</strong>{" "}<FlowText text={text}/></p></article>)}</div></section>
    <section className="neural-section" id="neural-reflection"><span className="neural-kicker">WHAT THIS CHANGED</span><h3>A systematic way into<br/>unfamiliar technical domains</h3><p>Before this project, my strongest training was in economics, finance and applied data analysis. Working with neural dynamics and high-dimensional computation taught me how to enter unfamiliar technical domains systematically—starting from literature and mathematical assumptions, reconstructing research logic, and eventually contributing meaningfully to interdisciplinary AI research.</p><div className="neural-capabilities"><span>Technical Curiosity</span><span>Learning Agility</span><span>Cross-Disciplinary Translation</span></div><a className="neural-request" href={request}>Request Additional Research Materials <ArrowUpRight size={16}/></a></section>
  </div>;
}
