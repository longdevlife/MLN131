# MLN131 Book I Editorial M1A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the M0 placeholder magazine textures with a complete, projector-readable, academically disciplined 14-page Book I editorial issue while preserving the approved HCM202 page-turn engine and postponing all ThreeUI interactive inserts to M1B.

**Architecture:** The 3D Magazine engine remains unchanged. M1A adds one deterministic editorial-content model for Book I, one local HTML/CSS-to-PNG texture generator, seven interior spreads plus front/back covers, and page/source metadata wired into `book1Volume`. The magazine remains understandable without live ThreeUI inserts; those are a separate later milestone.

**Tech Stack:** React 19.2.0, TypeScript 6, Vite 8.3.0, Zustand 5.0.15, Three 0.170.0, R3F 9.7.0, Drei 10.7.8, Playwright 1.63 for deterministic local page rendering, local Roboto/MLNBookSans font assets.

**Spec:** `docs/superpowers/specs/2026-09-20-mln131-magazine-core-design.md`

## Global Constraints

- Baseline for implementation: `06bb778fa65db7fbd449167df1660ddaaacc2908`.
- Do not change Magazine page-turn geometry, skeleton, camera choreography, particles, or audio mechanics unless a blocking defect is proven.
- Do not implement ThreeUI interactive inserts in M1A.
- Do not implement Museum in M1A.
- Do not modify HCM202 Minigame/Firebase/RPG.
- Do not author Books II-IV.
- Final Book I uses seven interior spreads / fourteen interior editorial pages plus front and back covers.
- The magazine page must remain readable on a classroom projector at 1920x1080 and 1366x768.
- Audience-facing page copy must be concise; detailed explanation stays in presenter/speaker notes.
- All final Book I academic statements must be traceable to the approved Chapter 5 content model and `giaoTrinh2021`; do not invent page numbers.
- Do not silently upgrade paraphrases into exact quotations.
- Use `Cơ cấu xã hội – giai cấp giữ vị trí quan trọng hàng đầu`, not `vị trí trung tâm hàng đầu`.
- Refer to the three transformation items as `xu hướng` / `sự biến đổi có tính quy luật`, not rigid `quy luật 1/2/3`.
- Avoid stronger claims such as `liên minh ... được thiết lập vững chắc` unless explicitly supported by the approved source.
- All fonts/assets required for Book I textures are local; no remote images, Google Fonts, or CDN runtime requests.
- Every visual gate must be manually approved before the next large production batch proceeds.

## Approved Book I Editorial Narrative

The fourteen interior pages implement this sequence:

1. **01 — Cơ cấu xã hội là gì?**  
   Textbook-framed definition: communities of people + the social relations created through their interaction.

2. **02 — Năm lát cắt của cơ cấu xã hội**  
   Dân cư · Nghề nghiệp · Giai cấp · Dân tộc · Tôn giáo.  
   Emphasize that scientific-socialism focuses on class-social structure because of its connection to class, interests, and alliance.

3. **03 — Cơ cấu xã hội – giai cấp**  
   System of classes and social strata objectively existing in a social regime.

4. **04 — Bốn chiều kích quan hệ**  
   Ownership of means of production · production/labor organization and management · political-social status · distribution of products/income/interests.  
   Include the transition-period groups as a compact secondary line: công nhân · nông dân · trí thức · doanh nhân · tiểu chủ · các nhóm khác.

5. **05 — Vị trí quan trọng hàng đầu**  
   Connect class-social structure to economic and political relations and its influence on other social structures.

6. **06 — Quan hệ hai chiều**  
   Other structures also act back on class-social structure. Explicit caveat: do not absolutize class structure or dismiss other structures.

7. **07 — Xu hướng 1: Kinh tế thay đổi, cơ cấu giai cấp thay đổi**  
   Core textbook statement that class-social structure changes together with and is conditioned by economic-structure change.

8. **08 — Chuỗi chuyển dịch**  
   Cơ cấu kinh tế → lao động/nghề nghiệp → vị trí, số lượng, vai trò → cơ cấu XH–GC.  
   Industrialization illustration: relative agricultural share tends to fall while industry/services rise.

9. **09 — Xu hướng 2: Phức tạp và đa dạng hơn**  
   Multiple economic components/property forms create a more complex class-social structure and new strata.

