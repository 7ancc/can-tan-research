"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail, Pause, Play, Plus } from "lucide-react";
import type { Evidence, Project } from "./project-content";
import { VideoPlayer } from "./video-player";

const asset = (name: string) => `assets/materials/venture/${name}.webp`;
const awards: Evidence[] = [
  { title: "National Silver", subtitle: "China International College Students’ Innovation Competition · 2023", image: "assets/materials/evidence/venture-national-silver.webp" },
  { title: "National First Prize", subtitle: "National Marine Entrepreneurship Competition · 2023", image: asset("award-marine-first") },
  { title: "National Third Prize", subtitle: "China Students Service Outsourcing Innovation & Entrepreneurship Competition · 2024", image: asset("award-outsourcing-third") },
  { title: "Provincial Gold", subtitle: "China International College Students’ Innovation Competition · Guangdong · 2023", image: asset("award-provincial-gold") },
  { title: "Provincial Silver", subtitle: "Challenge Cup · Guangdong · 2024", image: asset("award-challenge-silver") },
  { title: "Provincial First Prize", subtitle: "E-commerce Innovation, Creativity & Entrepreneurship Competition · 2023", image: asset("award-three-creation-first") },
  { title: "Regional Second Prize", subtitle: "Service Outsourcing Innovation & Entrepreneurship Competition · Central Region · 2024", image: asset("award-outsourcing-region-second") },
  { title: "Provincial Bronze", subtitle: "China International College Students’ Innovation Competition · Industry Track · 2023", image: asset("award-industry-bronze") },
  { title: "University Second Prize", subtitle: "9th Huoju Cup Innovation & Entrepreneurship Competition", image: asset("award-huoju-second") },
];
const products = [
  { title: "Caotan / 草潭", subtitle: "Regional golden-pomfret packaging concept", image: asset("sku-caotan") },
  { title: "Liusha / 流沙", subtitle: "Regional golden-pomfret packaging concept", image: asset("sku-liusha") },
  { title: "Dongli / 东里", subtitle: "Regional golden-pomfret packaging concept", image: asset("sku-dongli") },
];
const deck: Evidence[] = [
  [6, "Value proposition"], [13, "Product range"], [15, "Value chain"], [16, "Market outreach"],
  [17, "Commercial partnerships"], [22, "Regional branding"], [26, "Media coverage"], [27, "National recognition"],
].map(([page, title]) => ({ title: String(title), subtitle: `Project deck · Original slide ${page}`, image: asset(`deck-${String(page).padStart(2, "0")}-pdf`) }));
const personalFieldwork: Evidence[] = [
  { title: "Project review & discussion", subtitle: "Working through the project with a faculty adviser", image: asset("personal-discussion") },
  { title: "National innovation competition", subtitle: "With the team at the national “Internet+” competition", image: asset("personal-national-competition") },
  { title: "Innovation showcase in Guangzhou", subtitle: "On-site presentation and exchange · Guangzhou", image: asset("personal-guangzhou") },
  { title: "Provincial innovation competition", subtitle: "With the team at the Guangdong “Internet+” competition", image: asset("personal-provincial-competition") },
  { title: "Community fieldwork", subtitle: "With the team during the “百千万工程” programme", image: asset("personal-community-fieldwork") },
];
const stages = [
  ["FIELD", "10+ rounds of field research"], ["INSIGHT", "Industry & customer analysis"],
  ["PRODUCT", "SKU & packaging development"], ["MARKET", "Enterprise & cooperative negotiations"],
  ["TRACTION", "Signed purchase agreements"], ["IMPACT", "Six-village rural support"],
  ["SCALE", "National competitions & media recognition"],
];

type PreviewProps = { onViewEvidence: (item: Evidence) => void };

function EvidenceFigure({ item, className = "", onViewEvidence }: PreviewProps & { item: Evidence; className?: string }) {
  return <figure className={`venture-figure ${className}`}>
    <button type="button" className="venture-image-button" onClick={() => onViewEvidence(item)} aria-label={`View full preview: ${item.title}`}>
      <img src={item.image} alt={item.title} loading="lazy" />
      <span className="venture-image-expand"><ArrowUpRight size={19} /></span>
    </button>
    <figcaption>{item.subtitle}</figcaption>
  </figure>;
}

