import { lazy } from 'react';

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