10. **10 — Phân hóa bên trong**  
    Differentiate by occupation, education, income, living conditions, and social position.  
    New/visible strata examples remain illustrative, not exhaustive.

11. **11 — Xu hướng 3: Đấu tranh và liên minh**  
    Common and distinct interests coexist; relations therefore include both cooperation/alliance and tensions/differences.

12. **12 — Từng bước xích lại gần nhau**  
    Present the textbook tendency toward narrowing unreasonable gaps without implying that differences disappear.

13. **13 — Logic tổng hợp**  
    Kinh tế thay đổi → cơ cấu XH–GC thay đổi → lợi ích vừa thống nhất vừa khác biệt.

14. **14 — Câu hỏi chuyển tiếp**  
    `Khi lợi ích vừa gặp nhau vừa khác nhau, điều gì khiến các giai cấp và tầng lớp phải liên minh?`  
    This is a bridge to Book II only. Do not begin substantive Part II.

## Editorial Visual Language

- Outer shell remains `#0B0D10`.
- Page paper remains warm ivory, not pure white.
- Use restrained copper/gold accents.
- No giant black cards inside pages.
- No dashboard UI.
- No stock PowerPoint diagrams.
- One spread = one visual argument.
- Each page should contain at most:
  - one kicker;
  - one headline;
  - one short explanatory paragraph or 3-5 short labels;
  - one primary diagram/graphic;
  - one tiny source/footer line.
- Target body copy: 18-45 Vietnamese words per page. Hard maximum: 65 words.
- Headlines must be legible in 3D showcase mode, not only reading mode.
- Every page texture is 768x1152.
- Important content must stay within a safe rectangle of 64px horizontal and 72px vertical margins.
- Avoid placing critical text within 120px of the inner gutter on the page side that meets the spine.

## Review Focus

1. **Projector legibility:** page designs can look attractive as raw 768x1152 PNGs yet become unreadable when mapped into an open 3D spread; E2E must capture both showcase and reading modes.
2. **Academic overstatement:** existing legacy `part1.ts` contains some stronger presenter phrases; M1A page copy must use the approved wording above and source attribution.
3. **Physical-page ordering:** 14 editorial pages must map into the current physical-sheet normalization without page reversal, missing page, or wrong spread pairing.
4. **Gutter safety:** page-turn curvature and center fold must not cover headlines/key labels.
5. **Texture determinism:** regenerated PNGs must use only local fonts/assets and produce stable dimensions/names expected by `book1Volume`.

---

## Locked File Structure

### Create

```text
src/content/magazine/
  book1Editorial.ts

scripts/magazine/
  book1EditorialRenderData.mjs
  renderBook1Editorial.mjs

tests/unit/
  book1Editorial.test.ts

tests/e2e/
  magazine-m1a-editorial.spec.ts

artifacts/screenshots/magazine-m1a/
  (visual-gate screenshots)
```

### Modify

```text
src/experiences/magazine/volumes/book1.ts
src/experiences/magazine/magazineTypes.ts
src/experiences/magazine/MagazineChrome.tsx
src/presenter/PresenterConsole.tsx
package.json
```

### Replace M0 prototype textures with final M1A assets

```text
public/magazine/book1/cover-front.png
public/magazine/book1/page-01.png
public/magazine/book1/page-02.png
...
public/magazine/book1/page-14.png
public/magazine/book1/cover-back.png
```

Do not retain the old `spread-01-front.png` naming in the final volume model.

---

### Task 1: Define a typed editorial content model and exact 14-page Book I content

**Files:**
- Create: `src/content/magazine/book1Editorial.ts`
- Modify: `src/experiences/magazine/magazineTypes.ts`
- Test: `tests/unit/book1Editorial.test.ts`

**Interfaces:**
- Produces:
  - `Book1EditorialPage`
  - `book1EditorialPages`
  - `BOOK1_EDITORIAL_PAGE_COUNT = 14`
- Consumes: approved Part I content; `giaoTrinh2021` source ID.

- [ ] **Step 1: Write the failing content-integrity tests**

Create `tests/unit/book1Editorial.test.ts` with assertions:

```ts
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
```

- [ ] **Step 2: Run RED**

```bash
npm test -- tests/unit/book1Editorial.test.ts
```

Expected: FAIL because `book1Editorial.ts` does not exist.

- [ ] **Step 3: Add minimal content types**

