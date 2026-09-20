# MLN131 Experience Architecture Design

**Date:** 2026-09-20  
**Status:** Design approved in chat; written-spec review pending  
**Repository:** `longdevlife/MLN131`  
**Baseline:** `309dbe150b3b70dfe5c2762a95fe3b7de4f85594`  
**Reference repository:** `longdevlife/HCM202` @ `d19c0d8557ce64778574c74ede16c66ffec95a53`

## 1. Purpose

MLN131 will pivot away from a sequence of custom-authored R3F presentation scenes as the primary audience experience.

The new product architecture reuses two proven interaction engines from HCM202:

1. the 3D page-turn magazine engine;
2. the first-person 3D museum engine.

ThreeUI Community is used as the shared visual enhancement layer for library selection, transitions, and selected interactive knowledge models.

The result must feel like one coherent academic experience rather than a showcase of unrelated WebGL components.

## 2. Product hierarchy

Primary presentation route:

```text
Intro
  -> ThreeUI Library
  -> choose Book I / II / III / IV
  -> 3D Magazine
  -> optional Explore interaction
  -> ThreeUI live knowledge model
  -> return to the exact magazine page
  -> close magazine
  -> Library
```

Secondary experience:

```text
Library
  -> Exhibition
  -> 3D Knowledge Museum
  -> artwork/exhibit
  -> optional ThreeUI installation
  -> return to museum
  -> Library
```

The museum is not the default path for the classroom presentation. The magazine is the primary presentation surface. The museum is an additional explorable experience.

## 3. Scope

### In scope

- ThreeUI Bookshelf/Library.
- HCM202 magazine-engine extraction and adaptation.
- Data-driven magazine volumes for Books I-IV.
- Book I production before Books II-IV.
- ThreeUI interactive inserts inside magazine flow.
- HCM202 museum-engine extraction and adaptation.
- Data-driven museum content for Chapter 5.
- ThreeUI portals/installations inside museum.
- Presenter-compatible keyboard behavior.
- Projector targets 1920x1080 and 1366x768.
- Local/offline-safe core assets.
- Visual acceptance gates.

### Explicitly out of scope until Magazine + Museum are complete

- Firebase multiplayer.
- Host/Player audience game.
- QR join flow.
- Canvas RPG.
- policy simulation engine.
- audience scoring.
- minigame redesign.

Existing HCM202 minigame source is reference-only for now.

## 4. Source reuse policy

HCM202 is a source implementation, not merely an aesthetic reference.

### Magazine source of truth

Port behavior from:

- `HCM202/src/book/Book.jsx`
- `HCM202/src/book/BookPage.jsx`
- `HCM202/src/book/Experience.jsx`
- `HCM202/src/book/UI.jsx`
- `HCM202/src/book/PageParticles.jsx`

Do **not** use `HCM202/src/components/UI.jsx` as the magazine UI source; it is a legacy iteration.

### Museum source of truth

Port behavior from:

- `HCM202/src/museum/MuseumPage.jsx`
- `HCM202/src/museum/MuseumScene.jsx`
- `HCM202/src/museum/MuseumPlayer.jsx`
- `HCM202/src/museum/MuseumRoom.jsx`
- `HCM202/src/museum/MuseumArtwork.jsx`
- `HCM202/src/museum/ArtworkPopup.jsx`
- `HCM202/src/museum/MuseumVisitors.jsx`
- `HCM202/src/museum/museumData.js`

### ThreeUI reuse

Prefer importing real ThreeUI Community components through `@designcodeio/threeui`.

If a component cannot be adapted through its public interface, vendor only that component's Community source into MLN131 with license notice preserved.

Never re-create a ThreeUI visual from scratch merely to imitate it.

## 5. Architecture boundaries

```text
src/
  content/
  state/
  presentation/

  experiences/
    library/
    magazine/
    interactive/
    museum/

  threeui/
    registry/
    adapters/

  legacy/
    authored-r3f-scenes/   (conceptual destination; migration may be incremental)
```

Each experience has one responsibility:

- Library selects a destination.
- Magazine presents the academic narrative.
- Interactive renders a focused ThreeUI knowledge model.
- Museum provides free/guided spatial exploration.

No experience may reach directly into another experience's internal state.

## 6. Global experience state

Use the existing Zustand architecture. Do not introduce Jotai.

Required conceptual state:

```ts
type ExperienceMode =
  | 'cover'
  | 'library'
  | 'magazine'
  | 'interactive'
  | 'museum';

type MagazineViewMode = 'showcase' | 'reading';

interface InteractiveReturnTarget {
  mode: 'magazine' | 'museum';
  page?: number;
  exhibitId?: string;
}

interface ExperienceState {
  experienceMode: ExperienceMode;

  selectedBook: number;

  magazinePage: number;
  magazineViewMode: MagazineViewMode;

  interactiveVisual: ThreeUIVisualId | null;
  interactiveReturn: InteractiveReturnTarget | null;

  museumRoomId: string | null;
  museumExhibitId: string | null;
}
```

