import React, { useRef, useState, useEffect } from 'react';
// @ts-expect-error - vendored ThreeUI renderer
import { createBookshelfRenderer } from './bookshelfRenderer.js';

export interface BookRecord {
  id: string;
  title: string;
  roman: string;
  discipline: string;
  note: string;
  deck: string;
  binding: string;
  format: string;
  theme: string;
  color: string;
  foil: string;
  chapters: string[];
}

export interface BookshelfSceneProps {
  className?: string;
  onSelectBook?: (index: number, book: BookRecord) => void;
  onOpenBook?: (index: number, book: BookRecord) => void;
  initialIndex?: number;
}

export const BookshelfScene: React.FC<BookshelfSceneProps> = ({
  className = '',
  onSelectBook,
  onOpenBook,
  initialIndex = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let disposed = false;
    let rendererInstance: any = null;

    try {
      rendererInstance = createBookshelfRenderer(container, canvas, {
        initialIndex,
        onReady: () => {
          if (!disposed) setStatus('ready');
        },
        onError: (err: string | Error) => {
          if (!disposed) {
            setErrorMessage(typeof err === 'string' ? err : err.message);
            setStatus('unavailable');
          }
        },
        onSelectionChange: (info: { index: number; total: number; title: string }) => {
          if (!disposed && onSelectBook) {
            onSelectBook(info.index, info as any);
          }
        },
        onOpenBook: (index: number, book: any) => {
          if (!disposed && onOpenBook) {
            onOpenBook(index, book);
          }
        },
      });

      rendererInstance.ready?.catch((err: any) => {
        if (!disposed) {
          setErrorMessage(err instanceof Error ? err.message : 'Unknown renderer error');
          setStatus('unavailable');
        }
      });
    } catch (err: any) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to initialize 3D Bookshelf');
      setStatus('unavailable');
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      rendererInstance?.resize?.();
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      try {
        rendererInstance?.dispose?.();
      } catch (disposeErr) {
        console.warn('Error during BookshelfRenderer disposal:', disposeErr);
      }
    };
  }, [initialIndex, onOpenBook, onSelectBook]);

  return (
    <div
      className={`bookshelf-wrapper ${className}`}
      ref={containerRef}
      data-state={status}
      tabIndex={0}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#0B0D10',
      }}
    >
      <canvas
        ref={canvasRef}
        className={`bookshelf__canvas ${status === 'ready' ? 'is-ready' : ''}`}
        aria-label="Thư viện 3D Giáo trình Triết học Mác - Lênin Chương 5"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          outline: 'none',
        }}
      />

      {/* Embedded UI controls required by ThreeUI Bookshelf source */}
      <div className="bookshelf__source-controls" aria-hidden="true" style={{ display: 'none' }}>
        <div id="loading" hidden />
        <p id="fallback-status" />
        <section id="browse-ui" />
        <aside id="detail-panel">
          <div className="detail-controls">
            <p className="microcopy" />
          </div>
        </aside>
        <span id="selection-title" />
        <span id="selection-note" />
        <span id="counter" />
        <span id="palette-label" />
        <div id="markers" />
        <button id="previous" type="button" />
        <button id="next" type="button" />
        <button id="inspect" type="button" />
        <button id="close-detail" type="button" />
        <button id="reset-view" type="button" />
        <button id="toggle-book" type="button" />
        <button id="previous-page" type="button" />
        <button id="next-page" type="button" />
        <span id="page-label" />
        <span id="page-counter" />
        <span id="detail-eyebrow" />
        <span id="detail-title" />
        <span id="detail-deck" />
        <span id="detail-binding" />
        <span id="detail-format" />
        <span id="detail-theme" />
        <span id="detail-motif" />
        <span id="live-region" />
        <span id="pointer-label">
          <span id="pointer-label-index" />
          <span id="pointer-label-title" />
        </span>
      </div>

      {status === 'unavailable' && (
        <div
          className="bookshelf__unavailable-fallback"
          role="status"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#F5F0E8',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Không thể tải giao diện 3D WebGL ({errorMessage || 'Không hỗ trợ ngữ cảnh đồ họa'}).
          </p>
          <p style={{ color: '#C8A86A', fontSize: '0.95rem' }}>
            Chuyển sang chế độ trình bày an toàn (2D Safe Mode).
          </p>
        </div>
      )}
    </div>
  );
};