Extend `magazineTypes.ts` with:

```ts
export type MagazineEditorialLayout =
  | 'definition'
  | 'constellation'
  | 'four-dimensions'
  | 'orbital'
  | 'flow'
  | 'branching'
  | 'convergence'
  | 'synthesis'
  | 'transition';

export interface Book1EditorialPage {
  number: number;
  id: string;
  kicker: string;
  headline: string;
  body?: string;
  labels?: string[];
  footer?: string;
  layout: MagazineEditorialLayout;
  sourceIds: string[];
}
```

Do not add ThreeUI component IDs in M1A.

- [ ] **Step 4: Implement the exact fourteen page records**

Use these page records as the audience-facing content contract:

```ts
export const book1EditorialPages: Book1EditorialPage[] = [
  {
    number: 1,
    id: 'book1-p01-social-structure',
    kicker: '01 / KHÁI NIỆM',
    headline: 'Cơ cấu xã hội là gì?',
    body: 'Cơ cấu xã hội gồm những cộng đồng người cùng toàn bộ các mối quan hệ xã hội do sự tác động lẫn nhau giữa các cộng đồng ấy tạo nên.',
    labels: ['Cộng đồng người', 'Mối quan hệ xã hội'],
    layout: 'definition',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 2,
    id: 'book1-p02-five-structures',
    kicker: '02 / CÁC LOẠI HÌNH',
    headline: 'Năm lát cắt của cơ cấu xã hội',
    body: 'Dân cư, nghề nghiệp, giai cấp, dân tộc và tôn giáo cùng tồn tại và tác động qua lại trong đời sống xã hội.',
    labels: ['Dân cư', 'Nghề nghiệp', 'Giai cấp', 'Dân tộc', 'Tôn giáo'],
    layout: 'constellation',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 3,
    id: 'book1-p03-class-social-structure',
    kicker: '03 / CƠ CẤU XH–GC',
    headline: 'Một hệ thống các giai cấp và tầng lớp',
    body: 'Cơ cấu xã hội – giai cấp là hệ thống các giai cấp, tầng lớp xã hội tồn tại khách quan trong một chế độ xã hội nhất định.',
    layout: 'definition',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 4,
    id: 'book1-p04-four-dimensions',
    kicker: '04 / BỐN CHIỀU KÍCH',
    headline: 'Nhìn cấu trúc qua bốn quan hệ',
    labels: [
      'Sở hữu tư liệu sản xuất',
      'Tổ chức và quản lý sản xuất',
      'Địa vị chính trị – xã hội',
      'Phân phối sản phẩm và thu nhập',
    ],
    footer: 'TKQĐ: công nhân · nông dân · trí thức · doanh nhân · tiểu chủ · các nhóm xã hội khác',
    layout: 'four-dimensions',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 5,
    id: 'book1-p05-position',
    kicker: '05 / VỊ TRÍ',
    headline: 'Giữ vị trí quan trọng hàng đầu',
    body: 'Cơ cấu xã hội – giai cấp gắn chặt với các quan hệ kinh tế, chính trị và có ảnh hưởng mạnh tới những loại hình cơ cấu xã hội khác.',
    layout: 'orbital',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 6,
    id: 'book1-p06-two-way',
    kicker: '06 / TÁC ĐỘNG QUA LẠI',
    headline: 'Quan trọng, nhưng không đứng một mình',
    body: 'Dân tộc, tôn giáo, dân cư và nghề nghiệp cũng tác động trở lại. Không tuyệt đối hóa cơ cấu xã hội – giai cấp và không xem nhẹ các cơ cấu khác.',
    layout: 'orbital',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 7,
    id: 'book1-p07-trend-one',
    kicker: '07 / XU HƯỚNG 1',
    headline: 'Kinh tế thay đổi, cơ cấu giai cấp thay đổi',
    body: 'Sự biến đổi của cơ cấu xã hội – giai cấp gắn liền và bị quy định bởi sự biến đổi của cơ cấu kinh tế trong thời kỳ quá độ.',
    layout: 'flow',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 8,
    id: 'book1-p08-economic-chain',
    kicker: '08 / CHUỖI CHUYỂN DỊCH',
    headline: 'Từ cơ cấu kinh tế đến diện mạo giai tầng',
    labels: [
      'Cơ cấu kinh tế',
      'Lao động & nghề nghiệp',
      'Vị trí · số lượng · vai trò',
      'Cơ cấu xã hội – giai cấp',
    ],
    footer: 'Minh họa công nghiệp hóa: tỷ trọng nông nghiệp có xu hướng giảm tương đối, công nghiệp và dịch vụ tăng.',
    layout: 'flow',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 9,
    id: 'book1-p09-trend-two',
    kicker: '09 / XU HƯỚNG 2',
    headline: 'Phức tạp hơn, đa dạng hơn',
    body: 'Nhiều thành phần kinh tế và hình thức sở hữu làm cơ cấu xã hội – giai cấp thêm đa dạng, đồng thời làm xuất hiện những tầng lớp xã hội mới.',
    layout: 'branching',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 10,
    id: 'book1-p10-internal-differentiation',
    kicker: '10 / PHÂN HÓA',
    headline: 'Khác biệt diễn ra cả bên trong mỗi giai tầng',
    labels: ['Nghề nghiệp', 'Trình độ', 'Thu nhập', 'Điều kiện sống', 'Vị thế xã hội'],
    footer: 'Doanh nhân · tiểu chủ · lao động tự do là những ví dụ minh họa cho diện mạo xã hội đa dạng hơn.',
    layout: 'branching',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 11,
    id: 'book1-p11-trend-three',
    kicker: '11 / XU HƯỚNG 3',
    headline: 'Vừa đấu tranh, vừa liên minh',
    body: 'Lợi ích giữa các giai cấp, tầng lớp vừa có điểm chung vừa có khác biệt; vì vậy quan hệ xã hội bao gồm cả hợp tác, liên minh và những căng thẳng, khác biệt.',
    layout: 'convergence',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 12,
    id: 'book1-p12-draw-closer',
    kicker: '12 / XÍCH LẠI GẦN NHAU',
    headline: 'Thu hẹp những khoảng cách bất hợp lý',
    body: 'Trong quá trình phát triển và liên minh, các giai cấp, tầng lớp có xu hướng từng bước xích lại gần nhau; sự khác biệt không vì thế mà biến mất hoàn toàn.',
    layout: 'convergence',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 13,
    id: 'book1-p13-synthesis',
    kicker: '13 / LOGIC TỔNG HỢP',
    headline: 'Ba chuyển động nối thành một chuỗi',
    labels: [
      'Kinh tế thay đổi',
      'Cơ cấu XH–GC thay đổi',
      'Lợi ích vừa thống nhất vừa khác biệt',
    ],
    layout: 'synthesis',
    sourceIds: ['giaoTrinh2021'],
  },
  {
    number: 14,
    id: 'book1-p14-bridge',
    kicker: '14 / CÂU HỎI CHUYỂN TIẾP',
    headline: 'Khi lợi ích vừa gặp nhau vừa khác nhau…',
    body: 'Điều gì khiến các giai cấp và tầng lớp phải liên minh?',
    layout: 'transition',
    sourceIds: ['giaoTrinh2021'],
  },
];

export const BOOK1_EDITORIAL_PAGE_COUNT = book1EditorialPages.length;
```

