import { describe, it, expect } from 'vitest';
import { OrbitalSphereBackground, StructureFlowCollection } from '@designcodeio/threeui';

describe('ThreeUI Package Integration', () => {
  it('exports OrbitalSphereBackground and StructureFlowCollection as valid React components', () => {
    expect(OrbitalSphereBackground).toBeDefined();
    expect(typeof OrbitalSphereBackground).toBe('function');
    expect(StructureFlowCollection).toBeDefined();
    expect(typeof StructureFlowCollection).toBe('function');
  });
});
