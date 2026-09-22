import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  BOOK1_EDITORIAL_PAGE_COUNT,
  book1EditorialPages,
} from '../../src/content/magazine/book1Editorial';
import { getMagazineVolume } from '../../src/experiences/magazine/magazineModel';
import {
  coverFront as renderCoverFront,
  pages as renderPages,
} from '../../scripts/magazine/book1EditorialRenderData.mjs';

describe('Book I editorial content', () => {
  it('contains exactly fourteen numbered interior pages', () => {
    expect(BOOK1_EDITORIAL_PAGE_COUNT).toBe(14);
    expect(book1EditorialPages).toHaveLength(14);
    expect(book1EditorialPages.map((p) => p.number)).toEqual(
      Array.from({ length: 14 }, (_, i) => i + 1)
    );
  });

  it('uses the textbook source for every editorial page', () => {
    for (const page of book1EditorialPages) {
      expect(page.sourceIds).toContain('giaoTrinh2021');
    }
  });

  it('does not use the rejected central-position wording', () => {
    const all = JSON.stringify(book1EditorialPages).toLowerCase();
    expect(all).not.toContain('vị trí trung tâm hàng đầu');
    expect(all).toContain('vị trí quan trọng hàng đầu');
  });

  it('does not label the three trends as rigid numbered laws', () => {
    const all = JSON.stringify(book1EditorialPages).toLowerCase();
    expect(all).not.toContain('quy luật 1');
    expect(all).not.toContain('quy luật 2');
    expect(all).not.toContain('quy luật 3');
  });

  it('keeps audience page copy concise', () => {
    for (const page of book1EditorialPages) {
      const words = [
        page.headline,
        page.body ?? '',
        ...(page.labels ?? []),
      ].join(' ').trim().split(/\s+/).filter(Boolean);
      expect(words.length).toBeLessThanOrEqual(65);
    }
  });

  it('matches Book I volume sheets page IDs in sequential order', () => {
    const volume = getMagazineVolume(0)!;
    const volumePageIds = volume.sheets.flatMap((sheet) => [
      sheet.front.id,
      sheet.back.id,
    ]);
    const editorialIds = book1EditorialPages.map((p) => p.id);
    expect(volumePageIds).toEqual(editorialIds);
  });

  it('enforces deep parity between typed editorial model and render data including visual model', () => {
    const volume = getMagazineVolume(0)!;
    expect(renderCoverFront.title).toBe('Cơ cấu xã hội – giai cấp');
    expect(volume.title).toBe(renderCoverFront.title);
    expect(renderPages).toHaveLength(book1EditorialPages.length);

    for (let i = 0; i < book1EditorialPages.length; i++) {
      const source = book1EditorialPages[i];
      const target = renderPages[i];

      expect(target.id).toBe(source.id);
      expect(target.number).toBe(source.number);
      expect(target.kicker).toBe(source.kicker);
      expect(target.headline).toBe(source.headline);
      expect(target.body).toBe(source.body);
      expect(target.labels).toEqual(source.labels);
      expect(target.footer).toBe(source.footer);
      expect(target.layout).toBe(source.layout);
      expect(target.sourceIds).toEqual(source.sourceIds);
      expect(target.visual).toEqual(source.visual);
    }
  });

  it('guarantees renderer contains zero hard-coded academic semantic strings', () => {
    const rendererPath = path.resolve('scripts/magazine/renderBook1Editorial.mjs');
    const rendererCode = fs.readFileSync(rendererPath, 'utf8');

    const forbiddenStrings = [
      'CƠ CẤU XÃ HỘI – GIAI CẤP',
      'Tác động chi phối lan tỏa',
      'Outward Influence',
      'Reciprocal',
      'Hợp tác & Liên minh',
      'Khác biệt & Đấu tranh',
      'Từng bước xích lại gần nhau',
      'Xuất phát từ quan hệ sản xuất',
      'CỘNG ĐỒNG NGƯỜI',
      'MỐI QUAN HỆ XÃ HỘI',
      'CÁC TIÊU CHÍ PHÂN HÓA',
      'Nền kinh tế nhiều thành phần',
      'chuyên gia công nghệ',
      'lợi ích cục bộ',
      'đặt nền tảng tất yếu',
    ];

    for (const forbidden of forbiddenStrings) {
      expect(rendererCode).not.toContain(forbidden);
    }
  });
});
