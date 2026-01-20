import { createNoise3D } from 'simplex-noise';

export interface NoiseConfig {
  scale: number;
  amplitude: number;
}

export interface TerrainNoiseConfig {
  layers: NoiseConfig[];
  seed?: number;
}

export const defaultConfig: TerrainNoiseConfig = {
  layers: [
    { scale: 0.003, amplitude: 1.0 },    // Base layer - broad forms
    { scale: 0.008, amplitude: 0.4 },    // Detail layer - medium undulation
    { scale: 0.02, amplitude: 0.15 }     // Fine layer - subtle texture
  ]
};

export function createTerrainNoise(config: TerrainNoiseConfig = defaultConfig) {
  const noise3D = createNoise3D();

  return function sample(x: number, y: number, z: number = 0): number {
    let value = 0;
    let totalAmplitude = 0;

    for (const layer of config.layers) {
      value += noise3D(x * layer.scale, y * layer.scale, z * layer.scale) * layer.amplitude;
      totalAmplitude += layer.amplitude;
    }

    // Normalize to [-1, 1]
    return value / totalAmplitude;
  };
}

export type TerrainNoiseFn = ReturnType<typeof createTerrainNoise>;
