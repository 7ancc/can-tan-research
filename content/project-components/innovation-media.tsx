"use client";

import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import type { Evidence } from "./project-content";
import { VideoPlayer } from "./video-player";

export function ProjectFigure({ item, onView, className = "" }: { item: Evidence; onView: (item: Evidence) => void; className?: string }) {
  return <figure className={`innovation-figure ${className}`}><button type="button" onClick={() => onView(item)} aria-label={`Enlarge ${item.title}`}><img src={item.image} alt={item.title} loading="lazy"/><ArrowUpRight size={16}/></button><figcaption><strong>{item.title}</strong><span>{item.subtitle}</span></figcaption></figure>;
}

export function ProjectVideo({ name, title, caption }: { name: string; title: string; caption: string }) {
  const [playing, setPlaying] = useState(false);
  return <figure className="innovation-video">{playing ? <VideoPlayer src={`assets/materials/seedling/${name}.mp4`} poster={`assets/materials/seedling/${name}-poster.webp`} label={title} autoPlay/> : <button type="button" onClick={() => setPlaying(true)} aria-label={`Watch ${title}`}><img src={`assets/materials/seedling/${name}-poster.webp`} alt={title} loading="lazy"/><span><Play size={17} fill="currentColor"/> Watch {title}</span></button>}<figcaption><strong>{title}</strong><span>{caption}</span></figcaption></figure>;
}
