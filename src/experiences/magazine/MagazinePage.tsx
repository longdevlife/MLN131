import { useCursor, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Material,
  MathUtils,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from 'three';

export interface MagazinePageProps {
  number: number;
  front: string;
  back: string;
  currentPage: number;
  opened: boolean;
  bookClosed: boolean;
  reducedMotion: boolean;
  accentColor?: string;
  onRequestPage(page: number): void;
}

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

// Construct shared geometry once
const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);
pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const positionAttr = pageGeometry.attributes.position;
const tempVertex = new Vector3();
const skinIndexes: number[] = [];
const skinWeights: number[] = [];

for (let i = 0; i < positionAttr.count; i++) {
  tempVertex.fromBufferAttribute(positionAttr, i);
  const x = tempVertex.x;
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute(
  'skinIndex',
  new Uint16BufferAttribute(skinIndexes, 4)
);
pageGeometry.setAttribute(
  'skinWeight',
  new Float32BufferAttribute(skinWeights, 4)
);

const whiteColor = new Color('#FAFAF8');
const edgeColor = new Color('#2A2420');

export function MagazinePage({
  number,
  front,
  back,
  currentPage,
  opened,
  bookClosed,
  reducedMotion,
  accentColor = '#C8A86A',
  onRequestPage,
}: MagazinePageProps) {
  const [pictureFront, pictureBack] = useTexture([front, back]);
  pictureFront.colorSpace = SRGBColorSpace;
  pictureBack.colorSpace = SRGBColorSpace;

  const groupRef = useRef<Group>(null);
  const skinnedMeshRef = useRef<SkinnedMesh>(null);
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);
  const [highlighted, setHighlighted] = useState(false);

  useCursor(highlighted);

  const emissiveColor = useMemo(() => new Color(accentColor), [accentColor]);

  // Create skeleton, materials and skinned mesh for this page
  const { manualSkinnedMesh, ownedMaterials } = useMemo(() => {
    const bones: Bone[] = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }
    const skeleton = new Skeleton(bones);

    const edgeMaterials = [
      new MeshStandardMaterial({ color: whiteColor, roughness: 0.3 }),
      new MeshStandardMaterial({ color: edgeColor, roughness: 0.3 }),
      new MeshStandardMaterial({ color: whiteColor, roughness: 0.3 }),
      new MeshStandardMaterial({ color: whiteColor, roughness: 0.3 }),
    ];

    const frontMaterial = new MeshStandardMaterial({
      color: whiteColor,
      map: pictureFront,
      roughness: 0.2,
      emissive: emissiveColor,
      emissiveIntensity: 0,
    });

    const backMaterial = new MeshStandardMaterial({
      color: whiteColor,
      map: pictureBack,
      roughness: 0.2,
      emissive: emissiveColor,
      emissiveIntensity: 0,
    });

    const materials: Material[] = [...edgeMaterials, frontMaterial, backMaterial];
    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);

    return {
      manualSkinnedMesh: mesh,
      ownedMaterials: materials,
    };
  }, [pictureFront, pictureBack, emissiveColor]);

  // Dispose owned materials on unmount to prevent leaks
  useEffect(() => {
    return () => {
      for (const mat of ownedMaterials) {
        mat.dispose();
      }
    };
  }, [ownedMaterials]);

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current || !groupRef.current) return;

    const materials = skinnedMeshRef.current.material as MeshStandardMaterial[];
    const frontMat = materials[4];
    const backMat = materials[5];

    if (frontMat && backMat) {
      const targetEmissive = highlighted ? 0.22 : 0;
      const lerped = MathUtils.lerp(frontMat.emissiveIntensity, targetEmissive, 0.1);
      frontMat.emissiveIntensity = lerped;
      backMat.emissiveIntensity = lerped;
    }

    if (lastOpened.current !== opened) {
      turnedAt.current = Date.now();
      lastOpened.current = opened;
    }

    const duration = reducedMotion ? 200 : 400;
    const elapsed = Math.min(duration, Date.now() - turnedAt.current) / duration;
    const turningTime = Math.sin(elapsed * Math.PI);

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) {
      targetRotation += MathUtils.degToRad(number * 0.8);
    }

    const insideCurveStrength = 0.18;
    const outsideCurveStrength = 0.05;
    const turningCurveStrength = reducedMotion ? 0.02 : 0.09;
    const easingFactor = reducedMotion ? 0.8 : 0.5;
    const easingFactorFold = reducedMotion ? 0.8 : 0.3;

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? groupRef.current : bones[i];

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity = Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;
      let foldRotationAngle = MathUtils.degToRad(Math.sign(targetRotation) * 2);

      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }

      easing.dampAngle(target.rotation, 'y', rotationAngle, easingFactor, delta);

      const foldIntensity =
        i > 8 ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime : 0;
      easing.dampAngle(
        target.rotation,
        'x',
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onRequestPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + currentPage * PAGE_DEPTH}
      />
    </group>
  );
}