- [ ] **Step 5: Run tests GREEN**

```bash
npm test -- tests/unit/book1Editorial.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/magazine/book1Editorial.ts src/experiences/magazine/magazineTypes.ts tests/unit/book1Editorial.test.ts
git commit -m "feat(book1): define approved editorial content"
```

---

### Task 2: Build one deterministic local editorial texture renderer

**Files:**
- Create: `scripts/magazine/book1EditorialRenderData.mjs`
- Create: `scripts/magazine/renderBook1Editorial.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: exact page copy from Task 1; because Node does not directly import the TS source in this repo, `book1EditorialRenderData.mjs` mirrors only render-safe data and is protected by parity tests added in Task 3.
- Produces: 16 PNGs at 768x1152.

- [ ] **Step 1: Add render script entry**

In `package.json`:

```json
{
  "scripts": {
    "render:book1": "node scripts/magazine/renderBook1Editorial.mjs"
  }
}
```

Do not alter existing scripts.

- [ ] **Step 2: Create render-safe page data**

`book1EditorialRenderData.mjs` exports:
- `coverFront`
- `pages` with exactly 14 entries matching Task 1
- `coverBack`

Include stable IDs identical to `book1EditorialPages` so parity can be tested later.

- [ ] **Step 3: Implement the Playwright renderer**

`renderBook1Editorial.mjs` must:

```js
const VIEWPORT = { width: 768, height: 1152 };
const OUTPUT = 'public/magazine/book1';
```

For every page:
1. build local HTML;
2. load only local/built-in CSS;
3. wait for fonts;
4. set viewport to exactly 768x1152;
5. screenshot exactly the page viewport;
6. write deterministic filenames.

Output names:

```text
cover-front.png
page-01.png
...
page-14.png
cover-back.png
```

- [ ] **Step 4: Implement shared editorial CSS tokens**

Use:

```css
--paper: #efe7d8;
--paper-deep: #ded3bf;
--ink: #151719;
--ink-soft: #5f5b54;
--gold: #aa854d;
--copper: #a86643;
--rule: rgba(82, 69, 54, .22);
```

Typography:
- headline: MLNBookSans 700;
- body: MLNBookSans 400;
- kicker/footer: MLNBookSans 500;
- no system-only serif dependency.

- [ ] **Step 5: Implement nine layout renderers**

The script must explicitly render:
- definition;
- constellation;
- four-dimensions;
- orbital;
- flow;
- branching;
- convergence;
- synthesis;
- transition.

These are 2D editorial diagrams made from HTML/CSS/SVG primitives. They are not ThreeUI substitutes and do not need animation.

- [ ] **Step 6: Render all assets**

Run:

```bash
npm run render:book1
```

Expected:
- 16 PNG files;
- every file exactly 768x1152;
- no network access required.

- [ ] **Step 7: Commit renderer separately**

```bash
git add package.json scripts/magazine
git commit -m "feat(book1): add deterministic editorial page renderer"
```

Do not commit all 14 final textures yet; first visual gate is Task 4.

---

### Task 3: Wire physical page ordering and source metadata

**Files:**
- Modify: `src/experiences/magazine/volumes/book1.ts`
- Modify: `tests/unit/book1Editorial.test.ts`
- Modify: `tests/unit/magazineModel.test.ts`

**Interfaces:**
- Consumes: 14 editorial pages and generated texture paths.
- Produces: seven `MagazineSheet` entries and correct physical ordering.

- [ ] **Step 1: Write failing page-order tests**

Assert:

```ts
const volume = getMagazineVolume(0)!;

