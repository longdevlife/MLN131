import React, { useRef, useState, useEffect } from 'react';
// @ts-expect-error - vendored ThreeUI renderer
import { createBookshelfRenderer } from './bookshelfRenderer.js';
import { ensureBookshelfFonts } from './fontLoader';
import { usePresentationStore } from '../../../state/presentationStore';

declare global {
  interface Window {
    bookshelfRendererCreated?: number;
    bookshelfRendererDisposed?: number;
    __BOOKSHELF_DEBUG__?: {
      getSnapshot: () => {
        mode: 'hero' | 'opening' | 'detail' | 'closing';
        selectedIndex: number;
        settled: boolean;
      } | null;
      getBookScreenPosition: (index: number) => {
        x: number;
        y: number;
        visible: boolean;
      } | null;
    };
  }
}

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
  onModeChange?: (mode: 'hero' | 'opening' | 'detail' | 'closing') => void;
  initialIndex?: number;
}

export const BookshelfScene: React.FC<BookshelfSceneProps> = ({
  className = '',
  onSelectBook,
  onOpenBook,
  onModeChange,
  initialIndex = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<any>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  // Diagnostic & stable attributes
  const [mode, setMode] = useState<'hero' | 'opening' | 'detail' | 'closing'>('hero');
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [isSettled, setIsSettled] = useState(true);

  // Stable callbacks using refs to prevent renderer recreation
  const onSelectBookRef = useRef(onSelectBook);
  onSelectBookRef.current = onSelectBook;
  const onOpenBookRef = useRef(onOpenBook);
  onOpenBookRef.current = onOpenBook;
  const onModeChangeRef = useRef(onModeChange);
  onModeChangeRef.current = onModeChange;

  // Stale initial index fix: desiredIndexRef refreshed on EVERY render
  const desiredIndexRef = useRef(initialIndex);
  desiredIndexRef.current = initialIndex;

  const isFirstMount = useRef(true);

  // Unified pending navigation intent listener from presentationStore
  const pendingNav = usePresentationStore((state) => state.pendingBookshelfNavigation);
  const clearPendingNav = usePresentationStore((state) => state.clearPendingBookshelfNavigation);

  useEffect(() => {
    if (pendingNav && rendererRef.current?.requestNavigation) {
      rendererRef.current.requestNavigation(pendingNav);
      clearPendingNav();
    }
  }, [pendingNav, clearPendingNav]);

  // Helper to sync container attributes directly without unnecessary React re-renders
  const updateContainerAttrs = (attrs: {
    mode?: string;
    selectedIndex?: number;
    settled?: boolean;
  }) => {
    const el = containerRef.current;
    if (!el) return;
    if (attrs.mode !== undefined) {
      el.setAttribute('data-bookshelf-mode', attrs.mode);
    }
    if (attrs.selectedIndex !== undefined) {
      el.setAttribute('data-bookshelf-selected-index', String(attrs.selectedIndex));
    }
    if (attrs.settled !== undefined) {
      el.setAttribute('data-bookshelf-settled', String(attrs.settled));
    }
  };

  // Initialize renderer exactly once per mount
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let disposed = false;

    // Track lifecycle counters
    if (typeof window !== 'undefined') {
      window.bookshelfRendererCreated = (window.bookshelfRendererCreated || 0) + 1;
    }

    const initRenderer = async () => {
      try {
        await ensureBookshelfFonts();
        if (disposed) return;

        const renderer = createBookshelfRenderer(container, canvas, {
          initialIndex: desiredIndexRef.current,
          onReady: () => {
            if (!disposed) {
              setStatus('ready');
              updateContainerAttrs({
                mode: 'hero',
                selectedIndex: desiredIndexRef.current ?? 0,
                settled: true,
              });
              if (rendererRef.current && desiredIndexRef.current !== undefined) {
                rendererRef.current.selectVolume(desiredIndexRef.current, true);
                setSelectedIndex(desiredIndexRef.current);
              }
            }
          },
          onError: (err: string | Error) => {
            if (!disposed) {
              setErrorMessage(typeof err === 'string' ? err : err.message);
              setStatus('unavailable');
            }
          },
          onModeChange: (newMode: 'hero' | 'opening' | 'detail' | 'closing') => {
            if (!disposed) {
              setMode(newMode);
              updateContainerAttrs({ mode: newMode });
              onModeChangeRef.current?.(newMode);
            }
          },
          onSelectionChange: (info: { index: number; total: number; title: string }) => {
            if (!disposed) {
              setSelectedIndex(info.index);
              updateContainerAttrs({ selectedIndex: info.index });
              if (onSelectBookRef.current) {
                onSelectBookRef.current(info.index, info as any);
              }
            }
          },
          onSettledChange: (settled: boolean) => {
            if (!disposed) {
              setIsSettled(settled);
              updateContainerAttrs({ settled });
              usePresentationStore.getState().setShelfSettled(settled);
            }
          },
          onOpenBook: (index: number, book: any) => {
            if (!disposed && onOpenBookRef.current) {
              onOpenBookRef.current(index, book);
            }
          },
          onOpenCover: () => {
            if (!disposed) {
              usePresentationStore.getState().openCover();
            }
          },
        });

        rendererRef.current = renderer;

        // Expose ONLY read-only diagnostics to window.__BOOKSHELF_DEBUG__
        if (typeof window !== 'undefined') {
          window.__BOOKSHELF_DEBUG__ = {
            getSnapshot: () => {
              if (!rendererRef.current) return null;
              return rendererRef.current.getSnapshot?.() ?? {
                mode,
                selectedIndex,
                settled: isSettled,
              };
            },
            getBookScreenPosition: (idx: number) => {
              return rendererRef.current?.getBookScreenPosition?.(idx) ?? null;
            },
          };
        }

        renderer.ready?.catch((err: any) => {
          if (!disposed) {
            setErrorMessage(err instanceof Error ? err.message : 'Unknown renderer error');
            setStatus('unavailable');
          }
        });
      } catch (err: any) {
        if (!disposed) {
          setErrorMessage(err instanceof Error ? err.message : 'Failed to initialize 3D Bookshelf');
          setStatus('unavailable');
        }
      }
    };

    initRenderer();

    const resizeObserver = new ResizeObserver(() => {
      rendererRef.current?.resize?.();
    });
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      if (typeof window !== 'undefined') {
        window.bookshelfRendererDisposed = (window.bookshelfRendererDisposed || 0) + 1;
        delete window.__BOOKSHELF_DEBUG__;
      }
      resizeObserver.disconnect();
      // Ensure store does not retain stale non-hero mode or settled false when unmounting
      usePresentationStore.getState().setBookshelfMode('hero');
      usePresentationStore.getState().setShelfSettled(true);
      try {
        rendererRef.current?.dispose?.();
        rendererRef.current = null;
      } catch (disposeErr) {
        console.warn('Error during BookshelfRenderer disposal:', disposeErr);
      }
    };
  }, []); // Run ONCE on mount

  // Sync volume change without re-creating WebGL renderer (NORMAL SELECTION MUST BE SMOOTH: immediate = false)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (rendererRef.current?.selectVolume) {
      const currentVol = rendererRef.current.getSelectedVolume?.();
      if (currentVol !== initialIndex) {
        rendererRef.current.selectVolume(initialIndex, false);
        setSelectedIndex(initialIndex);
      }
    }
  }, [initialIndex]);

  return (
    <div
      className={`bookshelf-wrapper ${className}`}
      ref={containerRef}
      data-state={status}
      data-bookshelf-mode={mode}
      data-bookshelf-selected-index={selectedIndex}
      data-bookshelf-settled={String(isSettled)}
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
        aria-label="Thư viện 3D Giáo trình Chủ nghĩa xã hội khoa học Chương 5"
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
