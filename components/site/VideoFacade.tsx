'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from './Icon';

interface VideoFacadeProps {
  url: string;
  title?: string;
  poster?: string;
}

export default function VideoFacade({ url, title = 'Video', poster }: VideoFacadeProps) {
  const [playing, setPlaying] = useState(false);

  // Parse YouTube
  const yt = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/.exec(url);
  // Parse Vimeo
  const vimeo = /vimeo\.com\/(\d+)/.exec(url);

  const ytId = yt ? yt[1] : null;
  const vimeoId = vimeo ? vimeo[1] : null;

  // Use YouTube high-res thumbnail if poster isn't provided
  const thumbnail = poster || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : '');

  if (playing) {
    if (ytId) {
      return (
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      );
    }
    if (vimeoId) {
      return (
        <iframe
          title={title}
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      );
    }
    return (
      <video
        src={url}
        controls
        autoPlay
        playsInline
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
      />
    );
  }

  return (
    <div
      className="video-facade"
      onClick={() => setPlaying(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setPlaying(true);
        }
      }}
      aria-label={`Play ${title}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        overflow: 'hidden',
        background: '#0a0b0e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          priority={false}
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, #20222a 0%, #0d0f14 100%)',
          }}
        />
      )}

      {/* Dim overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.38)',
          transition: 'background 200ms ease',
        }}
      />

      {/* Play button badge */}
      <div
        className="facade-play-btn"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 22px',
          background: 'var(--card, #171920)',
          border: '2px solid var(--y, #facc15)',
          color: 'var(--ink, #fff)',
          boxShadow: '4px 4px 0 var(--shadow, rgba(0,0,0,0.8))',
          fontWeight: 700,
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '0.86rem',
          letterSpacing: '0.04em',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--y, #facc15)',
            color: '#111216',
          }}
        >
          <Icon name="play" size={15} />
        </span>
        PLAY VIDEO
      </div>
    </div>
  );
}
