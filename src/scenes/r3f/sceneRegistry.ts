import React, { lazy } from 'react';
import type { PresentationScene, VisualId } from '../../content/types';

export interface R3FSceneComponentProps {
  scene: PresentationScene;
  sceneId?: string;
  beatIndex: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

export type R3FSceneComponent = React.ComponentType<R3FSceneComponentProps>;

export const PaperSceneLazy = lazy(() =>
  import('./PaperScene').then((m) => ({ default: m.PaperScene }))
);

export const SocialNetworkSceneLazy = lazy(() =>
  import('./SocialNetworkScene').then((m) => ({ default: m.SocialNetworkScene }))
);

export const ClassRelationsSceneLazy = lazy(() =>
  import('./ClassRelationsScene').then((m) => ({ default: m.ClassRelationsScene }))
);

export const OrbitalCentralitySceneLazy = lazy(() =>
  import('./OrbitalCentralityScene').then((m) => ({ default: m.OrbitalCentralityScene }))
);

export const StructureFlowSceneLazy = lazy(() =>
  import('./StructureFlowScene').then((m) => ({ default: m.StructureFlowScene }))
);

export const DiversificationSceneLazy = lazy(() =>
  import('./DiversificationScene').then((m) => ({ default: m.DiversificationScene }))
);

export const ConvergenceSceneLazy = lazy(() =>
  import('./ConvergenceScene').then((m) => ({ default: m.ConvergenceScene }))
);

export const Part1BridgeSceneLazy = lazy(() =>
  import('./Part1BridgeScene').then((m) => ({ default: m.Part1BridgeScene }))
);

export const SCENE_REGISTRY: Record<VisualId, R3FSceneComponent | null> = {
  'paper': PaperSceneLazy as unknown as R3FSceneComponent,
  'constellation': SocialNetworkSceneLazy as unknown as R3FSceneComponent,
  'class-relations': ClassRelationsSceneLazy as unknown as R3FSceneComponent,
  'orbital-centrality': OrbitalCentralitySceneLazy as unknown as R3FSceneComponent,
  'structure-flow': StructureFlowSceneLazy as unknown as R3FSceneComponent,
  'diversification': DiversificationSceneLazy as unknown as R3FSceneComponent,
  'convergence': ConvergenceSceneLazy as unknown as R3FSceneComponent,
  'part1-bridge': Part1BridgeSceneLazy as unknown as R3FSceneComponent,
  'bookshelf': null,
  'none': null,
};
