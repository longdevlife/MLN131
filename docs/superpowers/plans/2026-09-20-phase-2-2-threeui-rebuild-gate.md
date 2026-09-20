# Phase 2.2: ThreeUI Visual Rebuild (Critical Gate: P1.S3 & P1.S4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the visual layer of P1.S3 (Position and Reciprocal Relations) and P1.S4 (Economic Structure -> Class Structure) using official ThreeUI components (`@designcodeio/threeui`), strictly adhering to the 70% visual / 30% typographic ratio, removing all clunky cards/primitive spheres, and capturing the 4 mandatory review screenshots.

**Architecture:** 
- In P1.S3: Replace the custom R3F spheres, rings, and HTML cards with ThreeUI `OrbitalSphereBackground` (15,000 luminous particles, elegant orbits, dynamic pulse), layered with an ultra-sparse academic typographic overlay (max 5 semantic nodes, hairline links, footer note).
- In P1.S4: Replace the 5 torus rings and HTML gate boxes with ThreeUI `StructureFlowCollection` / `GatewayFlow` continuous vector stream, displaying 5 restrained typography markers embedded into the flow field and a concise lower-third summary at the final beat.
- Overlay & Shell Polish: Adjust `ContentOverlay` and top dock styling so typography is editorial, responsive (clamped for 1366x768 and 1920x1080), with no bulky boxes or quote cards covering the visual focus.
- Stop Gate: Generate 4 target screenshots at 1920x1080 and 1366x768, verify zero visual clipping/overlap, and pause for reviewer human gate approval.

**Tech Stack:** React 19, `@designcodeio/threeui`, Three.js, GSAP, Playwright, Vitest.

**Spec:** `C:\Users\admin\Downloads\chat.md`

## Global Constraints
- Only rebuild P1.S3 and P1.S4; DO NOT touch S2, S5, S6, S7 or Part II.
- Maintain existing content model, academic text, beat progression, and navigation store.
- Ratio: 70% cinematic spatial visual / 30% typography & editorial info.
- Max 5 visible semantic labels at one time.
- No bulky card boxes, no vertical warning cards, no giant centered quote cards.
- Stop immediately after generating 4 screenshots: `p1-s3-threeui-1920.png`, `p1-s3-threeui-1366.png`, `p1-s4-threeui-1920.png`, `p1-s4-threeui-1366.png`.

---

### Task 1: Verify ThreeUI Components & Package Integration
**Files:**
- Read/Verify: `node_modules/@designcodeio/threeui/lib-dist/index.d.ts`
- Test: `tests/unit/threeui-imports.test.ts`

- [ ] **Step 1: Write unit test verifying ThreeUI exports**
```typescript
import { describe, it, expect } from 'vitest';
import { OrbitalSphereBackground, StructureFlowCollection } from '@designcodeio/threeui';

describe('ThreeUI Package Integration', () => {
  it('exports OrbitalSphereBackground and StructureFlowCollection as valid React components', () => {
    expect(OrbitalSphereBackground).toBeDefined();
    expect(StructureFlowCollection).toBeDefined();
  });
});
```

- [ ] **Step 2: Run vitest to verify test passes**
Run: `cmd //c "npx vitest run tests/unit/threeui-imports.test.ts"`
Expected: PASS

- [ ] **Step 3: Commit Task 1**
```bash
git add tests/unit/threeui-imports.test.ts
git commit -m "test: verify ThreeUI component exports for Phase 2.2 rebuild"
```

---

### Task 2: Rebuild P1.S3 with ThreeUI OrbitalSphere & Editorial Nodes
**Files:**
- Modify: `src/scenes/r3f/OrbitalCentralityScene.tsx`
- Modify: `src/presentation/ContentOverlay.tsx` (if needed for scene-specific editorial layout)
- Modify: `src/content/part1.ts` (ensure labels and beat metadata match spec exactly)

