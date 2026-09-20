# MLN131 Magazine Core Design

**Date:** 2026-09-20  
**Status:** Written-spec review pending  
**Parent architecture:** `2026-09-20-mln131-experience-architecture-design.md`  
**Baseline:** `309dbe150b3b70dfe5c2762a95fe3b7de4f85594`  
**Reference:** `longdevlife/HCM202` @ `d19c0d8557ce64778574c74ede16c66ffec95a53`

## 1. Goal

Create the primary MLN131 presentation route:

```text
ThreeUI Library
  -> Book I
  -> HCM202-quality 3D Magazine
  -> page navigation / reading mode
  -> optional ThreeUI Explore interaction
  -> return to the exact page
  -> close
  -> Library
```

The first implementation milestone proves the engine with Book I. Books II-IV are not authored until the engine and Book I visual system are approved.

## 2. Non-goals

This spec does not implement:

- Museum.
- Firebase/minigame/RPG.
- Book II-IV substantive content.
- new custom R3F academic scenes.
- a replacement page-turn algorithm.
- a new animation system where HCM202 already provides one.

## 3. Reference behavior to preserve

From HCM202:

### `src/book/Book.jsx`

Preserve:

- segmented page geometry;
- skin indices and skin weights;
- 30-bone skeleton;
- `SkinnedMesh`;
- dynamic page bending;
- page-turn sequence timing;
- hover emissive response;
- front/back page material handling.

The MLN version may modernize allocations/lifecycle for the current R3F version, but the interaction behavior should remain recognizably the same.

### `src/book/Experience.jsx`

Preserve:

- showcase camera;
- reading camera;
- smooth camera interpolation;
- `Float` presentation behavior;
- OrbitControls in showcase mode;
- lighting/contact-shadow quality appropriate for the book.

### `src/book/UI.jsx`

Preserve the useful behavior, not its branding:

- page navigation;
- page number/progress;
- showcase/reading switch;
- close/back capability;
- page flip audio behavior.

### `src/book/PageParticles.jsx`

Preserve page-turn feedback, but make it theme-driven and optional under reduced motion.

## 4. Proposed file structure

```text
src/experiences/magazine/
  MagazineExperience.tsx
  MagazineScene.tsx
  MagazineBook.tsx
  MagazinePage.tsx
  MagazineChrome.tsx
  MagazineParticles.tsx
  magazineTypes.ts
  magazineSelectors.ts
  magazineKeyboard.ts
  volumes/
    book1.ts

src/experiences/interactive/
  ThreeUIExperience.tsx
  threeUIRegistry.ts
  threeUITypes.ts
```

No file should own both book geometry and application navigation.

## 5. Data model

```ts
export type MagazineViewMode = 'showcase' | 'reading';

export type MagazinePageKind =
  | 'cover'
  | 'editorial'
  | 'diagram'
  | 'transition'
  | 'back-cover';

export interface MagazineTheme {
  shellBackground: string;
  paperTone: string;
  accent: string;
  secondaryAccent: string;
}

export interface MagazineExploreAction {
  label: string;
  visualId: ThreeUIVisualId;
}

export interface MagazinePageContent {
  id: string;
  kind: MagazinePageKind;
  texture: string;
  alt: string;
  sourceIds?: string[];
  explore?: MagazineExploreAction;
}

export interface MagazineSheet {
  id: string;
  front: MagazinePageContent;
  back: MagazinePageContent;
}

export interface MagazineVolume {
  id: 'part1' | 'part2' | 'part3' | 'part4';
  roman: 'I' | 'II' | 'III' | 'IV';
  title: string;
  subtitle?: string;
  coverFront: MagazinePageContent;
  sheets: MagazineSheet[];
  coverBack: MagazinePageContent;
  theme: MagazineTheme;
}
```

Book geometry consumes `MagazineVolume`; it does not import academic content directly.

## 6. State and actions

Extend the existing presentation Zustand store rather than creating a second global store.

Required state:

```ts
experienceMode: 'cover' | 'library' | 'magazine' | 'interactive' | 'museum';
selectedBook: number;
magazinePage: number;
magazineViewMode: 'showcase' | 'reading';
interactiveVisual: ThreeUIVisualId | null;
interactiveReturn: InteractiveReturnTarget | null;
```

Required action semantics:

### `openBook(index)`

- validates that the requested volume exists;
- sets `selectedBook=index`;
- resets or restores page according to explicit product policy;
- sets `experienceMode='magazine'`.

For initial rollout, opening a volume starts at its cover.

### `closeMagazine()`

- sets `experienceMode='library'`;
- preserves `selectedBook`;
- clears transient magazine interaction state;
- does not reset the library selection.

### `setMagazinePage(page)`

- clamps to valid range;
- cannot produce undefined page state.

### `openInteractive(visualId, returnTarget)`

For magazine:

```ts
interactiveReturn = {
  mode: 'magazine',
  page: magazinePage
}
```

Then set `experienceMode='interactive'`.

### `closeInteractive()`

- returns to `interactiveReturn.mode`;
- restores magazine page when returning to magazine;
- clears interactive state.

## 7. Library handoff

The existing ThreeUI Bookshelf remains the entry surface.

For the first prototype:

- Book I is enabled.
- Books II-IV may remain guarded.
- Opening Book I no longer enters the rejected legacy chapter renderer.
- A 500-900ms transition may use crossfade + restrained scale/camera movement.
- Do not attempt geometry morphing between the Bookshelf mesh and Magazine book.

