"use client";

import { useRef, useState } from "react";
import type { VideoHTMLAttributes } from "react";

type VideoPlayerProps = {
  src: string;
  label: string;
  poster: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: VideoHTMLAttributes<HTMLVideoElement>["preload"];
};

function timeLabel(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export function VideoPlayer({ src, label, poster, autoPlay = false, muted = false, loop = false, preload = "metadata" }: VideoPlayerProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const readDuration = () => {
    const value = video.current?.duration;
    if (value && Number.isFinite(value)) setDuration(value);
  };
  return <div className="portfolio-video-player">
    <video ref={video} src={src} controls controlsList="nodownload" draggable={false} onContextMenu={event => event.preventDefault()} playsInline autoPlay={autoPlay} muted={muted} loop={loop} preload={preload} poster={poster} aria-label={label} onLoadedMetadata={readDuration} onDurationChange={readDuration} onTimeUpdate={() => setPosition(video.current?.currentTime ?? 0)} onSeeked={() => setPosition(video.current?.currentTime ?? 0)} />
    <div className="portfolio-video-timeline">
      <span aria-hidden="true">{timeLabel(position)}</span>
      <input type="range" min="0" max={duration || 1} step="0.1" value={Math.min(position, duration)} disabled={!duration} aria-label={`${label} playback position`} aria-valuetext={`${timeLabel(position)} of ${timeLabel(duration)}`} onChange={event => {
        const target = Number(event.currentTarget.value);
        if (video.current && duration) {
          video.current.currentTime = target;
          setPosition(target);
        }
      }} />
      <span aria-hidden="true">{duration ? timeLabel(duration) : "—:—"}</span>
    </div>
  </div>;
}
