# MLN131 Museum Experience Design

**Date:** 2026-09-20  
**Status:** Approved; implementation intentionally follows Magazine acceptance  
**Parent architecture:** `2026-09-20-mln131-experience-architecture-design.md`  
**Reference:** `longdevlife/HCM202` @ `d19c0d8557ce64778574c74ede16c66ffec95a53`

## 1. Goal

Adapt the proven HCM202 museum engine into a Chapter 5 Knowledge Museum that is accessible from the Library as a secondary experience.

The museum must preserve the feeling of a spatial exhibition while using ThreeUI selectively as digital installations rather than turning the museum into a generic component showcase.

## 2. Position in the product

```text
Library
  -> Exhibition
  -> Museum lobby
  -> Room / Exhibit
  -> optional interactive installation
  -> return to exhibit
  -> Library
```

Magazine remains the primary classroom presentation route.

Museum exists for exploration, guided demo, and visual reinforcement.

## 3. HCM202 mechanics to preserve

### `MuseumPage.jsx`

Preserve:

- scene + overlay composition;
- focused exhibit concept;
- selected exhibit modal/overlay;
- room indicators;
- control disable while overlay is open.

### `MuseumScene.jsx`

Preserve:

- single Canvas world;
- room lighting concept;
- camera/player composition;
- artwork instantiation from data;
- visitors;
- atmospheric depth/fog where appropriate.

### `MuseumPlayer.jsx`

Preserve:

- WASD movement;
- arrow-key look;
- walkable-zone collision;
- wall sliding.

Adapt movement allocations to avoid unnecessary per-frame object creation.

### `MuseumRoom.jsx`

Preserve:

- lobby + connected rooms;
- architectural openings;
- hallway system;
- trim/bench/chandelier visual language where compatible;
- data-oriented room placement.

Remove HCM-specific centerpiece and labels.

### `MuseumArtwork.jsx` / `ArtworkPopup.jsx`

Preserve:

- framed artwork;
- focus response;
- click selection;
- detailed overlay;
- image zoom/pan where useful.

### `MuseumVisitors.jsx`

Visitors are optional in the first MLN museum milestone. If retained, keep density low enough for projector performance.

## 4. Museum information architecture

Initial concept:

### Lobby — Social Structure Atlas

Central installation introduces the broader social-structure system.

Potential ThreeUI visual:
- Constellation / particle-network.

Purpose:
- establish that class-social structure exists within a wider social structure;
- provide spatial orientation to the three rooms.

### Room I — Cơ cấu xã hội – giai cấp

Focus:
- concept;
- position;
- three transformation trends.

Potential interactive installation:
- connectivity/network;
- structure flow.

### Room II — Liên minh giai cấp, tầng lớp

Focus:
- objective need for alliance;
- common and differentiated interests;
- major dimensions of alliance.

Potential interactive installation:
- stream convergence.

### Room III — Việt Nam trong thời kỳ quá độ

Focus:
- relevant groups/strata;
- relationships;
- Vietnam-specific content from approved source.

Potential interactive installation:
- constellation / relationship field.

### Final lobby/exit installation — Phương hướng & giải pháp

A restrained closing installation rather than a required fourth physical room.

## 5. Proposed file structure

```text
src/experiences/museum/
  MuseumExperience.tsx
  MuseumScene.tsx
  MuseumPlayer.tsx
  MuseumRoom.tsx
  MuseumArtwork.tsx
  MuseumVisitors.tsx
  MuseumOverlay.tsx
  museumTypes.ts
  museumData.ts
  museumMath.ts
  installations/
    LobbyConstellation.tsx
    KnowledgePortal.tsx
    ExhibitInteractiveLauncher.tsx
```

The engine must be driven by data rather than hard-coded room-specific academic text.

## 6. Data model

```ts
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface MuseumInteractiveAction {
  label: string;
  visualId: ThreeUIVisualId;
}

export interface MuseumExhibit {
  id: string;
  roomId: string;
  title: string;
  heading?: string;
  description?: string;
  imageSrc?: string;
  sourceIds?: string[];
  position: [number, number, number];
  rotation: [number, number, number];
  interactive?: MuseumInteractiveAction;
}

export interface MuseumRoomDefinition {
  id: string;
  title: string;
  shortTitle: string;
  accent: string;
  position: [number, number, number];
  exhibits: MuseumExhibit[];
}

export interface MuseumDefinition {
  id: string;
  title: string;
  rooms: MuseumRoomDefinition[];
}
```

## 7. ThreeUI integration principles

ThreeUI in Museum is spatially meaningful.

Allowed uses:

- portal field behind/inside door openings;
- lobby constellation installation;
- interactive exhibit opened from a specific artwork;
- subtle stream/flow wayfinding;
- restrained heading transition during room change or guided mode.

Disallowed:

- arbitrary full-screen effects with no exhibit relationship;
- many simultaneous active shaders;
- ThreeUI components stacked as decorative wallpaper;
- replacing the museum's architectural identity with a sci-fi UI.

