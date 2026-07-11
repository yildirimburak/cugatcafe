'use client';

import { useRef, useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const MAX_SCALE = 4;
const MIN_SCALE = 1;

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [zoomed, setZoomed] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Transform durumu re-render'a takılmadan akıcı olsun diye ref'te tutulur
  const view = useRef({ scale: 1, tx: 0, ty: 0 });

  const apply = () => {
    const el = imgRef.current;
    if (!el) return;
    const { scale, tx, ty } = view.current;
    el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
  };

  const clampTranslate = () => {
    const c = containerRef.current;
    if (!c) return;
    const { scale } = view.current;
    const maxX = ((scale - 1) * c.clientWidth) / 2;
    const maxY = ((scale - 1) * c.clientHeight) / 2;
    view.current.tx = Math.max(-maxX, Math.min(maxX, view.current.tx));
    view.current.ty = Math.max(-maxY, Math.min(maxY, view.current.ty));
  };

  const setView = (scale: number, tx: number, ty: number, animate = false) => {
    view.current.scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
    view.current.tx = tx;
    view.current.ty = ty;
    clampTranslate();
    const el = imgRef.current;
    if (el) el.style.transition = animate ? 'transform 0.25s ease-out' : 'none';
    apply();
    setZoomed(view.current.scale > 1.01);
  };

  // Bir odak noktası (container merkezine göre) etrafında yakınlaştır
  const zoomTo = (newScale: number, fx: number, fy: number, animate = false) => {
    const s = view.current.scale;
    const s2 = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    const ratio = s2 / s;
    const tx = fx - ratio * (fx - view.current.tx);
    const ty = fy - ratio * (fy - view.current.ty);
    setView(s2, tx, ty, animate);
  };

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;

    // Arka plan sayfasının kaymasını engelle
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const center = () => {
      const r = c.getBoundingClientRect();
      return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    };
    const dist = (a: Touch, b: Touch) =>
      Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    let mode: 'none' | 'pan' | 'pinch' = 'none';
    let startDist = 0;
    let startScale = 1;
    let startMid = { x: 0, y: 0 };
    let startT = { x: 0, y: 0 };
    let panStart = { x: 0, y: 0 };
    let panT0 = { x: 0, y: 0 };
    let lastTap = 0;
    let moved = false;

    // ---- Touch (mobil) ----
    const onTouchStart = (e: TouchEvent) => {
      setShowHint(false);
      if (e.touches.length === 2) {
        mode = 'pinch';
        moved = true;
        startDist = dist(e.touches[0], e.touches[1]);
        startScale = view.current.scale;
        const { cx, cy } = center();
        startMid = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - cx,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - cy,
        };
        startT = { x: view.current.tx, y: view.current.ty };
      } else if (e.touches.length === 1) {
        moved = false;
        if (view.current.scale > 1.01) {
          mode = 'pan';
          panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          panT0 = { x: view.current.tx, y: view.current.ty };
        } else {
          mode = 'none';
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (mode === 'pinch' && e.touches.length === 2) {
        e.preventDefault();
        const d = dist(e.touches[0], e.touches[1]);
        const s2 = Math.max(MIN_SCALE, Math.min(MAX_SCALE, (startScale * d) / startDist));
        const { cx, cy } = center();
        const mid = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - cx,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - cy,
        };
        const ratio = s2 / startScale;
        const tx = startMid.x - ratio * (startMid.x - startT.x) + (mid.x - startMid.x);
        const ty = startMid.y - ratio * (startMid.y - startT.y) + (mid.y - startMid.y);
        setView(s2, tx, ty);
      } else if (mode === 'pan' && e.touches.length === 1) {
        e.preventDefault();
        const dx = e.touches[0].clientX - panStart.x;
        const dy = e.touches[0].clientY - panStart.y;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
        setView(view.current.scale, panT0.x + dx, panT0.y + dy);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      // Çift dokunma: tek parmak, hareketsiz
      if (mode !== 'pinch' && !moved && e.changedTouches.length === 1) {
        const now = Date.now();
        if (now - lastTap < 300) {
          const { cx, cy } = center();
          const fx = e.changedTouches[0].clientX - cx;
          const fy = e.changedTouches[0].clientY - cy;
          if (view.current.scale > 1.01) setView(1, 0, 0, true);
          else zoomTo(2.5, fx, fy, true);
          lastTap = 0;
        } else {
          lastTap = now;
        }
      }
      if (e.touches.length === 0) mode = 'none';
    };

    // ---- Fare (masaüstü) ----
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setShowHint(false);
      const { cx, cy } = center();
      const fx = e.clientX - cx;
      const fy = e.clientY - cy;
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      zoomTo(view.current.scale * factor, fx, fy);
    };

    let mouseDown = false;
    let mStart = { x: 0, y: 0 };
    let mT0 = { x: 0, y: 0 };
    const onMouseDown = (e: MouseEvent) => {
      if (view.current.scale <= 1.01) return;
      mouseDown = true;
      mStart = { x: e.clientX, y: e.clientY };
      mT0 = { x: view.current.tx, y: view.current.ty };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDown) return;
      e.preventDefault();
      setView(view.current.scale, mT0.x + (e.clientX - mStart.x), mT0.y + (e.clientY - mStart.y));
    };
    const onMouseUp = () => { mouseDown = false; };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };

    c.addEventListener('touchstart', onTouchStart, { passive: false });
    c.addEventListener('touchmove', onTouchMove, { passive: false });
    c.addEventListener('touchend', onTouchEnd, { passive: false });
    c.addEventListener('wheel', onWheel, { passive: false });
    c.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      c.removeEventListener('touchstart', onTouchStart);
      c.removeEventListener('touchmove', onTouchMove);
      c.removeEventListener('touchend', onTouchEnd);
      c.removeEventListener('wheel', onWheel);
      c.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const handleDoubleClick = (e: React.MouseEvent) => {
    const c = containerRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const fx = e.clientX - (r.left + r.width / 2);
    const fy = e.clientY - (r.top + r.height / 2);
    if (view.current.scale > 1.01) setView(1, 0, 0, true);
    else zoomTo(2.5, fx, fy, true);
  };

  // Arka plana (resim dışına) tıklayınca kapat
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current && view.current.scale <= 1.01) {
      onClose();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleBackdropClick}
      onDoubleClick={handleDoubleClick}
      className="fixed inset-0 z-[60] bg-black flex items-center justify-center overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Kapat butonu */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
        aria-label="Kapat"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        className="max-w-full max-h-full object-contain will-change-transform"
        style={{ transformOrigin: 'center center', cursor: zoomed ? 'grab' : 'zoom-in' }}
      />

      {/* İpucu */}
      {showHint && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium pointer-events-none transition-opacity">
          Çift dokun veya parmaklarınla yakınlaştır
        </div>
      )}
    </div>
  );
}
