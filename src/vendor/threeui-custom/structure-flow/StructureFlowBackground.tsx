import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export interface StructureFlowOptions {
  speed: number;
  pointSize: number;
  opacity: number;
  maskStart: number;
  maskSolid: number;
}

export const STRUCTURE_FLOW_DEFAULTS: StructureFlowOptions = {
  speed: 1,
  pointSize: 0.08,
  opacity: 0.5,
  maskStart: 0.05,
  maskSolid: 0.45,
};

export function createStructureFlowRenderer(
  canvas: HTMLCanvasElement,
  getOptions: () => StructureFlowOptions
) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 28;
  camera.position.y = 4;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2));

  const geometry = new THREE.BufferGeometry();
  const count = 15000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const radius = 26;

  const goldColor = new THREE.Color('#C8A86A');
  const copperColor = new THREE.Color('#C87046');
  const silverColor = new THREE.Color('#9FB3C9');

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(Math.random() * 0.8 + 0.2);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi) - 18;
    const z = radius * Math.sin(phi) * Math.sin(theta);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Subtle aesthetic gradient between gold, copper, and silver
    const mix = Math.random();
    const c = mix < 0.4 ? goldColor : mix < 0.7 ? copperColor : silverColor;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  return {
    resize(width: number, height: number) {
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    render() {
      const opts = getOptions();
      points.rotation.y += 0.0008 * opts.speed;
      points.rotation.z += 0.0002 * opts.speed;
      material.size = opts.pointSize;
      material.opacity = opts.opacity;
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}

export interface StructureFlowBackgroundProps extends Partial<StructureFlowOptions> {
  className?: string;
  style?: React.CSSProperties;
}

export const StructureFlowBackground: React.FC<StructureFlowBackgroundProps> = ({
  className = '',
  style,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef<StructureFlowOptions>({
    ...STRUCTURE_FLOW_DEFAULTS,
    ...props,
  });
  optionsRef.current = { ...STRUCTURE_FLOW_DEFAULTS, ...props };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const renderer = createStructureFlowRenderer(canvas, () => optionsRef.current);
    let animId = 0;
    let isVisible = true;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      renderer.resize(rect.width, rect.height);
      renderer.render();
    };

    const loop = () => {
      renderer.render();
      animId = isVisible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? true;
      if (isVisible && !animId) {
        animId = requestAnimationFrame(loop);
      } else if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    });

    resizeObserver.observe(container);
    intersectionObserver.observe(container);

    handleResize();
    animId = requestAnimationFrame(loop);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  const opts = optionsRef.current;
  const mask = `linear-gradient(to bottom, transparent ${opts.maskStart * 100}%, black ${opts.maskSolid * 100}%, black 100%)`;

  return (
    <div
      ref={containerRef}
      className={`threeui-background structure-flow ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        WebkitMaskImage: mask,
        maskImage: mask,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
