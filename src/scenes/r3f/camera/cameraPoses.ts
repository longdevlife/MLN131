export interface CameraPose {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

export const DEFAULT_CAMERA_POSE: CameraPose = {
  position: [0, 0, 10],
  target: [0, 0, 0],
  fov: 45,
};

export const SCENE_CAMERA_POSES: Record<string, Record<number, CameraPose>> = {
  'p1-s0': {
    0: { position: [0, 0, 8.5], target: [0, 0, 0], fov: 45 },
    1: { position: [0, 0, 7.2], target: [0, 0, 0], fov: 42 },
  },
  'p1-s1': {
    0: { position: [0, 0, 11], target: [0, 0, 0], fov: 45 },
    1: { position: [0.8, -0.4, 10], target: [0, 0, 0], fov: 45 },
    2: { position: [0, -0.6, 9.2], target: [0, -0.3, 0], fov: 42 },
  },
  'p1-s2': {
    0: { position: [0, 1.2, 10], target: [0, 0, 0], fov: 45 },
    1: { position: [0, 0.5, 8.8], target: [0, 0, 0], fov: 42 },
    2: { position: [-2.2, 0.8, 7.8], target: [-0.8, 0.4, 0], fov: 38 },
    3: { position: [2.2, -0.4, 7.8], target: [0.8, -0.4, 0], fov: 38 },
    4: { position: [0, 0.6, 9.2], target: [0, 0, 0], fov: 42 },
  },
  'p1-s3': {
    0: { position: [0, 0.4, 8.2], target: [0, 0, 0], fov: 42 },
    1: { position: [0, 2.6, 11], target: [0, 0, 0], fov: 45 },
    2: { position: [1.8, 1.4, 9.6], target: [0.4, 0, 0], fov: 42 },
    3: { position: [-1.8, -1.0, 9.6], target: [-0.4, 0, 0], fov: 42 },
    4: { position: [0, 3.0, 11.8], target: [0, 0, 0], fov: 46 },
  },
  'p1-s4': {
    0: { position: [-3.6, 0, 8.2], target: [-3.6, 0, 0], fov: 40 },
    1: { position: [-1.8, 0, 8.2], target: [-1.8, 0, 0], fov: 40 },
    2: { position: [0, 0, 8.2], target: [0, 0, 0], fov: 40 },
    3: { position: [1.8, 0, 8.2], target: [1.8, 0, 0], fov: 40 },
    4: { position: [0, 1.2, 11.2], target: [0, 0, 0], fov: 45 },
  },
  'p1-s5': {
    0: { position: [-1.4, 0.4, 8.5], target: [-0.4, 0, 0], fov: 44 },
    1: { position: [-1.6, 0.6, 7.8], target: [-0.8, 0.4, 0], fov: 40 },
    2: { position: [1.6, -0.4, 8.2], target: [0.8, -0.2, 0], fov: 42 },
    3: { position: [0, 0, 9.5], target: [0, 0, 0], fov: 45 },
    4: { position: [0, 1.2, 12.0], target: [0, 0, 0], fov: 48 },
  },
  'p1-s6': {
    0: { position: [-2.2, 0, 9.5], target: [-0.8, 0, 0], fov: 44 },
    1: { position: [-1.8, 0.6, 8.8], target: [-0.5, 0, 0], fov: 42 },
    2: { position: [0, 0, 8.5], target: [0, 0, 0], fov: 40 },
    3: { position: [0, -0.5, 8.5], target: [0, 0, 0], fov: 40 },
    4: { position: [0, 0.2, 7.8], target: [0, 0, 0], fov: 38 },
    5: { position: [0, 0.5, 9.0], target: [0, 0, 0], fov: 42 },
  },
  'p1-s7': {
    0: { position: [0, 0.8, 10.5], target: [0, 0, 0], fov: 45 },
    1: { position: [0, 0.2, 8.0], target: [0, 0, 0], fov: 40 },
    2: { position: [0, -0.2, 7.2], target: [0, 0, 0], fov: 38 },
    3: { position: [0, 0, 6.8], target: [0, 0, 0], fov: 36 },
    4: { position: [0, 0, 6.2], target: [0, 0, 0], fov: 35 },
    5: { position: [0, 0, 7.0], target: [0, 0, 0], fov: 40 },
  },
};

export function getCameraPose(sceneId: string, beatIndex: number): CameraPose {
  const scenePoses = SCENE_CAMERA_POSES[sceneId];
  if (!scenePoses) return DEFAULT_CAMERA_POSE;
  const pose = scenePoses[beatIndex];
  if (pose) return pose;
  // Fallback to beat 0 or first available
  return scenePoses[0] || DEFAULT_CAMERA_POSE;
}
