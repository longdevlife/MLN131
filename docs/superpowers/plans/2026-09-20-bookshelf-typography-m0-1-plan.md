# Implementation Plan: M0.1 — Bookshelf Vietnamese Typography Integrity Patch

- **Branch:** `spec/magazine-museum-rebase`
- **Scope:** Bookshelf canvas typography, font deterministic loading, safe text fitting, ChapterRail dock polish, unit test suite, and visual proof gates.
- **Reference Spec:** `C:\Users\admin\Downloads\chat.md`

---

## Tasks

- [ ] **Task 1: Implement pure typography helper `fitTextToWidth` with unit tests (TDD)**
  - File to create: `src/vendor/threeui-custom/bookshelf/typographyUtils.ts`
  - Test file to create: `tests/unit/typographyUtils.test.ts`
  - Function: `fitTextToWidth(ctx, text, options)`
  - Handle word wrapping, iterative font-size reduction, NFC normalization, line-height calculation.
  - Test cases:
    - 4 official book titles
    - Vietnamese combining mark input (decomposed NFD -> normalized NFC)
    - Assert <= 2 lines, width <= maxWidth, words preserved, no empty lines.

- [ ] **Task 2: Implement deterministic local font preloader `ensureBookshelfFonts`**
  - File: `src/vendor/threeui-custom/bookshelf/fontLoader.ts`
  - Register `MLNBookSans` regular (400) and bold (700) using `FontFace` API from `/fonts/roboto-regular.woff` and `/fonts/roboto-bold.woff`.
  - Cache promise so it only loads once across mounts.
  - Integrate with `BookshelfScene.tsx`: await `ensureBookshelfFonts()` before calling `createBookshelfRenderer` (or within renderer initialization), handling component unmount/cancellation safely.

- [ ] **Task 3: Refactor Bookshelf textures with `fitTextToWidth` and `MLNBookSans`**
  - File: `src/vendor/threeui-custom/bookshelf/bookshelfRenderer.js`
  - Replace hardcoded `Iowan Old Style` / length-based font sizing in:
    - `Tn(e)`: Cover texture (centered, max 2 lines, safe width 610px, min size 42px, max 70px)
    - `Cn(e)`: Secondary cover texture (left aligned, fitting safe width)
    - `Kn(e)`: Spine texture (rotated 90deg, fitting spine height/width)
    - `Mn(e)`: Working volume texture (fitting title and discipline)
  - Also ensure discipline labels ("Khái luận & Quy luật", etc.) use `MLNBookSans` and fit without overflow.

- [ ] **Task 4: Polish ChapterRail top dock for 1920 and 1366 viewports**
  - File: `src/presentation/ChapterRail.tsx` and `src/presentation/presentation.css` (or `index.css`)
  - Adjust `.chapter-rail-title` so at 1920 (and >= 1600px) full shortTitle is visible without ellipsis truncation, while at 1366 controlled clean truncation is preserved.

- [ ] **Task 5: Add Visual Gate script & capture 4 required screenshots**
  - Playwright test script: `tests/e2e/bookshelf-typography-m0-1.spec.ts`
  - Capture:
    - `artifacts/screenshots/magazine-m0/M0.1-library-font-1920.png`
    - `artifacts/screenshots/magazine-m0/M0.1-library-font-1366.png`
    - `artifacts/screenshots/magazine-m0/M0.1-book-I-closeup.png`
    - `artifacts/screenshots/magazine-m0/M0.1-books-all-four.png`

- [ ] **Task 6: Verification, Regression & Acceptance Report**
  - Run:
    - `npm run lint`
    - `npm test`
    - `npm run build`
    - `npx playwright test tests/e2e/magazine-m0.spec.ts --project=chromium`
    - `npx playwright test tests/e2e/bookshelf-typography-m0-1.spec.ts --project=chromium`
  - Check: exactly 1 canvas settled, 0 external font/CDN requests, no WebGL crash.
  - Generate M0.1 Acceptance Report and STOP.