Library and Magazine must not remain mounted together after handoff completes.

## 8. Prototype volume

Before final content production, create one minimal Book I prototype:

- front cover;
- two interior spreads;
- back cover.

Cover copy:

```text
CHỦ NGHĨA XÃ HỘI KHOA HỌC

CHƯƠNG 5

QUYỂN I
CƠ CẤU XÃ HỘI – GIAI CẤP
```

Temporary interior pages must use MLN branding only and contain no HCM202/VNR historical content.

## 9. Book I editorial information architecture

After the engine prototype is visually accepted, Book I is expected to use approximately these editorial units:

```text
Cover

01-02  Cơ cấu xã hội là gì?
03-04  Cơ cấu xã hội – giai cấp
05-06  Vị trí quan trọng hàng đầu
07-08  Xu hướng 1: gắn với cơ cấu kinh tế
09-10  Xu hướng 2: phức tạp, đa dạng, tầng lớp mới
11-12  Xu hướng 3: đấu tranh, liên minh, xích lại gần nhau
13-14  Câu hỏi chuyển tiếp sang liên minh

Back cover
```

This is an editorial structure, not permission to invent or expand academic claims. Final wording comes from the approved content source.

## 10. ThreeUI interactive inserts

Interactive inserts are implemented only after normal Magazine reading is approved.

Suggested semantic mapping:

- `social-network` -> particle/constellation network;
- `class-relations` -> connectivity graph / orbital relation view;
- `economic-flow` -> structure flow;
- `diversification` -> particle network;
- `alliance-convergence` -> stream convergence;
- `chapter-transition` -> article heading / restrained field.

The actual ThreeUI component is selected by the registry.

A page may expose one explicit `Explore` action. Explore is never required to understand the basic page.

## 11. Keyboard ownership

When Magazine is active:

- ArrowRight: next page.
- Space: next page unless focus is in an editable/control element.
- ArrowLeft: previous page.
- Escape: close Magazine and return to Library.
- F: fullscreen behavior continues through the shared shell.
- O: return to Library only if this shortcut remains part of the global product contract.

Only the active experience may own presentation navigation keys.

## 12. Responsive behavior

Target:

- 1920x1080;
- 1366x768.

The book may use responsive camera framing rather than uniform CSS scaling.

Requirements:

- full cover readable at both sizes;
- open spread remains fully inside safe viewport;
- no controls cover the page text;
- reading mode uses the available viewport efficiently;
- navigation remains operable without hover;
- page edge/corners remain visible enough to communicate physical book form.

## 13. Asset policy

- Core presentation fonts must be local and Vietnamese-safe.
- Page textures are local.
- page flip audio is local.
- no runtime Google Fonts dependency in final presentation mode.
- any ThreeUI asset required by a live insert must be local or bundled through the package/build.
- meaningful images need source metadata in the content model or adjacent source manifest.

## 14. Performance/lifecycle requirements

- No simultaneous Bookshelf and Magazine Canvas after transition.
- Ported per-frame logic should reuse temporary Three.js objects where practical.
- No React state update from a high-frequency `useFrame` loop unless necessary.
- geometry/material/texture objects created manually must have explicit ownership and disposal rules.
- reduced motion disables optional particles and shortens/removes decorative float, but preserves page navigation.
- repeat Library -> Magazine -> Library 10 times without context loss or accumulating listeners.

## 15. Error handling

If volume data is invalid:

- do not enter a blank Magazine;
- remain or return to Library;
- surface a development-visible diagnostic;
- production audience UI should fail gracefully.

If a page texture fails:

- render a neutral fallback page with the page title/ID;
- page navigation remains usable.

If a ThreeUI insert fails to load:

- Magazine remains intact;
- show a restrained fallback;
- Escape/Back always returns to the source page.

## 16. Testing strategy

### Unit

- volume page-count normalization;
- page clamping;
- open/close transitions in store;
- interactive return target restoration;
- guarded unavailable volume behavior.

### Component/integration

- Magazine mounts from valid volume;
- view-mode toggle changes camera target;
- controls call the correct store actions;
- page navigation never exceeds boundaries.

### E2E

Mandatory path:

```text
Library
-> open Book I
-> next page
-> previous page
-> reading mode
-> showcase mode
-> close
-> Library
```

Repeat 10 cycles.

Later insert path:

```text
Magazine page N
-> Explore
-> Interactive
-> Escape
-> same Magazine page N
```

### Visual

Mandatory prototype screenshots:

- `M0-library-1920.png`
- `M0-magazine-cover-1920.png`
- `M0-magazine-open-1920.png`
- `M0-magazine-reading-1920.png`
- `M0-library-1366.png`
- `M0-magazine-open-1366.png`

No next milestone before manual visual approval.

## 17. Migration strategy

Do not delete legacy P1 custom scene code in the prototype milestone.

Route the audience flow away from it, mark it legacy, and remove only after the Magazine path is proven and rollback is no longer needed.

## 18. Acceptance criteria for Magazine Core

Magazine Core is accepted when:

- Book I opens directly from the ThreeUI Library.
- The book clearly preserves HCM202 page-turn quality.
- Showcase and reading modes work.
- closing returns to Library with Book I selected.
- one Canvas/major experience is active at a time.
- repeated cycles remain stable.
- 1920 and 1366 screenshots are visually approved.
- no HCM202/VNR branding leaks into the MLN prototype.
- no substantive Part II content is introduced.