expect(volume.sheets).toHaveLength(7);
expect(volume.sheets[0].front.texture).toBe('/magazine/book1/page-01.png');
expect(volume.sheets[0].back.texture).toBe('/magazine/book1/page-02.png');
expect(volume.sheets[6].front.texture).toBe('/magazine/book1/page-13.png');
expect(volume.sheets[6].back.texture).toBe('/magazine/book1/page-14.png');

expect(getMagazinePhysicalSheets(volume)).toHaveLength(8);
expect(getMagazinePageCount(volume)).toBe(9);
```

Also flatten all interior page IDs and assert exactly 14 unique IDs.

- [ ] **Step 2: Run RED**

```bash
npm test -- tests/unit/magazineModel.test.ts tests/unit/book1Editorial.test.ts
```

Expected: FAIL against M0 two-sheet volume.

- [ ] **Step 3: Replace prototype `book1.ts` data**

Create seven sheet records pairing:
- 01/02
- 03/04
- 05/06
- 07/08
- 09/10
- 11/12
- 13/14

Each `MagazinePageContent`:
- uses exact page ID;
- uses correct texture;
- has concise Vietnamese `alt`;
- includes `sourceIds: ['giaoTrinh2021']`.

- [ ] **Step 4: Keep back/front cover metadata explicit**

Front cover:
`/magazine/book1/cover-front.png`

Back cover:
`/magazine/book1/cover-back.png`

Do not reuse an interior page as a cover.

- [ ] **Step 5: Run tests GREEN**

```bash
npm test -- tests/unit/magazineModel.test.ts tests/unit/book1Editorial.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/experiences/magazine/volumes/book1.ts tests/unit/book1Editorial.test.ts tests/unit/magazineModel.test.ts
git commit -m "feat(book1): wire fourteen editorial pages into magazine"
```

---

### Task 4: EARLY VISUAL GATE — render and approve only Spreads 01-02 and 05-06 first

**Files:**
- Generate: `public/magazine/book1/cover-front.png`
- Generate: `public/magazine/book1/page-01.png` through `page-06.png`
- Create/Modify: `tests/e2e/magazine-m1a-editorial.spec.ts`
- Generate: `artifacts/screenshots/magazine-m1a/*`

**Why this gate exists:** Do not spend time polishing all fourteen pages before the visual language is approved.

- [ ] **Step 1: Render the assets**

Run:

```bash
npm run render:book1
```

The renderer may create all files locally, but only pages 01-06 are judged in this gate.

- [ ] **Step 2: Write E2E navigation to the target spreads**

Create helpers using public keyboard/UI navigation only.

Capture:

```text
M1A-gate-cover-1920.png
M1A-gate-spread-01-02-showcase-1920.png
M1A-gate-spread-01-02-reading-1920.png
M1A-gate-spread-05-06-showcase-1920.png
M1A-gate-spread-05-06-reading-1920.png
M1A-gate-spread-01-02-1366.png
```

- [ ] **Step 3: Add projector-readability assertions**

For each target screenshot:
- exactly one canvas;
- no horizontal document overflow;
- Magazine chrome visible;
- page state equals expected physical position;
- no console error;
- no external-origin HTTP(S) request.

- [ ] **Step 4: Manual review checklist before reporting**

AGY must inspect:
- headline readability from the full screenshot;
- no gutter collision;
- no body block larger than roughly one-third page height;
- no tiny diagram labels;
- visual hierarchy feels editorial, not dashboard;
- paper texture does not reduce contrast;
- 1366 remains readable.

- [ ] **Step 5: STOP FOR HUMAN VISUAL APPROVAL**

Do not proceed to Task 5 until reviewer/user approves this visual direction.

Return the six screenshots and STOP.

---

### Task 5: Produce the remaining Book I editorial textures after visual approval

**Files:**
- Generate/finalize: `public/magazine/book1/page-07.png` through `page-14.png`
- Finalize: `cover-back.png`

- [ ] **Step 1: Apply only the approved M1A visual language**

Do not introduce a new type system, new color system, or radically different diagram style after Task 4 approval.

- [ ] **Step 2: Render pages 07-14**

Required spread logic:
- 07/08 = economic flow;
- 09/10 = diversification/branching;
- 11/12 = alliance/convergence;
- 13/14 = synthesis/bridge.

- [ ] **Step 3: Inspect raw 768x1152 textures**

Verify:
- no clipping;
- no missing Vietnamese glyph;
- page number matches asset filename;
- no content exceeds safe margins.

- [ ] **Step 4: Commit final texture batch**

```bash
git add public/magazine/book1
git commit -m "feat(book1): add complete editorial texture set"
```

---

### Task 6: Make Magazine chrome and Presenter Console aware of the real 14-page issue

**Files:**
- Modify: `src/experiences/magazine/MagazineChrome.tsx`
- Modify: `src/presenter/PresenterConsole.tsx`
- Test: `tests/unit/magazineModel.test.ts`

**Interfaces:**
- Consumes: nine physical page positions.
- Produces: correct human-readable spread labels and presenter context.

- [ ] **Step 1: Add failing page-label helper tests**

Extract a pure helper if necessary:

```ts
formatMagazinePageLabel(page, pageCount)
```

Expected:
- 0 -> `Bìa trước`
- 1 -> `Trang 1–2`
- 2 -> `Trang 3–4`
- ...
- 7 -> `Trang 13–14`
- 8 -> `Bìa sau`

- [ ] **Step 2: Implement helper and wire Chrome**

No hard-coded assumptions specific to M0 four-page prototype.

- [ ] **Step 3: Update Presenter Console**

In Magazine mode show:
- Book I title;
- correct current spread label;
- current editorial spread topic, derived from a small explicit mapping:
  - 1 => `Khái niệm & các loại hình`
  - 2 => `Cơ cấu XH–GC & bốn chiều kích`
  - 3 => `Vị trí & tác động qua lại`
  - 4 => `Xu hướng 1`
  - 5 => `Xu hướng 2`
  - 6 => `Xu hướng 3`
  - 7 => `Tổng hợp & chuyển tiếp`

Do not add long speaker notes yet if doing so would duplicate existing `part1.ts`; M1A only needs reliable presenter orientation.

- [ ] **Step 4: Run tests**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/experiences/magazine/MagazineChrome.tsx src/presenter/PresenterConsole.tsx tests/unit/magazineModel.test.ts
git commit -m "feat(book1): align magazine chrome with fourteen-page issue"
```

---

### Task 7: Full Book I editorial E2E + final visual gate

**Files:**
- Modify: `tests/e2e/magazine-m1a-editorial.spec.ts`
- Generate: `artifacts/screenshots/magazine-m1a/*`

- [ ] **Step 1: Add full page traversal test**

Path:

```text
Cover
-> Library
-> Book I
-> page 1-2
-> page 3-4
-> page 5-6
-> page 7-8
-> page 9-10
-> page 11-12
-> page 13-14
-> back cover
-> previous back through one spread
-> Escape
-> Library
```

At each position assert expected label.

- [ ] **Step 2: Add Book I source-metadata unit assertion**

Every one of the fourteen pages must include `giaoTrinh2021`.

- [ ] **Step 3: Capture final 1920 screenshots**

```text
M1A-cover-1920.png
M1A-spread-01-02-1920.png
M1A-spread-03-04-1920.png
M1A-spread-05-06-1920.png
M1A-spread-07-08-1920.png
M1A-spread-09-10-1920.png
M1A-spread-11-12-1920.png
M1A-spread-13-14-1920.png
```

Use showcase mode.

- [ ] **Step 4: Capture reading-mode samples**

```text
M1A-reading-03-04-1920.png
M1A-reading-07-08-1920.png
M1A-reading-11-12-1920.png
```

- [ ] **Step 5: Capture 1366 samples**

```text
M1A-spread-01-02-1366.png
M1A-spread-07-08-1366.png
M1A-spread-13-14-1366.png
```

- [ ] **Step 6: Verify no legacy rejected wording in rendered content**

E2E/source assertions must reject:
- `vị trí trung tâm hàng đầu`;
- `quy luật 1`;
- `quy luật 2`;
- `quy luật 3`;
- `liên minh kinh tế - chính trị được thiết lập vững chắc`.

- [ ] **Step 7: Run full verification**

```bash
npm run lint
npm test
npm run build
npx playwright test tests/e2e/magazine-m1a-editorial.spec.ts --project=chromium
npx playwright test tests/e2e/magazine-m0.spec.ts --project=chromium
npx playwright test tests/e2e/bookshelf-typography-m0-1.spec.ts --project=chromium
```

Record exact output.

- [ ] **Step 8: Commit evidence**

```bash
git add tests/e2e/magazine-m1a-editorial.spec.ts artifacts/screenshots/magazine-m1a
git commit -m "test(book1): add M1A editorial visual proof"
```

- [ ] **Step 9: STOP**

Return:
- full remote HEAD SHA;
- exact commits;
- exact changed files;
- exact local verification output;
- fourteen page asset list;
- final screenshot list;
- known issues;
- explicit statement: `No ThreeUI inserts, Museum, Books II-IV, or Minigame work started.`

Do not start M1B.

---

## Plan Self-Review

### Spec coverage
- Complete Book I editorial issue: Tasks 1, 3, 5.
- 14 interior pages: Tasks 1 and 3.
- Projector readability: Tasks 4 and 7.
- source metadata: Tasks 1, 3, 7.
- local/offline assets: Tasks 2 and 7.
- engine preservation: global constraints; no engine task exists.
- visual gate before large production: Task 4.
- presenter awareness: Task 6.
- no ThreeUI/Museum/Minigame: global constraints and final STOP.

### Placeholder scan
No TBD/TODO/“implement later” instructions. M1B interactive work is explicitly a separate milestone, not a placeholder.

### Type consistency
- `Book1EditorialPage` is defined in Task 1.
- `book1EditorialPages` is consumed by tests and conceptually mirrored in render data.
- `MagazineVolume` continues to use seven `MagazineSheet` values.
- current physical model yields eight physical sheets / nine magazine positions.
- Chrome labels map page positions 0..8 exactly.

### Review Focus coverage
1. Projector legibility -> Tasks 4 and 7 screenshots.
2. Academic overstatement -> Tasks 1 and 7 prohibited-wording assertions.
3. Physical ordering -> Task 3 tests.
4. Gutter safety -> Task 4 manual visual gate and Task 7 samples.
5. Texture determinism -> Task 2 exact dimensions/names and Task 7 network assertions.
