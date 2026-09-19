import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getCameraPose, type CameraPose } from './cameraPoses';

interface SceneCameraRigProps {
  sceneId: string;
  beatIndex: number;
}

export function SceneCameraRig({ sceneId, beatIndex }: SceneCameraRigProps) {
  const { camera } = useThree();
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3(0, 0, 10));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetFov = useRef(45);
  const isInitialized = useRef(false);

  useEffect(() => {
    const pose: CameraPose = getCameraPose(sceneId, beatIndex);
    targetPos.current.set(...pose.position);
    targetLookAt.current.set(...pose.target);
    targetFov.current = pose.fov ?? 45;

    // Instant position on first mount of the stage
    if (!isInitialized.current) {
      camera.position.set(...pose.position);
      currentLookAt.current.set(...pose.target);
      camera.lookAt(currentLookAt.current);
      if ('fov' in camera) {
        (camera as THREE.PerspectiveCamera).fov = targetFov.current;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
      isInitialized.current = true;
    }
  }, [sceneId, beatIndex, camera]);

  useFrame((_, delta) => {
    // Clamped damping factor to ensure stability under frame drops
    const t = Math.min(delta * 3.5, 0.25);

    // Smooth position lerp
    camera.position.lerp(targetPos.current, t);

    // Smooth lookAt target lerp
    currentLookAt.current.lerp(targetLookAt.current, t);
    camera.lookAt(currentLookAt.current);

    // Smooth FOV transition if perspective camera
    if ('fov' in camera) {
      const pCam = camera as THREE.PerspectiveCamera;
      if (Math.abs(pCam.fov - targetFov.current) > 0.05) {
        pCam.fov = THREE.MathUtils.lerp(pCam.fov, targetFov.current, t);
        pCam.updateProjectionMatrix();
      }
    }
  });

  return null;
}
