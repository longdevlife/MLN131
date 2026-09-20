import React, { useState, useEffect, useMemo } from 'react';
import { usePresentationStore } from '../state/presentationStore';
import { chapters } from '../content/chapters';
import { selectCurrentChapter, selectCurrentScene, selectCurrentBeat, selectNextScene } from '../state/selectors';
import { PresentationChannel } from './broadcast';
import {
  SkipBack,
  SkipForward,
  Clock,
  EyeOff,
  Library,
} from 'lucide-react';

export const PresenterConsole: React.FC = () => {
  const viewMode = usePresentationStore((state) => state.viewMode);
  const chapterIndex = usePresentationStore((state) => state.chapterIndex);
  const sceneIndex = usePresentationStore((state) => state.sceneIndex);
  const beatIndex = usePresentationStore((state) => state.beatIndex);
  const isBlackout = usePresentationStore((state) => state.isBlackout);

  const next = usePresentationStore((state) => state.next);
  const prev = usePresentationStore((state) => state.prev);
  const toggleBlackout = usePresentationStore((state) => state.toggleBlackout);
  const openLibrary = usePresentationStore((state) => state.openLibrary);
  const jumpToChapter = usePresentationStore((state) => state.jumpToChapter);

  const experienceMode = usePresentationStore((state) => state.experienceMode);
  const selectedBook = usePresentationStore((state) => state.selectedBook);
  const magazinePage = usePresentationStore((state) => state.magazinePage);
  const magazineViewMode = usePresentationStore((state) => state.magazineViewMode);
  const closeMagazine = usePresentationStore((state) => state.closeMagazine);

  const currentChapter = usePresentationStore(selectCurrentChapter);
  const currentScene = usePresentationStore(selectCurrentScene);
  const currentBeat = usePresentationStore(selectCurrentBeat);
  const nextScene = usePresentationStore(selectNextScene);

  // Broadcast channel for sync
  const channel = useMemo(() => new PresentationChannel(), []);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [clearingCache, setClearingCache] = useState(false);

  const handleClearOfflineCache = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ bộ nhớ đệm offline và làm mới ứng dụng?')) {
      return;
    }
    setClearingCache(true);
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
      }
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error('Failed to clear cache:', err);
      window.location.reload();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((sec) => sec + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Broadcast whenever state changes
  useEffect(() => {
    channel.postState({
      viewMode,
      chapterIndex,
      sceneIndex,
      beatIndex,
      isBlackout,
      experienceMode,
      selectedBook,
      magazinePage,
      magazineViewMode,
    });
  }, [channel, viewMode, chapterIndex, sceneIndex, beatIndex, isBlackout, experienceMode, selectedBook, magazinePage, magazineViewMode]);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      className="presenter-console"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0B0D10',
        color: '#F5F0E8',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header bar */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          background: '#171A24',
          borderBottom: '1px solid #3A2118',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              fontFamily: 'serif',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#C8A86A',
            }}
          >
            BẢNG ĐIỀU KHIỂN DIỄN GIẢ (PRESENTER CONSOLE)
          </span>
          <span
            style={{
              background: '#24344A',
              color: '#9FB3C9',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
            }}
          >
            BroadcastChannel: ĐỒNG BỘ TRỰC TIẾP
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '1.2rem',
              fontFamily: 'monospace',
              color: '#F5F0E8',
            }}
          >
            <Clock size={18} color="#C87046" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <button
            type="button"
            onClick={() => setSecondsElapsed(0)}
            title="Đặt lại đồng hồ"
            style={{
              background: 'transparent',
              border: '1px solid #3A2118',
              color: '#EDE4D6',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main split grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
        {/* Left column: Current slide details & Speaker notes */}
        <div
          style={{
            padding: '24px',
            borderRight: '1px solid #3A2118',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
          }}
        >
          {experienceMode === 'magazine' ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#C8A86A', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600 }}>
                  TẠP CHÍ 3D (ĐANG CHIẾU)
                </span>
                <span style={{ fontFamily: 'monospace', color: '#9FB3C9', fontSize: '0.85rem' }}>
                  Trang: {magazinePage} / 3
                </span>
              </div>

              <div
                style={{
                  background: '#10131B',
                  border: '1px solid #3A2118',
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
                <div style={{ color: '#C8A86A', fontSize: '0.9rem', marginBottom: '4px' }}>
                  QUYỂN I
                </div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontFamily: 'serif', color: '#F5F0E8' }}>
                  Cơ cấu xã hội – giai cấp
                </h2>
                <p style={{ margin: 0, color: '#EDE4D6', opacity: 0.85 }}>
                  Chế độ: <strong style={{ color: '#C8A86A' }}>{magazineViewMode === 'reading' ? 'Reading' : 'Showcase'}</strong>
                </p>
              </div>

              {/* Speaker notes section for Magazine */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#C8A86A', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                  GHI CHÚ DIỄN GIẢ (TẠP CHÍ M0)
                </span>
                <div
                  style={{
                    flex: 1,
                    background: '#171A24',
                    border: '1px solid #3A2118',
                    borderRadius: '8px',
                    padding: '16px',
                    color: '#F5F0E8',
                    lineHeight: 1.6,
                    fontSize: '1.05rem',
                  }}
                >
                  <p style={{ color: 'rgba(245, 240, 232, 0.85)', margin: 0 }}>
                    {magazinePage === 0 && 'Bìa Quyển I: Giới thiệu chuyên đề Cơ cấu xã hội – giai cấp và liên minh giai cấp, tầng lớp.'}
                    {magazinePage === 1 && 'Trang 1: Khái niệm và vị trí của cơ cấu xã hội – giai cấp trong hệ thống xã hội.'}
                    {magazinePage === 2 && 'Trang 2: Sự biến đổi của cơ cấu xã hội – giai cấp trong thời kỳ quá độ lên CNXH.'}
                    {magazinePage === 3 && 'Bìa sau: Tóm lược ý nghĩa thực tiễn và liên minh giai cấp tại Việt Nam.'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#C8A86A', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600 }}>
                  CẢNH HIỆN TẠI (ĐANG CHIẾU)
                </span>
                <span style={{ fontFamily: 'monospace', color: '#9FB3C9', fontSize: '0.85rem' }}>
                  Quyển {currentChapter?.roman} · Cảnh {sceneIndex + 1}/{currentChapter?.scenes.length} · Nhịp {beatIndex + 1}/{currentScene?.beats.length}
                </span>
              </div>

              <div
                style={{
                  background: '#10131B',
                  border: '1px solid #3A2118',
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
                <div style={{ color: '#C8A86A', fontSize: '0.9rem', marginBottom: '4px' }}>
                  {currentScene?.kicker}
                </div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', fontFamily: 'serif', color: '#F5F0E8' }}>
                  {currentScene?.title}
                </h2>
                <p style={{ margin: 0, color: '#EDE4D6', opacity: 0.85 }}>
                  {currentScene?.subtitle}
                </p>
                {currentBeat?.label && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '6px 12px',
                      background: 'rgba(200, 112, 70, 0.15)',
                      border: '1px solid rgba(200, 112, 70, 0.4)',
                      borderRadius: '4px',
                      color: '#C87046',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    Nhịp đang phát: {currentBeat.label}
                  </div>
                )}
              </div>

              {/* Speaker notes section */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#C8A86A', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                  GHI CHÚ DIỄN GIẢ (SPEAKER NOTES)
                </span>
                <div
                  style={{
                    flex: 1,
                    background: '#171A24',
                    border: '1px solid #3A2118',
                    borderRadius: '8px',
                    padding: '16px',
                    color: '#F5F0E8',
                    lineHeight: 1.6,
                    fontSize: '1.05rem',
                  }}
                >
                  {currentBeat?.speakerNote && (
                    <div
                      style={{
                        background: 'rgba(200, 168, 106, 0.12)',
                        borderLeft: '3px solid #C8A86A',
                        padding: '8px 12px',
                        marginBottom: '12px',
                        borderRadius: '0 4px 4px 0',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#C8A86A', fontWeight: 700 }}>
                        Ghi chú nhịp hiện tại:
                      </div>
                      <div style={{ fontSize: '1rem', color: '#FFFFFF', marginTop: '2px' }}>
                        {currentBeat.speakerNote}
                      </div>
                    </div>
                  )}

                  {currentScene?.speakerNotes && currentScene.speakerNotes.length > 0 ? (
                    <div>
                      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9FB3C9', marginBottom: '6px', fontWeight: 600 }}>
                        Ghi chú toàn cảnh:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {currentScene.speakerNotes.map((note, i) => (
                          <li key={i} style={{ marginBottom: '6px' }}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  ) : !currentBeat?.speakerNote ? (
                    <p style={{ color: 'rgba(245, 240, 232, 0.4)', fontStyle: 'italic', margin: 0 }}>
                      Không có ghi chú thêm cho cảnh này.
                    </p>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right column: Next slide preview & Control panel */}
        <div
          style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto',
          }}
        >
          {/* Next Beat / Next Scene Preview */}
          <div>
            <span style={{ color: '#9FB3C9', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              BƯỚC TIẾP THEO (PREVIEW)
            </span>
            <div
              style={{
                background: '#10131B',
                border: '1px solid #24344A',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              {experienceMode === 'magazine' ? (
                <div>
                  <div style={{ color: '#C8A86A', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                    Trang tạp chí kế tiếp:
                  </div>
                  <div style={{ fontSize: '1.05rem', color: '#F5F0E8', fontWeight: 600, marginTop: '4px' }}>
                    {magazinePage < 3 ? `Trang ${magazinePage + 1} / 3` : 'Đã đến trang cuối (Bìa sau)'}
                  </div>
                </div>
              ) : (
                <>
                  {currentScene?.beats && beatIndex + 1 < currentScene.beats.length ? (
                    <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #24344A' }}>
                      <div style={{ color: '#C8A86A', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                        Nhịp kế tiếp (Space):
                      </div>
                      <div style={{ fontSize: '1.05rem', color: '#F5F0E8', fontWeight: 600, marginTop: '2px' }}>
                        {currentScene.beats[beatIndex + 1]?.label}
                      </div>
                    </div>
                  ) : null}

                  {nextScene ? (
                    <>
                      <div style={{ color: '#9FB3C9', fontSize: '0.8rem', marginBottom: '4px' }}>
                        Cảnh tiếp theo: {nextScene.kicker}
                      </div>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontFamily: 'serif', color: '#EDE4D6' }}>
                        {nextScene.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(237, 228, 214, 0.7)' }}>
                        {nextScene.subtitle}
                      </p>
                    </>
                  ) : (
                    <div style={{ color: 'rgba(245, 240, 232, 0.4)', fontStyle: 'italic' }}>
                      [ Kết thúc bài thuyết trình ]
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick action buttons */}
          <div>
            <span style={{ color: '#C8A86A', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              THAO TÁC ĐIỀU KHIỂN
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <button
                type="button"
                onClick={prev}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  background: '#24344A',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#F5F0E8',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <SkipBack size={18} />
                <span>Lùi lại</span>
              </button>

              <button
                type="button"
                onClick={next}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  background: '#C87046',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#F5F0E8',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                <SkipForward size={18} />
                <span>Tiếp tục</span>
              </button>

              <button
                type="button"
                onClick={toggleBlackout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  background: isBlackout ? '#C87046' : '#171A24',
                  border: '1px solid #3A2118',
                  borderRadius: '6px',
                  color: '#F5F0E8',
                  cursor: 'pointer',
                }}
              >
                <EyeOff size={18} />
                <span>{isBlackout ? 'Mở lại' : 'Tắt màn'}</span>
              </button>

              <button
                type="button"
                onClick={experienceMode === 'magazine' ? closeMagazine : openLibrary}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  background: '#171A24',
                  border: '1px solid #3A2118',
                  borderRadius: '6px',
                  color: '#EDE4D6',
                  cursor: 'pointer',
                }}
              >
                <Library size={18} />
                <span>Thư viện</span>
              </button>
            </div>
          </div>

          {/* Chapter Quick Jump Grid */}
          <div>
            <span style={{ color: '#C8A86A', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              CHUYỂN NHANH ĐẾN QUYỂN / CHƯƠNG
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => jumpToChapter(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    background: chapterIndex === idx && viewMode === 'chapter' ? 'rgba(200, 168, 106, 0.25)' : '#10131B',
                    border: `1px solid ${chapterIndex === idx && viewMode === 'chapter' ? '#C8A86A' : '#3A2118'}`,
                    borderRadius: '6px',
                    color: '#F5F0E8',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <strong style={{ color: '#C8A86A', fontFamily: 'serif' }}>{ch.roman}</strong>
                  <span style={{ fontSize: '0.85rem' }}>{ch.shortTitle}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar with Build Info and Cache Clear */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 24px',
          background: '#0B0D10',
          borderTop: '1px solid #241814',
          fontSize: '0.75rem',
          color: '#7F8C9B',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>
            Phiên bản:{' '}
            <strong style={{ color: '#C8A86A' }}>
              v{typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : '1.1.0'}
            </strong>
          </span>
          <span>
            Commit:{' '}
            <code
              style={{
                color: '#9FB3C9',
                background: '#171A24',
                padding: '2px 6px',
                borderRadius: '3px',
                fontFamily: 'monospace',
              }}
            >
              {typeof __BUILD_COMMIT__ !== 'undefined' ? __BUILD_COMMIT__ : 'dev'}
            </code>
          </span>
          <span>
            Build:{' '}
            {typeof __BUILD_TIME__ !== 'undefined'
              ? new Date(__BUILD_TIME__).toLocaleString('vi-VN')
              : 'vừa xong'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleClearOfflineCache}
          disabled={clearingCache}
          title="Xóa Service Worker, Cache Storage và làm mới trang"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(155, 27, 48, 0.15)',
            border: '1px solid rgba(155, 27, 48, 0.5)',
            color: '#E06D75',
            padding: '5px 12px',
            borderRadius: '4px',
            cursor: clearingCache ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          {clearingCache ? 'ĐANG XÓA BỘ NHỚ ĐỆM...' : 'XÓA BỘ NHỚ ĐỆM OFFLINE & TẢI LẠI'}
        </button>
      </footer>
    </div>
  );
};
