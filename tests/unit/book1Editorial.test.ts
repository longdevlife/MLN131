import { describe, expect, it } from 'vitest';
import {
  BOOK1_EDITORIAL_PAGE_COUNT,
  book1EditorialPages,
} from '../../src/content/magazine/book1Editorial';

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
});
