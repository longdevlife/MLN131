# MLN131 Magazine Core M0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the rejected custom Part I visual route with a stable prototype flow that opens Book I from the existing ThreeUI Library into the proven HCM202-style 3D Magazine engine, supports page navigation and reading/showcase modes, then closes back to the same selected book.

**Architecture:** Keep MLN131's current presentation shell, Zustand store, presenter infrastructure, ThreeUI Bookshelf, PWA and legacy scene code. Introduce `experienceMode` as the top-level audience-experience state while retaining `viewMode` only as a compatibility substate for the legacy cover/library/chapter path. Port HCM202's page-turn mechanics into a new data-driven `src/experiences/magazine/` subsystem, mount exactly one major WebGL experience at a time, and stop after the M0 screenshots are produced.

**Tech Stack:** React 19.2.0, TypeScript 6, Vite 8.3.0, Zustand 5.0.15, Three 0.170.0, @react-three/fiber 9.7.0, @react-three/drei 10.7.8, @designcodeio/threeui 1.2.0, Vitest 5, Playwright 1.63, maath 0.10.8 for the proven HCM202 damping behavior.

**Spec:** `docs/superpowers/specs/2026-09-20-mln131-magazine-core-design.md`

## Global Constraints

- Baseline behavior comes from MLN131 `309dbe150b3b70dfe5c2762a95fe3b7de4f85594`; do not revive or expand the rejected custom P1.S2-P1.S7 visual route.
- Reference mechanics come from HCM202 `d19c0d8557ce64778574c74ede16c66ffec95a53`, specifically `src/book/Book.jsx`, `BookPage.jsx`, `Experience.jsx`, `UI.jsx`, and `PageParticles.jsx`.
- Do **not** port `HCM202/src/components/UI.jsx`; it is a legacy book UI.
- Do **not** add Jotai. MLN131 Zustand remains the only global presentation state.
- Do **not** downgrade React/R3F/Drei/Three.
- Adding `maath@^0.10.8` is permitted because it is a direct dependency of the proven HCM202 page-bending algorithm.
- M0 implements only Book I prototype: cover + two interior sheets/spreads + back cover. No final academic page production.
- Books II-IV remain unavailable/guarded in M0.
- ThreeUI interactive inserts, Museum, Firebase, Host/Player, RPG, minigame, and substantive Part II content are out of scope.
- At most one major audience Canvas may be mounted after a transition settles.
- Core fonts, page textures, and page-flip audio must be local. No new runtime Google Fonts request.
- Required presentation sizes: 1920x1080 and 1366x768.
- Automated tests do not constitute visual approval.
- AGY must STOP after M0 screenshots and report. Do not begin M1.

## Review Focus

1. **State split-brain:** `experienceMode` is authoritative while legacy `viewMode` remains for compatibility; opening/closing Magazine must never leave the shell in contradictory visible states. Task 2 pins this with store tests.
2. **Keyboard ownership:** Magazine must receive Space/Arrow navigation without the legacy scene navigation also firing. Task 6 pins this with unit/E2E coverage.
3. **WebGL lifecycle:** repeated Library -> Magazine -> Library must not leave hidden canvases, leaked listeners, or context-loss errors. Task 7 runs 10 cycles and asserts canvas ownership.
4. **Invalid/partial volume data:** unavailable Book II-IV, invalid indices, and out-of-range pages must not enter a blank Magazine. Tasks 1-2 cover normalization and guards.
5. **Projector composition:** open-spread framing and Magazine chrome must fit both target resolutions without clipping or HCM202 branding leaks. Task 8 owns screenshot assertions and visual gate.

---

## File Structure Locked By This Plan

### Create

```text
src/experiences/magazine/
  MagazineExperience.tsx      # top-level magazine screen; owns Canvas + chrome composition
  MagazineScene.tsx           # R3F lights/camera/book/particles only
  MagazineBook.tsx            # sheet sequencing and delayed page-turn orchestration
  MagazinePage.tsx            # one skinned physical sheet
  MagazineChrome.tsx          # HTML controls, close, page indicator, view toggle
  MagazineParticles.tsx       # optional reduced-motion-aware page-flip sparkles
  magazineTypes.ts            # public data contracts
  magazineModel.ts            # pure normalization/page-count helpers
  magazine.css                # local magazine-only styles
  volumes/
    book1.ts                  # M0 prototype volume only

tests/unit/magazineModel.test.ts
tests/e2e/magazine-m0.spec.ts
```

### Modify

```text
package.json
src/state/presentationStore.ts
src/presentation/PresentationShell.tsx
src/presentation/VisualStage.tsx
src/hooks/useKeyboardNavigation.ts
src/presenter/broadcast.ts
src/presenter/PresenterConsole.tsx
tests/unit/presentationStore.test.ts
```

