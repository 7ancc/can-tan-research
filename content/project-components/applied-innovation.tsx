"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Play, X } from "lucide-react";
import type { Evidence, Project } from "./project-content";
import type { ResearchDocument } from "./research-document-viewer";
import { materialRequest } from "./material-access";
import { ProjectFigure } from "./innovation-media";
import { VideoPlayer } from "./video-player";

const asset = (name: string) => `assets/materials/innovation/${name}.webp`;
const proof = (name: string, title: string, subtitle: string): Evidence => ({ image:asset(name),title,subtitle });
const cases = [
  { id:"patent", name:"Financial Records", category:"PROBLEM-DRIVEN INNOVATION", title:"Financial Records Storage", role:"Initial Concept Contributor · First-Listed Inventor", challenge:"A practical records-storage problem identified through finance work: keeping physical documents organised while making the storage unit easier to handle.", contribution:"Proposed the initial utility-model concept, collaborated with engineering teammates on functional design and helped prepare patent documentation.", outcome:"Granted utility-model patent · ZL 2023 2 2544773.3 · 14 May 2024", detail:"The official certificate lists TAN Can first among five inventors. Guangdong Ocean University is the patent holder.", evidence:[proof("finance-design","Functional Design","Original product CAD drawing · Selected concept evidence"),proof("finance-assembly","Assembly View","Original project design · Records-storage device"),proof("finance-patent","Granted Utility-Model Patent","First-listed inventor · 一种财务信息保存装置 · ZL 2023 2 2544773.3")] },
  { id:"platform", name:"3D Cloud Platform", category:"DIGITAL PRODUCT DEVELOPMENT", title:"3D Modeling Cloud Platform", role:"Product Planning · UI Collaboration · Platform Testing", challenge:"Connecting photo-based modelling with a cloud-processing product that people can understand and use.", contribution:"Contributed to project planning, UI-design collaboration and platform testing, helping translate product requirements into a coherent digital-product proposal.", outcome:"Registered software copyright · 3D Model Design Software V1.0 · 2024SR0249462", detail:"Named software copyright co-holder; member of a university-level innovation-training project completed in June 2023. The selected records show formal project and software outputs.", evidence:[proof("3d-copyright","3D Model Design Software V1.0","Registered copyright co-holder · 7 February 2024 · QR and barcode removed"),proof("3d-completion","Innovation Project · Completion","Photo-based modelling platform with cloud processing · University-level training project · June 2023")] },
  { id:"social", name:"Inclusive Tennis", category:"SOCIAL INNOVATION", title:"Inclusive Tennis & Accessibility Platform", role:"Community Engagement · Field Research · Financial Planning · Platform Collaboration", challenge:"Supporting tennis participation among Deaf and hard-of-hearing communities through field engagement, inclusive sports activities and a dedicated digital publicity and management platform.", contribution:"Coordinated directly with tennis coaches and Deaf and hard-of-hearing participants, conducting on-site research and community outreach to understand their training experiences and practical needs. Independently developed financial analyses, funding plans, risk assessments and development proposals, while collaborating with the project lead on platform design and implementation planning.", outcome:"City-level Silver Award · 2023 Guangdong Chuangzhong Cup, Zhanjiang selection", detail:"Named co-holder of Tennis Publicity & Management Platform for Deaf Participants V1.0 · 2024SR0136343 · Registered 19 January 2024.", evidence:[proof("tennis-platform","Digital Publicity & Management","Original project deck · Slide 8 · Platform presentation and programme outreach"),proof("tennis-copyright","Registered Project Software","Tennis publicity and management platform · Named copyright co-holder"),proof("tennis-silver","City-Level Silver Award","2023 Chuangzhong Cup · Zhanjiang selection · Team award")] },
];

const fieldworkFilms = [
  { id: "coach-exchange", title: "On-Site Exchange with a Tennis Coach", duration: "00:13", caption: "Featured fieldwork footage", silent: true },
  { id: "coach-practice", title: "Coach–Participant Tennis Practice", duration: "00:11", caption: "Training in practice", silent: false },
  { id: "peer-practice", title: "Peer Tennis Practice", duration: "00:23", caption: "Community participation", silent: false },
  { id: "badminton-teaching", title: "Badminton Teaching & Practice", duration: "00:25", caption: "On-site coaching", silent: true },
];
type FieldworkFilm = typeof fieldworkFilms[number];

