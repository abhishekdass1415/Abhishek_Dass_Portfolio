'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Icon } from './Icon';

interface GalleryModalProps {
  images: string[];
  initialIndex?: number;
  altPrefix?: string;
  onClose: () => void;
}

export function GalleryModal({ images, initialIndex = 0, altPrefix = 'Photo', onClose }: GalleryModalProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Zoom relative to a focal point (e.g. mouse cursor position)
  const zoomAtPoint = useCallback((nextScaleVal: number, clientX?: number, clientY?: number) => {
    setScale((prevScale) => {
      const nextScale = Math.min(4.5, Math.max(1, +nextScaleVal.toFixed(2)));
      if (nextScale === 1) {
        setOffset({ x: 0, y: 0 });
        return 1;
      }

      if (clientX !== undefined && clientY !== undefined && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Mouse position relative to center of the viewport container
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = clientX - centerX;
        const mouseY = clientY - centerY;

        // Calculate offset so the point under cursor remains stationary
        const ratio = nextScale / prevScale;
        setOffset((prevOffset) => ({
          x: mouseX - (mouseX - prevOffset.x) * ratio,
          y: mouseY - (mouseY - prevOffset.y) * ratio,
        }));
      }
      return nextScale;
    });
  }, []);

  const zoomIn = useCallback((clientX?: number, clientY?: number) => {
    zoomAtPoint(scale + 0.4, clientX, clientY);
  }, [scale, zoomAtPoint]);

  const zoomOut = useCallback((clientX?: number, clientY?: number) => {
    zoomAtPoint(scale - 0.4, clientX, clientY);
  }, [scale, zoomAtPoint]);

  const prev = useCallback(() => {
    resetZoom();
    setCurrent((c) => (c > 0 ? c - 1 : images.length - 1));
  }, [images.length, resetZoom]);

  const next = useCallback(() => {
    resetZoom();
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length, resetZoom]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (scale === 1) {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      }
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-' || e.key === '_') zoomOut();
      if (e.key === '0') resetZoom();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('lightbox-open');
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      document.body.classList.remove('lightbox-open');
    };
  }, [onClose, prev, next, scale, zoomIn, zoomOut, resetZoom]);

  // Handle wheel / touchpad pinch zoom towards cursor
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const factor = e.deltaY < 0 ? 0.35 : -0.35;
    zoomAtPoint(scale + factor, e.clientX, e.clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || scale <= 1) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  if (!images.length) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(8, 9, 12, 0.94)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Lightbox Topbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(10, 11, 14, 0.95)',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <div className="mono" style={{ color: 'var(--y)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>PHOTO {current + 1} / {images.length}</span>
          <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>(click anywhere outside to close)</span>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {/* Zoom controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginRight: '6px',
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              disabled={scale <= 1}
              style={{
                background: 'transparent',
                border: 'none',
                color: scale <= 1 ? 'var(--muted)' : 'var(--ink)',
                padding: '6px 12px',
                cursor: scale <= 1 ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '15px',
              }}
              title="Zoom out (-)"
            >
              −
            </button>
            <span
              className="mono"
              style={{
                fontSize: '0.78rem',
                padding: '0 6px',
                minWidth: '48px',
                textAlign: 'center',
                color: 'var(--y)',
              }}
            >
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              disabled={scale >= 4}
              style={{
                background: 'transparent',
                border: 'none',
                color: scale >= 4 ? 'var(--muted)' : 'var(--ink)',
                padding: '6px 12px',
                cursor: scale >= 4 ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '15px',
              }}
              title="Zoom in (+)"
            >
              +
            </button>
            {scale > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetZoom();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderLeft: '1px solid var(--line)',
                  color: 'var(--y)',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
                title="Reset zoom (0)"
              >
                Reset
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="btn btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            aria-label="Close lightbox"
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Main image container with backdrop click-to-close & wheel/touchpad zoom */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-out',
          overflow: 'hidden',
          userSelect: 'none',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={(e) => {
          if (scale === 1 && e.target === e.currentTarget) onClose();
        }}
      >
        {/* Floating prominent close button in corner */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.5rem',
            zIndex: 30,
            background: 'var(--card)',
            color: 'var(--ink)',
            border: '2px solid var(--y)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            fontSize: '18px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
          }}
          title="Close (ESC)"
          aria-label="Close"
        >
          ✕
        </button>

        {images.length > 1 && scale === 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="lightbox-arrow"
            style={{
              position: 'absolute',
              left: '1.5rem',
              zIndex: 20,
              background: 'var(--card)',
              color: 'var(--ink)',
              border: '2px solid var(--line)',
              padding: '12px 14px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 800,
            }}
            aria-label="Previous image"
          >
            <Icon name="arrowRight" size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
        )}

        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1100px',
            height: '100%',
            maxHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
          }}
          onClick={(e) => {
            if (scale === 1 && e.target === e.currentTarget) onClose();
          }}
        >
          {/\.(mp4|webm|mov|ogg)$/i.test(images[current]) ? (
            <video
              src={images[current]}
              controls
              autoPlay
              playsInline
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '4px',
                border: '2px solid var(--line)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={images[current]}
              alt={`${altPrefix} ${current + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                if (scale === 1) {
                  zoomIn(e.clientX, e.clientY);
                }
              }}
              draggable={false}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '4px',
                border: '2px solid var(--line)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transition: dragging ? 'none' : 'transform 180ms ease-out',
                transformOrigin: 'center center',
                cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
              }}
            />
          )}
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="lightbox-arrow"
            style={{
              position: 'absolute',
              right: '1.5rem',
              zIndex: 20,
              background: 'var(--card)',
              color: 'var(--ink)',
              border: '2px solid var(--line)',
              padding: '12px 14px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 800,
            }}
            aria-label="Next image"
          >
            <Icon name="arrowRight" size={18} />
          </button>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            padding: '1rem',
            overflowX: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0,0,0,0.5)',
          }}
        >
          {images.map((img, i) => {
            const isVid = /\.(mp4|webm|mov|ogg)$/i.test(img);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                style={{
                  width: '64px',
                  height: '44px',
                  padding: 0,
                  border: i === current ? '2px solid var(--y)' : '1px solid rgba(255,255,255,0.2)',
                  background: '#000',
                  cursor: 'pointer',
                  opacity: i === current ? 1 : 0.6,
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                {isVid ? (
                  <video src={img} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function InteractiveGallery({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.2rem',
        }}
      >
        {images.map((imgUrl, idx) => {
          const isVid = /\.(mp4|webm|mov|ogg)$/i.test(imgUrl);
          return (
            <div
              key={idx}
              className="card gallery-thumb-card"
              onClick={() => setOpenIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpenIndex(idx);
                }
              }}
              aria-label={`Open media ${idx + 1} in fullscreen`}
              style={{
                overflow: 'hidden',
                padding: 0,
                cursor: 'zoom-in',
                position: 'relative',
                aspectRatio: '16 / 10',
                background: '#0c0d10',
              }}
            >
              {isVid ? (
                <video
                  src={imgUrl}
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Image
                  src={imgUrl}
                  alt={`${title} photo ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: 'cover', transition: 'transform 300ms ease' }}
                />
              )}
              <div
                className="gallery-hover-indicator mono"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.75)',
                  color: 'var(--y)',
                  padding: '4px 8px',
                  fontSize: '0.72rem',
                  border: '1px solid var(--y)',
                  borderRadius: '3px',
                }}
              >
                {isVid ? '▶ Video Clip' : '🔍 Click to zoom'}
              </div>
            </div>
          );
        })}
      </div>

      {openIndex !== null && (
        <GalleryModal
          images={images}
          initialIndex={openIndex}
          altPrefix={title}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
