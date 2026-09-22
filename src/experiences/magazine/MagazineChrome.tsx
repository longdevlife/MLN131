import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import type { MagazineViewMode, MagazineVolume } from './magazineTypes';

export interface MagazineChromeProps {
  volume: MagazineVolume;
  page: number;
  viewMode: MagazineViewMode;
  pageCount: number;
  onClose(): void;
  onPrev(): void;
  onNext(): void;
  onToggleViewMode(): void;
}

export function MagazineChrome({
  volume,
  page,
  viewMode,
  pageCount,
  onClose,
  onPrev,
  onNext,
  onToggleViewMode,
}: MagazineChromeProps) {
  const isShowcase = viewMode === 'showcase';
  const toggleLabel = isShowcase ? 'Chuyển sang chế độ đọc' : 'Chuyển sang chế độ 3D';

  const formatPageLabel = () => {
    if (page === 0) return 'Bìa trước';
    if (page >= pageCount - 1) return 'Bìa sau';
    return `Trang ${page * 2 - 1}–${page * 2}`;
  };

  return (
    <div className="magazine-chrome">
      {/* Top Bar */}
      <div className="magazine-chrome-top">
        <button
          type="button"
          className="magazine-btn"
          aria-label="Đóng tạp chí"
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          <span>Thư viện</span>
        </button>

        <div className="magazine-volume-header">
          <span className="magazine-volume-title">
            Quyển {volume.roman} · {volume.title}
          </span>
          {volume.subtitle && (
            <span className="magazine-volume-subtitle">{volume.subtitle}</span>
          )}
        </div>

        <button
          type="button"
          className="magazine-btn"
          aria-label={toggleLabel}
          onClick={onToggleViewMode}
        >
          {isShowcase ? <BookOpen size={16} /> : <Eye size={16} />}
          <span>{isShowcase ? 'Chế độ đọc' : 'Chế độ 3D'}</span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="magazine-chrome-bottom">
        <div className="magazine-controls-bar">
          <button
            type="button"
            className="magazine-btn"
            aria-label="Trang trước"
            onClick={onPrev}
            disabled={page === 0}
          >
            <ChevronLeft size={18} />
            <span>Trước</span>
          </button>

          <div className="magazine-page-indicator">
            {formatPageLabel()}
          </div>

          <button
            type="button"
            className="magazine-btn"
            aria-label="Trang tiếp"
            onClick={onNext}
            disabled={page >= pageCount - 1}
          >
            <span>Tiếp</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