function FieldworkPlayer({ film, onClose }: { film: FieldworkFilm; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const player = dialog.current;
    player?.showModal();
    return () => {
      player?.close();
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={dialog} className="applied-video-dialog" aria-labelledby="fieldwork-film-title" onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => event.stopPropagation()} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <div className="fieldwork-player-heading"><div><span>Fieldwork in Motion · {film.duration}</span><h3 id="fieldwork-film-title">{film.title}</h3></div><button type="button" onClick={onClose} aria-label="Close fieldwork video"><X size={20}/></button></div>
    <VideoPlayer src={`assets/materials/innovation/fieldwork/${film.id}.mp4`} poster={`assets/materials/innovation/fieldwork/${film.id}-poster.webp`} label={film.title}/>
    {film.silent && <p className="fieldwork-silent-note">Silent on-site footage.</p>}
  </dialog>;
}

function FieldworkGallery() {
  const [film, setFilm] = useState<FieldworkFilm | null>(null);
  return <section className="fieldwork-gallery" aria-labelledby="fieldwork-gallery-title">
    <div className="fieldwork-heading"><h3 id="fieldwork-gallery-title">Fieldwork in Motion</h3><span>4 short films</span></div>
    <p>Selected footage from on-site communication, tennis practice, badminton teaching and community participation.</p>
    <div className="fieldwork-previews">{fieldworkFilms.map((item, index) => <figure key={item.id} className={index === 0 ? "fieldwork-featured" : "fieldwork-supporting"}>
      <button type="button" onClick={() => setFilm(item)} aria-label={`Watch ${item.title}`}><img src={`assets/materials/innovation/fieldwork/${item.id}-poster.webp`} alt={item.title} loading="lazy"/><span className="fieldwork-play"><Play size={18} fill="currentColor" aria-hidden="true"/></span><span className="fieldwork-duration">{item.duration}</span></button>
      <figcaption><strong>{item.title}</strong>{index === 0 && <span>{item.caption}</span>}</figcaption>
    </figure>)}</div>
    {film && <FieldworkPlayer film={film} onClose={() => setFilm(null)}/>}
  </section>;
}
export function AppliedInnovation({project,onViewEvidence,onViewDocument,initialCase=0}:{project:Project;onViewEvidence:(item:Evidence)=>void;onViewDocument:(item:ResearchDocument)=>void}) {
  const [active,setActive]=useState(0);
  const current=cases[active];
  const request=materialRequest(`Request for Applied Innovation Materials — ${current.title}`,`I would like to request supplementary materials for ${current.title} from your Applied Innovation & Intellectual Property portfolio.`);
  const financialEvidence:ResearchDocument={id:"tennis-financial-development",title:"Inclusive Tennis · Financial & Development Planning",kind:"2 selected slides · TAN Can’s supplied working materials",requestHref:request,excerpts:[1,2].map(n=>({image:asset(`tennis-finance-${n}`),label:n===1?"Original financial-analysis slide · Funding sources":"Original development-planning slide · Proposed future stages, not completed outcomes"}))};
  return <div className="innovation-story applied-story"><header className="applied-hero"><h2 id="project-modal-title">Applied Innovation &amp; Intellectual Property</h2><p className="applied-subtitle">From Practical Problems to Tangible Solutions</p><p className="innovation-description">{project.summary}</p><p className="applied-capability-line">Problem Sensing <span aria-hidden="true">→</span> Product Thinking <span aria-hidden="true">→</span> Practical Impact</p></header>
    <section className="innovation-section case-explorer"><div className="innovation-section-title"><h3>Case Explorer</h3><p>Select a case to explore its problem, contribution and evidence.</p></div><div className="micro-case-layout"><nav className="micro-case-controls" aria-label="Select an innovation case">{cases.map((c,i)=><button type="button" key={c.id} aria-pressed={active===i} aria-controls="micro-case-detail" onClick={()=>setActive(i)}><small>0{i+1}</small><span>{c.name}</span><ArrowRight size={16}/></button>)}</nav><div className="micro-case-detail" id="micro-case-detail" key={current.id}><span className="innovation-case-category">{current.category}</span><h3>{current.title}</h3><p className="innovation-role">{current.role}</p><div className="micro-case-copy"><div><h4>The Challenge</h4><p>{current.challenge}</p></div><div><h4>My Contribution</h4><p>{current.contribution}</p></div></div><div className="micro-case-outcome"><strong>{current.outcome}</strong><p>{current.detail}</p></div></div></div><div className={`micro-case-evidence ${current.evidence.length===2?"has-two":""}`}>{current.evidence.map(e=><ProjectFigure key={e.image} item={e} onView={onViewEvidence}/>)}</div>{active===2&&<button type="button" className="innovation-text-action" onClick={()=>onViewDocument(financialEvidence)}>View my financial & development materials <ArrowUpRight size={16}/></button>}</section>
    {active===2 && <FieldworkGallery/>}
    <section className="innovation-section innovation-reflection"><h3>Innovation Takeaway</h3><p>These projects strengthened my ability to connect practical needs with product thinking, interdisciplinary collaboration and tangible outcomes.</p></section><div className="innovation-material-request"><div><h4>Explore a case further</h4><p>Selected visual records are public previews. Full planning documents, design files and supplementary technical materials are available by email for review or collaboration.</p></div><a href={request}>Request case materials <ArrowUpRight size={17}/></a></div>
  </div>;
}