function AwardCards({ items, onViewEvidence }: PreviewProps & { items: Evidence[] }) {
  return <div className="venture-award-grid">{items.map(item => <button type="button" className="venture-award" key={item.image} onClick={() => onViewEvidence(item)}>
    <div className="venture-award-image"><img src={item.image} alt={item.title} loading="lazy" /></div>
    <div><strong>{item.title}</strong><p>{item.subtitle}</p></div><ArrowUpRight size={18} />
  </button>)}</div>;
}

export function VentureAwards({ onViewEvidence }: PreviewProps) {
  return <AwardCards items={awards} onViewEvidence={onViewEvidence} />;
}

function AnimatedEvidence({ name, title }: { name: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPlaying(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  return <figure className="venture-motion-evidence">
    <img src={asset(playing ? name : `${name}-poster`)} alt={title} loading="lazy" />
    <figcaption><span>{title}</span><button type="button" aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? "Pause" : "Play"}</button></figcaption>
  </figure>;
}

export function VentureCaseStudy({ project, onViewEvidence, onViewAwards }: PreviewProps & { project: Project; onViewAwards: () => void }) {
  const productTrack = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  function moveProducts(direction: number) {
    const track = productTrack.current;
    if (!track) return;
    track.scrollBy({ left: direction * (track.querySelector<HTMLElement>(".venture-sku")?.offsetWidth || track.clientWidth), behavior: reduceMotion ? "instant" : "smooth" });
  }
  return <div className="venture-story">
    <EvidenceFigure className="venture-hero" item={{ title: "Golden pomfret product packaging", subtitle: "Product packaging mockup · Golden-pomfret venture", image: asset("packaging") }} onViewEvidence={onViewEvidence} />

    <div className="venture-facts">
      <div><h3>OUTCOME</h3>{project.result.split("\n").map((paragraph, index) => <p key={paragraph}>{index === 0 ? <strong>{paragraph}</strong> : paragraph}</p>)}</div>
      <div><h3>FOCUS</h3><p>{project.methods}</p></div>
    </div>
    <section className="venture-contribution"><h3 className="venture-kicker">MY CONTRIBUTION</h3><ul>{project.contributions.map(item => <li key={item.title}><h4>{item.title}</h4><p>{item.text}</p></li>)}</ul></section>

    <section className="venture-section">
      <div className="venture-section-head"><span className="venture-kicker">02 / FIELDWORK, COLLABORATION & PITCHING</span><h3>From first-hand research to project presentation</h3><p>10+ rounds of industry research with processing enterprises and aquaculture stakeholders in Guangdong, alongside project reviews, team collaboration and competition presentations.</p></div>
      <div className="venture-field-grid">
        <EvidenceFigure item={{ title: "On-site research with a processing enterprise", subtitle: "Enterprise visit · Guangdong aquaculture value chain", image: asset("enterprise-research") }} onViewEvidence={onViewEvidence} />
        <EvidenceFigure item={{ title: "Field research with industry stakeholders", subtitle: "Industry fieldwork · Guangdong", image: asset("field-visit") }} onViewEvidence={onViewEvidence} />
      </div>
      <div className="venture-personal-heading"><h4>On site with the team</h4><span>Research · Exchange · Presentation</span></div>
      <div className="venture-personal-track" aria-label="Personal project fieldwork and presentation photographs">{personalFieldwork.map(item => <EvidenceFigure key={item.image} item={item} onViewEvidence={onViewEvidence} />)}</div>
    </section>

    <section className="venture-section">
      <div className="venture-section-head venture-with-controls"><div><span className="venture-kicker">03 / PRODUCT STRATEGY</span><h3>Three regional product identities</h3><p>SKU concepts and packaging designs connecting regional aquaculture stories with a market-facing product identity.</p></div><div className="venture-carousel-controls"><button type="button" aria-label="Previous product concept" onClick={() => moveProducts(-1)}><ArrowLeft size={19} /></button><button type="button" aria-label="Next product concept" onClick={() => moveProducts(1)}><ArrowRight size={19} /></button></div></div>
      <div ref={productTrack} className="venture-product-track" aria-label="Product design concepts">{products.map((item, index) => <button type="button" className="venture-sku" key={item.image} onClick={() => onViewEvidence(item)}>
        <div className="venture-sku-image"><img src={item.image} alt={item.title} loading="lazy" /><span className="venture-image-expand"><ArrowUpRight size={19} /></span></div>
        <div className="venture-sku-caption"><small>0{index + 1}</small><strong>{item.title}</strong><p>{item.subtitle}</p></div>
      </button>)}</div>
    </section>

    <section className="venture-section">
      <div className="venture-section-head"><span className="venture-kicker">04 / COMMERCIALISATION</span><h3>Connecting producers with the market</h3><p>Engaged with enterprises, customers and local cooperatives, supporting commercial negotiations and purchase agreements across the value chain.</p></div>
      <h4 className="venture-kicker">FROM IDEA TO IMPLEMENTATION</h4>
      <ol className="venture-process">{stages.map(([title, description], index) => <li key={title}><span>0{index + 1}</span><strong>{title}</strong><p>{description}</p>{index < stages.length - 1 && <ArrowRight size={15} aria-hidden="true" />}</li>)}</ol>
      <div className="venture-deck-heading"><h4>Project Deck</h4><span>8 selected slides</span></div>
      <div className="venture-deck-track" aria-label="Selected project deck slides">{deck.map(item => <button type="button" key={item.image} className="venture-deck-slide" onClick={() => onViewEvidence(item)}><img src={item.image} alt={item.title} loading="lazy" /><strong>{item.title}</strong><small>{item.subtitle}</small></button>)}</div>
      <button type="button" className="venture-ip" onClick={() => onViewEvidence({ title: "Intelligent aquaculture automatic feeding device", subtitle: "Utility model patent · First inventor · ZL202320850862.8", image: asset("feeding-patent") })}><span><strong>Related intellectual property</strong><small>Intelligent aquaculture automatic feeding device · First inventor</small></span><ArrowUpRight size={19} /></button>
    </section>

    <section className="venture-section">
      <div className="venture-section-head"><span className="venture-kicker">05 / FROM DECK TO DISPLAY</span><h3>Product concepts in the real world</h3><p>Product concepts were taken beyond presentation decks into physical displays, industry engagement and external showcases.</p></div>
      <div className="venture-display-grid"><EvidenceFigure item={{ title: "Golden pomfret products on display", subtitle: "Physical product display · External showcase", image: asset("product-display") }} onViewEvidence={onViewEvidence} /><EvidenceFigure item={{ title: "Products presented to industry visitors", subtitle: "Industry engagement · Project exhibition", image: asset("industry-showcase") }} onViewEvidence={onViewEvidence} /></div>
    </section>

    <section className="venture-section">
      <div className="venture-impact-grid"><div><span className="venture-kicker">06 / FIELD IMPACT</span><h3>Social impact at scale</h3><p>Worked directly with communities across six villages in Guangdong, combining commercial development with cooperative engagement, industry outreach and rural-revitalisation activities.</p><p>The project was recognised as an early demonstration initiative under Guangdong’s “High-Quality Development Project for Counties, Towns and Villages.”</p></div><AnimatedEvidence name="rural-impact" title="Guangdong “High-Quality Development Project for Counties, Towns and Villages”" /></div>
    </section>

    <section className="venture-section venture-recognition">
      <span className="venture-kicker">07 / NATIONAL RECOGNITION</span>
      <div className="venture-recognition-grid"><AnimatedEvidence name="cctv" title="CCTV national coverage · 2023" /><div><h3>From local fieldwork<br />to national coverage</h3><p className="venture-recognition-lead">The only Guangdong team selected for CCTV’s national coverage, bringing the project’s rural-industry practice to a nationwide audience.</p><p>The project’s work on aquaculture, prepared-food development and rural revitalisation was brought to a national audience through CCTV coverage.</p></div></div>
      <div className="venture-award-heading"><h4>AWARD JOURNEY</h4><button type="button" className="venture-text-link" onClick={onViewAwards}>View all awards <Plus size={17} /></button></div>
      <AwardCards items={awards.slice(0, 4)} onViewEvidence={onViewEvidence} />
    </section>

    <section className="venture-section venture-film">
      <div className="venture-section-head"><span className="venture-kicker">08 / PROJECT FILM</span><h3>Watch the full story</h3></div>
      <VideoPlayer src="assets/materials/venture/project-film.mp4" poster={asset("product-display")} label="Golden pomfret venture project film" />
      <a className="venture-material-request" href={`mailto:tancan872@gmail.com?subject=${encodeURIComponent("Request project materials — " + project.title)}&body=${encodeURIComponent("Dear TAN Can,\n\nI would like to learn more about your golden-pomfret venture and request further project materials.\n\nName:\nAffiliation:\nPurpose of request:\n\nThank you.")}`}><span><strong>Request Further Project Materials ↗</strong><small>Reach out for further project details and presentation materials.</small></span><Mail size={20} /></a>
    </section>
  </div>;
}