**Interfaces:**
- Consumes: `OrbitalSphereBackground` from `@designcodeio/threeui`, `scene` and `beatIndex` from `PresentationStore`.
- Produces: Clean, astronomical spatial scene with center nucleus "Cơ cấu XH – Giai cấp", 4 subtle peripheral satellites (Dân cư, Nghề nghiệp, Dân tộc, Tôn giáo), two-way light pulses, and clean footer note at beat 4.

- [ ] **Step 1: Write integration test for P1.S3 ThreeUI rendering**
Verify that P1.S3 renders the ThreeUI orbital background without throwing, and contains at most 5 semantic labels.

- [ ] **Step 2: Rebuild `OrbitalCentralityScene.tsx`**
Replace primitive R3F mesh spheres with ThreeUI-native particles/orbitals and minimalist typographic labels.

- [ ] **Step 3: Verify lint and unit tests pass**
Run: `cmd //c "npm run lint && npm test"`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Task 2**
```bash
git add src/scenes/r3f/OrbitalCentralityScene.tsx
git commit -m "feat: rebuild P1.S3 visual using ThreeUI OrbitalSphere architecture"
```

---

### Task 3: Rebuild P1.S4 with ThreeUI StructureFlow & Continuous Flow Field
**Files:**
- Modify: `src/scenes/r3f/StructureFlowScene.tsx`
- Modify: `src/content/part1.ts`

**Interfaces:**
- Consumes: `StructureFlowCollection` / `GatewayFlow` from `@designcodeio/threeui`, `beatIndex`.
- Produces: Continuous flow field with 5 restrained typographic markers (Cơ cấu kinh tế → Ngành/sở hữu → Lao động/nghề nghiệp → Vị trí/vai trò giai tầng → Cơ cấu XH – giai cấp), dynamic light pulses advancing across beats, and lower-third conclusion at final beat.

- [ ] **Step 1: Write integration test for P1.S4 StructureFlow**
Ensure all 5 stages render as typographic markers without boxes and particles flow smoothly.

- [ ] **Step 2: Rebuild `StructureFlowScene.tsx`**
Replace 5 torus rings and HTML cards with continuous ThreeUI flow stream and subtle typographic tags.

- [ ] **Step 3: Verify lint and unit tests pass**
Run: `cmd //c "npm run lint && npm test"`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Task 3**
```bash
git add src/scenes/r3f/StructureFlowScene.tsx
git commit -m "feat: rebuild P1.S4 visual using ThreeUI continuous StructureFlow"
```

---

### Task 4: Polish Typography Hierarchy & Responsive Layout (1920x1080 & 1366x768)
**Files:**
- Modify: `src/presentation/ContentOverlay.tsx`
- Modify: `src/presentation/NavigationControls.tsx`

- [ ] **Step 1: Adjust headline width and sizing**
Ensure headline is max 2 lines, width 38-44vw, clamp for 1366x768, no Vietnamese glyph clipping.

- [ ] **Step 2: Test responsive layouts in Playwright**
Run: `cmd //c "npm run test:e2e"`
Expected: PASS

- [ ] **Step 3: Commit Task 4**
```bash
git add src/presentation/ContentOverlay.tsx src/presentation/NavigationControls.tsx
git commit -m "style: polish editorial typography and responsive safe margins"
```

---

### Task 5: Capture 4 Target Screenshots & Execute Review Gate Stop
**Files:**
- Create: `scripts/capture-phase-2-2.mjs`
- Outputs:
  - `review-phase-2.2/p1-s3-threeui-1920.png`
  - `review-phase-2.2/p1-s3-threeui-1366.png`
  - `review-phase-2.2/p1-s4-threeui-1920.png`
  - `review-phase-2.2/p1-s4-threeui-1366.png`
  - Copy to `C:\Users\admin\Downloads\`

- [ ] **Step 1: Implement screenshot script with exact viewport dimensions**
- [ ] **Step 2: Execute capture script and verify images exist with non-zero size**
- [ ] **Step 3: STOP and present review checklist to user**