### Add local assets

Use project-owned/generated MLN placeholder artwork; do not copy HCM/VNR page artwork.

```text
public/magazine/book1/cover-front.png
public/magazine/book1/spread-01-front.png
public/magazine/book1/spread-01-back.png
public/magazine/book1/spread-02-front.png
public/magazine/book1/spread-02-back.png
public/magazine/book1/cover-back.png
public/audios/page-flip-01a.mp3
```

If the HCM202 audio file is reused, copy the existing local file from the owner's HCM202 repository. Do not substitute a remote URL.

---

### Task 1: Establish the Magazine domain model and M0 Book I registry

**Files:**
- Create: `src/experiences/magazine/magazineTypes.ts`
- Create: `src/experiences/magazine/magazineModel.ts`
- Create: `src/experiences/magazine/volumes/book1.ts`
- Create: `tests/unit/magazineModel.test.ts`

**Interfaces:**
- Produces:
  - `MagazineViewMode`
  - `MagazinePageContent`
  - `MagazineSheet`
  - `MagazineVolume`
  - `getMagazineVolume(index: number): MagazineVolume | null`
  - `getMagazinePageCount(volume: MagazineVolume): number`
  - `clampMagazinePage(volume: MagazineVolume, page: number): number`
  - `getMagazinePhysicalSheets(volume: MagazineVolume): Array<{front:string;back:string}>`
- Consumes: no new application state.

- [ ] **Step 1: Write the failing domain tests**

Create `tests/unit/magazineModel.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  clampMagazinePage,
  getMagazinePageCount,
  getMagazinePhysicalSheets,
  getMagazineVolume,
} from '../../src/experiences/magazine/magazineModel';

describe('magazineModel', () => {
  it('registers only Book I during M0', () => {
    expect(getMagazineVolume(0)?.id).toBe('part1');
    expect(getMagazineVolume(1)).toBeNull();
    expect(getMagazineVolume(2)).toBeNull();
    expect(getMagazineVolume(3)).toBeNull();
  });

  it('normalizes Book I into physical sheets with cover and back cover', () => {
    const volume = getMagazineVolume(0)!;
    const sheets = getMagazinePhysicalSheets(volume);

    expect(sheets.length).toBe(3);
    expect(sheets[0].front).toBe('/magazine/book1/cover-front.png');
    expect(sheets[2].back).toBe('/magazine/book1/cover-back.png');
  });

  it('exposes page positions from closed front cover through closed back cover', () => {
    const volume = getMagazineVolume(0)!;
    expect(getMagazinePageCount(volume)).toBe(4);
  });

  it('clamps invalid page positions', () => {
    const volume = getMagazineVolume(0)!;
    expect(clampMagazinePage(volume, -10)).toBe(0);
    expect(clampMagazinePage(volume, 2)).toBe(2);
    expect(clampMagazinePage(volume, 99)).toBe(3);
    expect(clampMagazinePage(volume, Number.NaN)).toBe(0);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- tests/unit/magazineModel.test.ts
```

Expected: FAIL because the Magazine model files do not exist.

- [ ] **Step 3: Implement the types**

Create `magazineTypes.ts` with exactly these public types:

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

