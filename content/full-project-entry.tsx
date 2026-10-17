import React from 'react';
import {hydrateRoot} from 'react-dom/client';
import {CitrusCaseStudy} from './project-components/citrus-case-study';
import {ConsumerCaseStudy} from './project-components/consumer-case-study';
import {ModelingCaseStudy} from './project-components/modeling-case-study';
import {NeuralCaseStudy} from './project-components/neural-case-study';
import {SeedlingCaseStudy} from './project-components/seedling-case-study';
import {VentureCaseStudy,VentureAwards} from './project-components/venture-case-study';
import {ResearchDevelopment} from './project-components/research-development';
import {AppliedInnovation} from './project-components/applied-innovation';
import originals from './original-content.json';
import records from './research-records.json';
import current from '../projects.json';
const aliases:any={credit:'environmental-tax',market:'consumer',neural:'neural-dynamics',ets:'patient-capital'};
function FullProject({id}:any){const p:any=(current as any[]).find(p=>p.id===id);const originalId=aliases[id]||id;const r:any=(records as any[]).find(x=>x.id===originalId);const original:any=(originals.projects as any[]).find(x=>x.id===originalId)||r||{};function normalise(v:any):any{if(typeof v==='string'&&v.startsWith('/'))return 'assets/materials'+v;if(Array.isArray(v))return v.map(normalise);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,normalise(x)]));return v}const project=normalise({...original,...r,title:p.title,summary:p.desc,role:p.role,methods:p.methods,result:p.result});
const evidence=(item:any)=>window.dispatchEvent(new CustomEvent('portfolio:materials',{detail:[{path:item.image,title:item.title,caption:item.subtitle||''}]}));
const document=(doc:any)=>window.dispatchEvent(new CustomEvent('portfolio:materials',{detail:doc.excerpts.map((x:any)=>({path:x.image,title:doc.title,caption:x.label}))}));
const props={project,onViewEvidence:evidence,onViewDocument:document};
if(id==='citrus')return <CitrusCaseStudy {...props}/>;
if(id==='market')return <ConsumerCaseStudy {...props}/>;
if(id==='neural')return <NeuralCaseStudy {...props}/>;
if(id==='planting')return <SeedlingCaseStudy {...props}/>;
if(id==='venture')return <><VentureCaseStudy {...props} onViewAwards={()=>window.document.getElementById('venture-complete-awards')?.scrollIntoView()}/><section id="venture-complete-awards"><VentureAwards onViewEvidence={evidence}/></section></>;
if(['ets','fishers','marine-heritage'].includes(id))return <ResearchDevelopment {...props}/>;
if(id.startsWith('innovation-'))return <AppliedInnovation {...props} initialCase={id==='innovation-platform'?1:id==='innovation-social'?2:0}/>;
if(['nlp','aviation','early-warning','retail'].includes(id))return <ModelingCaseStudy {...props}/>;
return <article className="generic-project"><h2>{p.title}</h2><p className="card-role">{p.role}</p><p>{p.desc}</p><h3>Research methods</h3><p>{p.methods}</p><h3>My contribution</h3><ul>{p.contrib.map((x:string)=><li key={x}>{x}</li>)}</ul><h3>Output</h3><p>{p.result}</p>{r?.notes?.map((x:string)=><p key={x}>{x}</p>)}{(r?.evidence||[]).map((f:any)=><figure key={f.image}><button onClick={()=>evidence({...f,image:'assets/materials'+f.image})}><img src={'assets/materials'+f.image} alt={f.title}/></button><figcaption>{f.title} · {f.subtitle}</figcaption></figure>)}{r?.paper&&<a className="inline-cta" href={'assets/materials'+r.paper}>Read original paper ↗</a>}</article>
}
export {FullProject};
if(typeof window!=='undefined'){const root=window.document.getElementById('full-project');if(root){hydrateRoot(root,<FullProject id={root.dataset.project}/>);window.requestAnimationFrame(()=>{
 const id=root.dataset.project;const selection=id==='nlp'?'Consumer NLP':id==='aviation'?'Aviation':id==='early-warning'?'Early Warning':id==='retail'?'Retail':id==='innovation-platform'?'3D':id==='innovation-social'?'Tennis':id==='innovation-patent'?'Financial':null;
 if(['nlp','aviation','early-warning','retail'].includes(id||'')){window.document.getElementById('modeling-case-'+id)?.scrollIntoView({block:'start'})}
 if(selection){const controls=[...root.querySelectorAll<HTMLButtonElement>('.modeling-case-nav button,.modeling-case-controls button,.micro-case-controls button')];controls.find(b=>b.textContent?.toLowerCase().includes(selection.toLowerCase()))?.click()}
})}}