State transitions must be explicit actions, not ad-hoc boolean combinations.

Required transitions include:

- `openBook(bookIndex)`
- `closeMagazine()`
- `openInteractive(visualId, returnTarget)`
- `closeInteractive()`
- `openMuseum()`
- `closeMuseum()`
- `setMagazinePage(page)`
- `setMagazineViewMode(mode)`

## 7. WebGL ownership rule

At most one major experience renderer is active at once.

- Library mode: Bookshelf mounted; Magazine/Museum/Interactive unmounted.
- Magazine mode: Magazine mounted; Library/Museum/Interactive unmounted.
- Interactive mode: ThreeUI interactive renderer mounted; prior major experience suspended or unmounted according to implementation.
- Museum mode: Museum mounted; Library/Magazine/Interactive unmounted.

No hidden simultaneous Canvas stack.

This is a hard requirement because the presentation must remain stable on classroom hardware.

## 8. Shared ThreeUI adapter

Magazine and Museum must not import arbitrary ThreeUI components directly.

Provide a stable registry:

```ts
type ThreeUIVisualId =
  | 'social-network'
  | 'class-relations'
  | 'economic-flow'
  | 'diversification'
  | 'alliance-convergence'
  | 'chapter-transition';

interface ThreeUIExperienceProps {
  visualId: ThreeUIVisualId;
  reducedMotion: boolean;
  onExit(): void;
}
```

The registry maps semantic MLN IDs to real ThreeUI implementations.

The content layer references semantic IDs only.

## 9. Visual direction

The experience combines:

- dark academic outer shell;
- warm ivory magazine paper;
- antique gold / muted copper accents;
- restrained editorial typography;
- cinematic but low-noise ThreeUI effects.

Avoid:

- dashboard-card layouts;
- oversized black quote boxes;
- generic R3F spheres;
- visualizations built only to resemble ThreeUI;
- instructional text covering the primary visual;
- excessive simultaneous labels;
- sci-fi styling inconsistent with an academic publication/museum.

## 10. Academic-content discipline

Technical engines and final academic content are separate concerns.

During engine-prototype phases, temporary placeholder content is allowed.

Final content production must use the approved Chapter 5 source model and must not silently introduce stronger ideological claims, unsupported quotations, invented page references, or rigid terminology not present in the agreed source.

## 11. Visual acceptance

Automated tests are necessary but never sufficient for a visual phase.

Every visual milestone requires:

1. code gate;
2. functional gate;
3. visual gate.

Visual gate requires screenshots at minimum:

- 1920x1080;
- 1366x768.

A milestone cannot progress until the user/reviewer approves the screenshots.

## 12. Delivery sequence

```text
A0 Architecture/state
A1 Magazine engine extraction
A2 Library -> Magazine handoff
A3 Magazine visual prototype
A4 Book I editorial production
A5 Book I ThreeUI inserts
A6 Book I projector/offline QA
A7 Books II-IV content production

then

B0 Museum engine extraction
B1 Chapter-5 museum data model
B2 Navigation/collision/exhibit adaptation
B3 ThreeUI portals/installations
B4 Guided presentation mode
B5 Museum projector/performance QA
```

Minigame remains frozen through all A and B milestones.

## 13. AGY engineering contract

AGY must:

- port proven mechanics before redesigning;
- write or update tests before behavior-changing implementation where practical;
- keep commits small and phase-scoped;
- produce exact screenshots requested by each visual gate;
- distinguish test evidence from visual approval;
- stop at each gate;
- report changed files, commit SHA, exact commands/results, known issues;
- never continue into the next milestone without explicit approval.

AGY must not:

- rewrite HCM202 mechanics merely for stylistic preference;
- add Jotai to MLN131;
- revive the rejected custom P1.S2-P1.S7 visual path;
- work on minigame during Magazine/Museum delivery;
- claim a visual phase is approved because tests pass;
- silently change academic content while porting technical engines.

## 14. Definition of program success

The program is successful when:

- the Library feels like the entry point to one coherent experience;
- opening a volume launches a polished HCM-quality 3D magazine;
- Books I-IV can share the same engine and differ primarily through data/assets;
- ThreeUI interactions feel native to the publication rather than embedded demos;
- the museum can be entered independently and presents Chapter 5 through an explorable spatial experience;
- one major WebGL experience runs at a time;
- 1920x1080 and 1366x768 remain presentation-safe;
- the system remains understandable and maintainable for later minigame work.