export interface MagazinePageContent {
  id: string;
  kind: MagazinePageKind;
  texture: string;
  alt: string;
  sourceIds?: string[];
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

M0 intentionally omits `explore`; ThreeUI inserts are not part of this implementation phase.

- [ ] **Step 4: Implement prototype Book I data**

Create `volumes/book1.ts` with local MLN asset paths only.

Use this identity:

```ts
export const book1Volume: MagazineVolume = {
  id: 'part1',
  roman: 'I',
  title: 'Cơ cấu xã hội – giai cấp',
  subtitle: 'Chương 5 · Chủ nghĩa xã hội khoa học',
  coverFront: {
    id: 'book1-cover-front',
    kind: 'cover',
    texture: '/magazine/book1/cover-front.png',
    alt: 'Bìa Quyển I: Cơ cấu xã hội – giai cấp',
  },
  sheets: [
    {
      id: 'book1-sheet-01',
      front: {
        id: 'book1-prototype-01',
        kind: 'editorial',
        texture: '/magazine/book1/spread-01-front.png',
        alt: 'Trang thử nghiệm editorial thứ nhất',
      },
      back: {
        id: 'book1-prototype-02',
        kind: 'editorial',
        texture: '/magazine/book1/spread-01-back.png',
        alt: 'Trang thử nghiệm editorial thứ hai',
      },
    },
    {
      id: 'book1-sheet-02',
      front: {
        id: 'book1-prototype-03',
        kind: 'editorial',
        texture: '/magazine/book1/spread-02-front.png',
        alt: 'Trang thử nghiệm editorial thứ ba',
      },
      back: {
        id: 'book1-prototype-04',
        kind: 'editorial',
        texture: '/magazine/book1/spread-02-back.png',
        alt: 'Trang thử nghiệm editorial thứ tư',
      },
    },
  ],
  coverBack: {
    id: 'book1-cover-back',
    kind: 'back-cover',
    texture: '/magazine/book1/cover-back.png',
    alt: 'Bìa sau Quyển I',
  },
  theme: {
    shellBackground: '#0B0D10',
    paperTone: '#F1E7D2',
    accent: '#C8A86A',
    secondaryAccent: '#A96D45',
  },
};
```

- [ ] **Step 5: Implement pure model helpers**

`getMagazinePhysicalSheets()` must return:

```text
sheet 0: coverFront -> first interior front
sheet 1: first interior back -> second interior front/back according to physical ordering
...
final physical sheet back -> coverBack
```

For M0, preserve the HCM202 physical-sheet model: one array entry equals one skinned sheet with one front texture and one back texture. Do not treat every visual page as a separate mesh.

Make the exact M0 result match the test: three physical sheets and four page positions (front closed = 0, two opened positions, back closed = 3).

- [ ] **Step 6: Run focused tests**

Run:

```bash
npm test -- tests/unit/magazineModel.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/experiences/magazine tests/unit/magazineModel.test.ts
git commit -m "feat(magazine): add M0 volume model"
```

---

### Task 2: Add authoritative `experienceMode` and Magazine state transitions

**Files:**
- Modify: `src/state/presentationStore.ts`
- Modify: `tests/unit/presentationStore.test.ts`

**Interfaces:**
- Consumes: `getMagazineVolume`, `clampMagazinePage`.
- Produces:
  - `ExperienceMode = 'cover' | 'library' | 'magazine' | 'interactive' | 'museum'`
  - `experienceMode`
  - `selectedBook`
  - `magazinePage`
  - `magazineViewMode`
  - `openBook(index)`
  - `closeMagazine()`
  - `setMagazinePage(page)`
  - `setMagazineViewMode(mode)`
  - `toggleMagazineViewMode()`

**Compatibility rule:** `experienceMode` becomes authoritative for which top-level audience experience is mounted. Existing `viewMode: 'cover' | 'library' | 'chapter'` remains temporarily for the legacy renderer/presenter scene model. During M0, Magazine actions must leave legacy state internally valid, but audience rendering must follow `experienceMode`.

- [ ] **Step 1: Add failing store tests**

Append tests that reset the store before each case and assert:

```ts
it('opens only available Book I into Magazine', () => {
  usePresentationStore.getState().openLibrary();
  usePresentationStore.getState().openBook(0);

  const state = usePresentationStore.getState();
  expect(state.experienceMode).toBe('magazine');
  expect(state.selectedBook).toBe(0);
  expect(state.magazinePage).toBe(0);
  expect(state.magazineViewMode).toBe('showcase');
});

it('guards unavailable Books II-IV without leaving Library', () => {
  usePresentationStore.getState().openLibrary();
  usePresentationStore.getState().openBook(1);

  const state = usePresentationStore.getState();
  expect(state.experienceMode).toBe('library');
  expect(state.selectedBook).toBe(1);
});

it('closes Magazine back to selected Book I', () => {
  usePresentationStore.getState().openBook(0);
  usePresentationStore.getState().setMagazinePage(2);
  usePresentationStore.getState().closeMagazine();

  const state = usePresentationStore.getState();
  expect(state.experienceMode).toBe('library');
  expect(state.selectedBook).toBe(0);
  expect(state.magazinePage).toBe(0);
});

it('clamps Magazine pages', () => {
  usePresentationStore.getState().openBook(0);
  usePresentationStore.getState().setMagazinePage(99);
  expect(usePresentationStore.getState().magazinePage).toBe(3);
});

it('keeps legacy viewMode valid while Magazine is active', () => {
  usePresentationStore.getState().openLibrary();
  usePresentationStore.getState().openBook(0);
  expect(['cover', 'library', 'chapter']).toContain(usePresentationStore.getState().viewMode);
});
```

- [ ] **Step 2: Run the store tests and verify RED**

```bash
npm test -- tests/unit/presentationStore.test.ts
```

Expected: FAIL on missing Magazine state/actions.

- [ ] **Step 3: Extend the store types and initial state**

Add:

```ts
export type ExperienceMode =
  | 'cover'
  | 'library'
  | 'magazine'
  | 'interactive'
  | 'museum';
```

State defaults:

```ts
experienceMode: 'cover',
selectedBook: 0,
magazinePage: 0,
magazineViewMode: 'showcase',
```

Do not add `interactiveVisual` or museum fields in M0 unless required solely for type compatibility. YAGNI.

- [ ] **Step 4: Make cover/library actions synchronize the authoritative experience**

Required behavior:

```ts
startPresentation: () =>
  set({ experienceMode: 'library', viewMode: 'library', direction: 1 }),

openCover: () =>
  set({ experienceMode: 'cover', viewMode: 'cover', direction: -1 }),

openLibrary: () =>
  set({
    experienceMode: 'library',
    viewMode: 'library',
    chapterIndex: get().selectedBook,
    direction: -1,
  }),
```

- [ ] **Step 5: Implement Book I actions**

```ts
openBook: (index) => {
  const selectedBook = Math.max(0, Math.min(3, index));
  const volume = getMagazineVolume(selectedBook);

  if (!volume) {
    set({
      experienceMode: 'library',
      viewMode: 'library',
      selectedBook,
      chapterIndex: selectedBook,
      magazinePage: 0,
    });
    return;
  }

  set({
    experienceMode: 'magazine',
    viewMode: 'library',
    selectedBook,
    chapterIndex: selectedBook,
    magazinePage: 0,
    magazineViewMode: 'showcase',
    direction: 1,
  });
},
```

`closeMagazine()` must return to Library and reset transient page/view state while preserving `selectedBook`.

- [ ] **Step 6: Route `next()` and `prev()` through Magazine first**

At the top of both actions:

```ts
if (state.experienceMode === 'magazine') {
  // next/prev magazine page and return immediately
}
```

Do not let legacy beat navigation execute when Magazine owns the screen.

- [ ] **Step 7: Run tests**

```bash
npm test -- tests/unit/presentationStore.test.ts
```

Expected: all old tests + new Magazine tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/state/presentationStore.ts tests/unit/presentationStore.test.ts
git commit -m "feat(state): add magazine experience transitions"
```

---

### Task 3: Port the HCM202 skinned page-turn engine without Jotai

**Files:**
- Modify: `package.json`
- Create: `src/experiences/magazine/MagazinePage.tsx`
- Create: `src/experiences/magazine/MagazineBook.tsx`

**Interfaces:**
- Consumes:
  - `MagazineVolume`
  - `magazinePage`
  - `setMagazinePage(page)`
- Produces:
  - `<MagazineBook volume={volume} page={page} onPageChange={fn} />`
  - private `<MagazinePage ... />`

- [ ] **Step 1: Add the exact missing HCM dependency**

Run:

```bash
npm install maath@^0.10.8
```

Do not install Jotai, Leva, three-stdlib, or HCM202's old React/R3F versions.

- [ ] **Step 2: Port constants and geometry from HCM202**

Preserve:

```ts
const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;
```

Preserve BoxGeometry segmentation, translation, `skinIndex`, and `skinWeight` construction.

Use public Three imports; do not import `degToRad` from a Three internal source path. Use:

```ts
THREE.MathUtils.degToRad(...)
```

- [ ] **Step 3: Port `MagazinePage` with explicit props**

Required signature:

```ts
interface MagazinePageProps {
  number: number;
  front: string;
  back: string;
  currentPage: number;
  opened: boolean;
  bookClosed: boolean;
  reducedMotion: boolean;
  onRequestPage(page: number): void;
}
```

Replace HCM202 Jotai click behavior with `onRequestPage(opened ? number : number + 1)`.

- [ ] **Step 4: Preserve the HCM202 skeleton mechanics**

For each physical page:

- create 31 bones;
- build one `Skeleton`;
- create front/back `MeshStandardMaterial` with the loaded textures;
- create `SkinnedMesh`;
- bind skeleton;
- set `frustumCulled=false`.

The HCM202 front/back roughness and subtle hover emissive behavior should remain recognizable, but use Book I theme accent instead of HCM red.

- [ ] **Step 5: Fix resource ownership while porting**

Unlike HCM202, the MLN port must explicitly dispose resources owned per page.

On unmount:

- dispose front/back page materials created for that page;
- do not dispose shared module-level geometry while another page uses it;
- do not dispose `useTexture` cached textures manually unless the component explicitly owns a cloned texture;
- never dispose Drei-managed cache objects blindly.

No new Three.js object/array allocation should be added inside `useFrame`.

- [ ] **Step 6: Preserve page bending behavior**

Port the HCM logic for:

- `insideCurveStrength = 0.18`
- `outsideCurveStrength = 0.05`
- `turningCurveStrength = 0.09`
- `easingFactor = 0.5`
- `easingFactorFold = 0.3`
- turning-time sine pulse;
- per-page slight Y offset when book is open;
- closed-cover pose.

Use `easing.dampAngle(..., delta)` from `maath`.

When `reducedMotion=true`, keep the physical page state correct but reduce decorative turn duration/fold intensity instead of removing navigation.

- [ ] **Step 7: Port delayed sequential page turning into `MagazineBook`**

Required signature:

```ts
interface MagazineBookProps {
  volume: MagazineVolume;
  page: number;
  reducedMotion: boolean;
  onPageChange(page: number): void;
}
```

Keep the proven HCM behavior:

```text
distance > 2 pages -> 50 ms between sequential turns
distance <= 2 pages -> 150 ms
```

For reduced motion, shorten the delay enough to remain responsive but do not jump into an invalid intermediate geometry state.

- [ ] **Step 8: Build-check the port before integration**

Run:

```bash
npm run build
```

Expected: TypeScript + Vite build PASS with React 19 / R3F 9.

If the port requires downgrading React/R3F/Drei, STOP and report instead of downgrading.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json src/experiences/magazine/MagazinePage.tsx src/experiences/magazine/MagazineBook.tsx
git commit -m "feat(magazine): port HCM skinned page-turn engine"
```

---

### Task 4: Port camera, particles, chrome, and create MLN-only prototype assets

**Files:**
- Create: `src/experiences/magazine/MagazineScene.tsx`
- Create: `src/experiences/magazine/MagazineParticles.tsx`
- Create: `src/experiences/magazine/MagazineChrome.tsx`
- Create: `src/experiences/magazine/MagazineExperience.tsx`
- Create: `src/experiences/magazine/magazine.css`
- Add: `public/magazine/book1/*.png`
- Add: `public/audios/page-flip-01a.mp3`

**Interfaces:**
- Consumes store selectors/actions from Task 2 and `getMagazineVolume()`.
- Produces `<MagazineExperience />`.

- [ ] **Step 1: Port the HCM camera targets**

Start from HCM202:

```ts
const SHOWCASE_POS = new THREE.Vector3(0, 1.2, 5);
const READING_POS = new THREE.Vector3(0, 0.6, 3);
```

Use a module-level target vector, no allocation in `useFrame`.

Camera damping must be delta-aware. Preserve the HCM visual target first; only adjust target coordinates after screenshot evidence.

- [ ] **Step 2: Port scene lighting and controls**

`MagazineScene` contains only WebGL concerns:

- `CameraAnimator`
- `Float`
- `MagazineBook`
- `MagazineParticles`
- `OrbitControls`
- ambient/hemisphere/key/fill lights
- `ContactShadows`

In reading mode:

- disable free OrbitControls rotation/pan;
- keep deliberate zoom behavior only if it does not interfere with page reading.

In showcase mode:

- enable OrbitControls with HCM-equivalent min/max distance.

- [ ] **Step 3: Port page particles with reduced-motion guard**

Use HCM202's two `Sparkles` bursts as the starting point.

Rules:

```ts
if (reducedMotion) return null;
```

The timer must be cleaned up on page changes/unmount.

Use Magazine theme colors, not HCM red.

- [ ] **Step 4: Build `MagazineChrome` from HCM behavior, not HCM branding**

Required visible controls:

- Close / Library.
- Previous.
- Next.
- page indicator.
- Reading / 3D View toggle.

Required accessible names:

```text
"Đóng tạp chí"
"Trang trước"
"Trang tiếp"
"Chuyển sang chế độ đọc"
"Chuyển sang chế độ 3D"
```

Do not include:

- `Tạp Chí Lịch Sử Đảng`
- `VNR-T17`
- `Sản Xuất Bung Ra`
- `1979-1981`
- HCM-specific issue stamps.

- [ ] **Step 5: Create M0 visual assets**

Do not reuse the rejected P1 scene screenshots as magazine pages.

Create clean prototype page artwork with:

```text
Cover:
CHỦ NGHĨA XÃ HỘI KHOA HỌC
CHƯƠNG 5
QUYỂN I
CƠ CẤU XÃ HỘI – GIAI CẤP
```

Interior prototype pages may contain only neutral labels such as:

```text
01 / KHÁI NIỆM
Editorial prototype

02 / CẤU TRÚC
Visual prototype
```

The purpose is to judge page material, typography, scale, and book composition—not final academic content.

Use local Vietnamese-safe typography. Do not add external webfont imports.

- [ ] **Step 6: Implement `MagazineExperience`**

Structure:

```tsx
<div className="magazine-experience">
  <Canvas ...>
    <Suspense fallback={null}>
      <MagazineScene ... />
    </Suspense>
  </Canvas>
  <MagazineChrome ... />
</div>
```

Canvas requirements:

- one canvas;
- `dpr={[1, 1.5]}` or current performance-tier equivalent;
- high-performance preference;
- stable camera initial position matching showcase target.

Expose a root class `.magazine-experience` for E2E.

- [ ] **Step 7: Play local page-flip audio from chrome/state transition**

Do not instantiate audio every render.

Keep one ref/preloaded Audio element per mounted Magazine experience and trigger on actual page change after initial cover.

`audio.play().catch(() => {})` remains non-fatal.

- [ ] **Step 8: Build**

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/experiences/magazine public/magazine/book1 public/audios/page-flip-01a.mp3
git commit -m "feat(magazine): add HCM-quality magazine experience"
```

---

### Task 5: Integrate Library -> Magazine -> Library with exclusive renderer ownership

**Files:**
- Modify: `src/presentation/PresentationShell.tsx`
- Modify: `src/presentation/VisualStage.tsx`

**Interfaces:**
- Consumes: `experienceMode`, `openBook()`, `MagazineExperience`.
- Produces: exclusive top-level experience routing.

- [ ] **Step 1: Make the shell gate legacy overlays by `experienceMode`**

The shell must not mount legacy chapter chrome on top of Magazine.

Conceptually:

```tsx
const experienceMode = usePresentationStore((s) => s.experienceMode);
const isLegacyPresentation =
  experienceMode === 'cover' || experienceMode === 'library';

return (
  <div className="presentation-shell">
    <KeyboardController />
    {isLegacyPresentation && <ProgressBar />}
    {experienceMode === 'library' && <ChapterRail />}
    {experienceMode === 'cover' && <CoverScreen />}
    <VisualStage />
    {experienceMode !== 'magazine' && <ContentOverlay />}
    <BlackoutLayer />
  </div>
);
```

Legacy `chapter` rendering remains reachable only as rollback/dev compatibility if explicitly entered, not from normal Book I open.

- [ ] **Step 2: Route Bookshelf open to `openBook`**

In `VisualStage.tsx`:

```ts
const experienceMode = usePresentationStore((s) => s.experienceMode);
const openBook = usePresentationStore((s) => s.openBook);
```

Library path:

```tsx
<BookshelfScene
  initialIndex={selectedBook}
  onOpenBook={(index) => openBook(index)}
  onSelectBook={(index) => set selectedBook/chapterIndex }
/>
```

Do not call `openChapter(index)` for normal Book I open.

- [ ] **Step 3: Mount Magazine exclusively**

Before legacy chapter routing:

```tsx
if (experienceMode === 'magazine') {
  return <MagazineExperience />;
}
```

When Magazine is mounted, Bookshelf must not exist in the DOM.

When Library is mounted, Magazine must not exist in the DOM.

- [ ] **Step 4: Keep Safe Mode graceful**

M0 rule:

- Safe tier may render a non-WebGL Magazine fallback only if one already exists cheaply.
- If not implemented in M0, Magazine can still use the regular engine while retaining existing Library safe mode, but document this as a known issue for M1.
- Do not build a second large safe-mode subsystem during M0.

- [ ] **Step 5: Run unit + build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/presentation/PresentationShell.tsx src/presentation/VisualStage.tsx
git commit -m "feat(presentation): route Book I into magazine experience"
```

---

### Task 6: Give Magazine exclusive keyboard ownership and synchronize Presenter state

**Files:**
- Modify: `src/hooks/useKeyboardNavigation.ts`
- Modify: `src/presenter/broadcast.ts`
- Modify: `src/presentation/PresentationShell.tsx`
- Modify: `src/presenter/PresenterConsole.tsx`
- Modify: `tests/unit/presentationStore.test.ts`

**Interfaces:**
- Consumes: Task 2 store actions.
- Produces: deterministic keyboard/presenter behavior in Magazine.

- [ ] **Step 1: Add store-level navigation assertions**

Add tests proving:

- `next()` advances Magazine page only when `experienceMode='magazine'`.
- `prev()` rewinds Magazine page only.
- `closeMagazine()` does not alter selected Book I.
- `openLibrary()` from Magazine exits Magazine.

- [ ] **Step 2: Route keyboard by authoritative `experienceMode`**

At the beginning of `handleKeyDown`:

```ts
const state = usePresentationStore.getState();

if (state.experienceMode === 'magazine') {
  switch (e.code) {
    case 'Space':
    case 'ArrowRight':
    case 'PageDown':
      e.preventDefault();
      state.next();
      return;
    case 'ArrowLeft':
    case 'PageUp':
      e.preventDefault();
      state.prev();
      return;
    case 'Escape':
    case 'KeyO':
      e.preventDefault();
      state.closeMagazine();
      return;
    default:
      break;
  }
}
```

Then fall through to global F/B behavior if desired.

Do not run the old `viewMode==='library'` handler while Magazine is active.

- [ ] **Step 3: Make Digit1 open Book I from Library**

When the audience is in Library:

- Digit1 selects and opens Book I.
- Digit2-4 select their unavailable book but remain in Library.

Do not route Digit1 into `jumpToChapter(0)` in the normal audience flow.

- [ ] **Step 4: Extend BroadcastChannel payload compatibly**

Update `PresentationSyncMessage` and `postState()` to include optional:

```ts
experienceMode?: ExperienceMode;
selectedBook?: number;
magazinePage?: number;
magazineViewMode?: MagazineViewMode;
```

Keep legacy fields so existing chapter presenter behavior compiles.

Audience receiver applies Magazine fields only when present.

- [ ] **Step 5: Give Presenter Console a minimal Magazine state view**

When `experienceMode==='magazine'`, the console must not claim an old scene is "currently showing."

Show:

```text
QUYỂN I
Cơ cấu xã hội – giai cấp
Trang: X / N
Chế độ: Showcase | Reading
```

Presenter buttons:

- Previous -> `prev()`
- Next -> `next()`
- Library -> `closeMagazine()`
- Blackout remains global.

Do not implement final Magazine speaker notes in M0.

- [ ] **Step 6: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useKeyboardNavigation.ts src/presenter/broadcast.ts src/presentation/PresentationShell.tsx src/presenter/PresenterConsole.tsx tests/unit/presentationStore.test.ts
git commit -m "feat(presentation): synchronize magazine controls and presenter"
```

---

### Task 7: Add deterministic M0 E2E and 10-cycle WebGL lifecycle test

**Files:**
- Create: `tests/e2e/magazine-m0.spec.ts`

**Interfaces:**
- Uses public UI/keyboard only; may read lifecycle debug counters if explicitly exposed for testing.
- Must not call internal store actions to fake the user path except diagnostic assertions.

- [ ] **Step 1: Write the failing core-flow E2E**

Test:

```text
open cover
-> open Library
-> verify one Bookshelf canvas
-> Digit1
-> verify Magazine root + one canvas
-> next page
-> previous page
-> toggle Reading
-> toggle Showcase
-> Escape
-> verify Library + one Bookshelf canvas
-> Book I still selected
```

Selectors must rely on accessible roles/names and stable root classes.

- [ ] **Step 2: Add HCM-branding negative assertions**

While Magazine is visible:

```ts
await expect(page.getByText(/VNR-T17/i)).toHaveCount(0);
await expect(page.getByText(/Sản Xuất Bung Ra/i)).toHaveCount(0);
await expect(page.getByText(/Tạp Chí Lịch Sử Đảng/i)).toHaveCount(0);
```

- [ ] **Step 3: Add unavailable-book guard tests**

From Library:

- select/open Book II;
- assert Bookshelf remains visible;
- assert Magazine root absent;
- repeat for keyboard Digit2.

- [ ] **Step 4: Add 10-cycle lifecycle test**

Track:

- `pageerror`
- console WebGL/context/shader errors
- `webglcontextlost` events by attaching listeners to canvases when mounted.

Loop 10 times:

```text
Library
-> Book I Magazine
-> one page turn
-> Escape
-> Library
```

After each settled state:

```ts
expect(await page.locator('canvas').count()).toBe(1);
```

Do not count a brief overlap during the intentional crossfade unless both canvases actually render concurrently after transition completion. Prefer DOM-exclusive transitions so the invariant is simple.

- [ ] **Step 5: Run the focused E2E**

```bash
npx playwright test tests/e2e/magazine-m0.spec.ts --project=chromium
```

Expected: PASS.

- [ ] **Step 6: Run existing E2E and identify intentional obsolete tests**

```bash
npm run test:e2e
```

Existing tests that explicitly expect Digit1 to enter P1.S0 will now be obsolete by architecture. Do not silently weaken them.

Either:

1. preserve them behind an explicit legacy/dev URL path; or
2. replace those assertions with Magazine M0 flow where they represent the audience route.

Document every changed E2E expectation in the final report.

- [ ] **Step 7: Commit**

```bash
git add tests/e2e
git commit -m "test(magazine): cover M0 flow and WebGL lifecycle"
```

---

### Task 8: Generate the exact visual proof, run full verification, and STOP

**Files:**
- Modify/Create screenshot helper only inside `tests/e2e/magazine-m0.spec.ts` if needed.
- Generate artifacts under `artifacts/screenshots/magazine-m0/`.

**Interfaces:**
- No new product interface.
- Produces review evidence.

- [ ] **Step 1: Add screenshot capture at 1920x1080**

Generate exactly:

```text
artifacts/screenshots/magazine-m0/M0-library-1920.png
artifacts/screenshots/magazine-m0/M0-magazine-cover-1920.png
artifacts/screenshots/magazine-m0/M0-magazine-open-1920.png
artifacts/screenshots/magazine-m0/M0-magazine-reading-1920.png
```

Before each capture assert:

- no document-level horizontal overflow;
- exactly one canvas;
- Magazine buttons do not overlap page bounds;
- visible MLN cover title for cover screenshot.

- [ ] **Step 2: Add screenshot capture at 1366x768**

Generate exactly:

```text
artifacts/screenshots/magazine-m0/M0-library-1366.png
artifacts/screenshots/magazine-m0/M0-magazine-open-1366.png
```

For open-spread screenshots, calculate the book canvas bounding rect and control bounding rects. Assert no control overlaps the central 60% book reading area unless intentionally overlaid.

- [ ] **Step 3: Wait for stable animation state before screenshots**

Do not use a blind 500ms if the book is still moving.

Expose a test-only stable condition such as:

```text
data-magazine-settled="true"
```

when delayed page state matches target page and camera transition is settled.

Playwright waits for that condition before capture.

- [ ] **Step 4: Run full verification in this exact order**

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

Record exact output. Do not summarize failed commands as passing.

- [ ] **Step 5: Inspect runtime network requests**

During the real WebGL Magazine test, fail on new requests to:

```text
fonts.googleapis.com
fonts.gstatic.com
cdn.jsdelivr.net
unpkg.com
```

This M0 Magazine path must use local page/font/audio assets.

- [ ] **Step 6: Manually inspect the six screenshots before reporting**

AGY must inspect and explicitly report:

- cover alignment;
- page legibility;
- physical page bend;
- open-spread framing;
- chrome density;
- 1366 clipping;
- any visual regression from HCM202's book feel.

AGY cannot mark visual approval; only the reviewer/user can.

- [ ] **Step 7: Commit final M0 evidence**

```bash
git add artifacts/screenshots/magazine-m0 tests/e2e/magazine-m0.spec.ts
git commit -m "test(magazine): add M0 visual proof"
```

- [ ] **Step 8: Return the M0 acceptance report and STOP**

Required report format:

```markdown
# M0 Magazine Prototype Report

## Commit
<full SHA>

## Baselines
MLN131: 309dbe150b3b70dfe5c2762a95fe3b7de4f85594
HCM202 reference: d19c0d8557ce64778574c74ede16c66ffec95a53

## Changed files
<exact list>

## Port fidelity
- Book skeleton:
- page bend:
- sequential turn:
- showcase camera:
- reading camera:
- page particles:
- local audio:

## Verification
### lint
<exact output>
### unit
<exact output>
### build
<exact output>
### e2e
<exact output>

## Lifecycle
10 Library -> Magazine -> Library cycles:
<evidence>

## Network
External font/CDN requests:
<evidence>

## Screenshots
- M0-library-1920.png
- M0-magazine-cover-1920.png
- M0-magazine-open-1920.png
- M0-magazine-reading-1920.png
- M0-library-1366.png
- M0-magazine-open-1366.png

## Known issues
<real issues only>

## STOP
No M1, Museum, ThreeUI inserts, Part II, or minigame work started.
```

STOP.

---

## Plan Self-Review

### Spec coverage

- HCM202 page mechanics: Tasks 3-4.
- Zustand-only state: Task 2.
- Library handoff and exclusive Canvas: Task 5.
- keyboard/presenter compatibility: Task 6.
- invalid volume/page handling: Tasks 1-2.
- local assets/offline discipline: Tasks 4 and 8.
- repeated lifecycle: Task 7.
- 1920/1366 visual gate: Task 8.
- no Part II / Museum / minigame: Global Constraints + STOP.
- legacy scene rollback retained: Tasks 2 and 5 do not delete old scenes.

### Placeholder scan

No TBD/TODO/“implement later” instructions are permitted. ThreeUI inserts and Museum are intentionally out of scope, not placeholders.

### Type consistency

- `MagazineViewMode` comes from `magazineTypes.ts`.
- `experienceMode` is authoritative top-level state.
- `viewMode` remains the existing legacy compatibility state.
- `openBook`, `closeMagazine`, `setMagazinePage`, and `setMagazineViewMode` are defined in Task 2 and consumed by later tasks.
- `MagazineExperience` is created in Task 4 and mounted in Task 5.

### Review Focus coverage

All five Review Focus items have explicit tests or screenshot assertions in Tasks 1, 2, 6, 7, and 8.