## 8. Knowledge Portal behavior

Each major room entrance may have one portal effect.

Behavior:

- far distance: near-zero intensity;
- approach: subtle activation;
- doorway proximity: room title becomes legible;
- after entry: effect fades to reduce visual noise.

Portal state is derived from player/camera distance, not React state updated every frame.

Reduced-motion mode uses a static light/gradient treatment.

## 9. Lobby installation

Replace the HCM-specific statue centerpiece with a Chapter 5 installation.

Concept:

```text
CƠ CẤU XÃ HỘI
     |
constellation / network
     |
class-social structure highlighted
     |
three room directions
```

The installation should orient the visitor, not require long reading.

Do not place the full textbook definition in the lobby.

## 10. Exhibit interaction

Base behavior:

```text
approach artwork
-> focus feedback
-> click / Enter
-> exhibit overlay
```

Overlay provides:

- title;
- concise explanatory content;
- source reference;
- optional `Khám phá mô hình` action.

If Explore exists:

```text
Museum exhibit
-> openInteractive(visualId, { mode:'museum', exhibitId })
-> Interactive
-> Escape
-> same Museum exhibit
```

## 11. Navigation modes

### Free exploration

- WASD movement;
- arrow look;
- click/Enter interaction.

### Guided presentation mode

Guided mode is an enhancement after the free museum works.

It may expose:

```text
Sảnh
01
02
03
Kết
```

Selecting a destination moves the camera/player through a controlled transition to a known presentation point.

Guided mode must not destroy free movement state.

## 12. Collision and room model

Use walkable zones or an equivalent simple deterministic collision model.

Do not introduce a physics engine unless a proven requirement appears.

Room geometry is not academic content.

Museum content changes through `museumData.ts`, not through edits to wall geometry.

## 13. Performance rules

- Museum owns the only active major Canvas in museum mode.
- Reuse Three.js temp vectors/colors in per-frame tracking.
- Avoid cloning textures every frame.
- dispose cloned textures/materials when ownership requires it.
- portals/installations outside the active/nearby room should be idle or unmounted.
- visitors may be disabled on low performance tier.
- contact shadows must remain bounded and intentionally configured.
- no uncontrolled simultaneous postprocessing stack.

## 14. Offline rule

Replace `Environment preset="city"` or any runtime network-backed environment path with a verified local/bundled alternative before final acceptance.

Core museum operation must not require network access.

All exhibit images used in the presentation path are local.

## 15. Responsive/projector behavior

Although the Museum Canvas is full-window, overlays must be designed for:

- 1920x1080;
- 1366x768.

Requirements:

- room title overlay never obscures the focal exhibit;
- exhibit overlay fits without clipping;
- important controls remain visible;
- text remains readable from a projector;
- free-exploration HUD remains minimal.

## 16. Error handling

If an exhibit image fails:

- frame remains present;
- fallback label appears;
- selecting the exhibit still opens textual content.

If an interactive installation fails:

- museum remains usable;
- exhibit overlay remains available;
- Back/Escape returns cleanly.

If WebGL cannot initialize:

- existing safe-mode strategy should provide a non-WebGL museum/exhibit index rather than a blank page.

## 17. Testing strategy

### Unit

- walkable-zone/collision utilities;
- museum data integrity;
- room/exhibit lookup;
- interactive return target;
- guided destination lookup.

### Integration

- Museum opens from Library.
- movement respects controlsEnabled.
- selecting exhibit disables player movement.
- closing overlay restores movement.
- interactive Explore returns to same exhibit.

### E2E

Required route:

```text
Library
-> Exhibition
-> Museum
-> move
-> select exhibit
-> close exhibit
-> return Library
```

Interactive route:

```text
Museum exhibit
-> Explore
-> Interactive
-> Escape
-> same exhibit
```

### Visual

First museum prototype screenshots should include:

- lobby 1920;
- one room 1920;
- exhibit overlay 1920;
- lobby 1366;
- one room 1366.

Later portal/installations receive their own visual gate.

## 18. Implementation order

Museum implementation starts only after Magazine Core + Book I base route are accepted.

Recommended museum milestones:

```text
B0 port engine with placeholder data
B1 replace centerpiece/content with Chapter-5 data model
B2 verify movement/collision/exhibit overlays
B3 add one ThreeUI doorway portal
B4 add lobby constellation
B5 add one exhibit interactive flow
B6 add guided mode
B7 final performance/offline/projector QA
```

Each milestone stops for review.

## 19. Acceptance criteria

Museum is accepted when:

- it opens independently from Library;
- HCM202 museum spatial quality is preserved or improved;
- no HCM-specific historical branding/content remains;
- Chapter 5 rooms/exhibits are data-driven;
- portal/installation effects are restrained and context-driven;
- exhibit overlays are readable at projector resolutions;
- interactive inserts return to the exact exhibit;
- one major Canvas is active;
- repeated open/close does not leak listeners or lose WebGL context;
- offline presentation path works after required assets are locally available.
