// src/types.ts
export type HabitatGeometry = {
  shape: 'sphere' | 'cylinder' | 'cuboid';
  dimensions: {
    radius?: number;    // for sphere, cylinder
    height?: number;    // for cylinder, cuboid
    width?: number;     // for cuboid
    depth?: number;     // for cuboid
  };
  color: string; // hex code like "#00aaff"
};