
import { PresetData, WallpaperConfig } from './types.js';

export const PRESETS: PresetData[] = [
  // ===== Tech-Inspired Presets =====

  {
    id: 'LIQUID_GLASS',
    name: 'Liquid Glass',
    icon: 'fa-droplet',
    description: 'Viscous molten glass with refractive distortion and iridescence.',
    defaultConfig: {
      primaryColor: '#e0f2fe', // Very light blue
      secondaryColor: '#fce7f3', // Very light pink
      tertiaryColor: '#38bdf8', // Bright Sky Blue
      complexity: 0.6,
      speed: 0.2, // Slower speed for viscous feel
      intensity: 1.1, // High intensity for gloss
      grain: 0.0,
      scale: 0.8,
      contrast: 1.1,
      customValues: { waveScale: 0.7, iridescence: 0.5 }
    },
    customizations: [
      { key: 'waveScale', label: 'Wave Scale', min: 0.3, max: 2, step: 0.01, defaultValue: 1.0 },
      { key: 'iridescence', label: 'Iridescence', min: 0, max: 1.5, step: 0.01, defaultValue: 0.8 }
    ],
    customLabels: { complexity: 'Complexity' }
  },
  {
    id: 'MONO_TOPOLOGY',
    name: 'Mono Topology',
    icon: 'fa-mountain',
    description: 'Elegant topographic contour lines - Apple Pro aesthetic.',
    defaultConfig: {
      primaryColor: '#f5f5f5',
      secondaryColor: '#1a1a1a',
      tertiaryColor: '#888888',
      complexity: 0.5,
      speed: 0.08,
      intensity: 1.0,
      grain: 0.01,
      scale: 1.0,
      contrast: 1.0,
      customValues: { lineWeight: 0.5, elevation: 0.6 }
    },
    customizations: [
      { key: 'lineWeight', label: 'Line Weight', min: 0.1, max: 1, step: 0.01, defaultValue: 0.5 },
      { key: 'elevation', label: 'Elevation Range', min: 0.2, max: 1.5, step: 0.1, defaultValue: 0.6 }
    ],
    customLabels: { complexity: 'Zoom' }
  },
  {
    id: 'WINDOWS_BLOOM',
    name: 'Ribbon Bloom',
    icon: 'fa-fan',
    description: 'Flowing ribbon sculpture inspired by Windows 11 wallpaper.',
    defaultConfig: {
      primaryColor: '#b4d5e8',
      secondaryColor: '#0078d4',
      tertiaryColor: '#4fc3f7',
      complexity: 0.5,
      speed: 0.12,
      intensity: 1.2,
      grain: 0.0,
      scale: 3.0,

      contrast: 1.0,
      customValues: { ribbonDensity: 0.6, curlAmount: 0.7 }
    },
    customizations: [
      { key: 'ribbonDensity', label: 'Ribbon Density', min: 0.2, max: 1, step: 0.01, defaultValue: 0.6 },
      { key: 'curlAmount', label: 'Stretch', min: 0, max: 1.5, step: 0.01, defaultValue: 0.7 }
    ],
    hideGlobalControls: ['intensity'],
    customLabels: { complexity: 'Ribbon Width' }
  },
  // ===== Premium High-End Presets =====
  {
    id: 'MARBLE_METAMORPHOSIS',
    name: 'Marble Metamorphosis',
    icon: 'fa-water',
    description: 'Flowing organic marble patterns with liquid metal refraction and lustrous depth.',
    defaultConfig: {
      primaryColor: '#2a2a3e',
      secondaryColor: '#d4af37',
      tertiaryColor: '#a8a8c0',
      complexity: 0.68,
      speed: 0.18,
      intensity: 1.3,
      grain: 0.01,
      scale: 0.2,
      contrast: 1.15,
      customValues: { tileSize: 0.6 }
    },
    customizations: [
      { key: 'tileSize', label: 'Tile Size', min: 0.2, max: 1.5, step: 0.01, defaultValue: 0.6 }
    ],
    customLabels: { complexity: 'Seed' }
  },
  // ===== Original Presets =====
  {
    id: 'BAUHAUS_GRID',
    name: 'Bauhaus Grid',
    icon: 'fa-th-large',
    description: 'Kinetic minimalist grid with mid-century geometric primitives.',
    defaultConfig: {
      primaryColor: '#F5F5F0',
      secondaryColor: '#002FA7',
      tertiaryColor: '#E95C20',
      complexity: 0.4,
      speed: 0.15,
      intensity: 1.0,
      grain: 0.0,
      scale: 1.2,
      contrast: 1.1
    },
    hideGlobalControls: ['complexity', 'intensity']
  },

  {
    id: 'ISO_SLABS',
    name: 'Iso Slabs',
    icon: 'fa-cubes',
    description: '3D isometric slabs with architectural lighting and scale.',
    defaultConfig: {
      primaryColor: '#1A1A1A',
      secondaryColor: '#333333',
      tertiaryColor: '#FFD700',
      complexity: 0.6,
      speed: 0.1,
      intensity: 1.2,
      grain: 0.0,
      scale: 1.8,
      contrast: 1.3
    },
    hideGlobalControls: ['complexity', 'intensity']
  },
  {
    id: 'SOLAR_PLASMA',
    name: 'Solar Plasma',
    icon: 'fa-sun',
    description: 'High-energy ribbons of light flowing like liquid silk.',
    defaultConfig: {
      primaryColor: '#9B2226',
      secondaryColor: '#EE9B00',
      tertiaryColor: '#FFFFFF',
      complexity: 0.7,
      speed: 0.2,
      intensity: 1.0,
      grain: 0.0,
      scale: 1.2,
      contrast: 1.0
    },
    hideGlobalControls: ['complexity'],
    customLabels: { intensity: 'Brightness' }
  },
  {
    id: 'CYBER_GRID',
    name: 'Cyber Grid',
    icon: 'fa-rocket',
    description: 'Retro-futurist synthwave landscape with an infinite grid.',
    defaultConfig: {
      primaryColor: '#000000',
      secondaryColor: '#FF00FF',
      tertiaryColor: '#FFD700', // Golden Yellow for the sun
      complexity: 0.5,
      speed: 0.2,
      intensity: 1.5,
      grain: 0.0,
      scale: 1.0,
      contrast: 1.2
    },
    hideGlobalControls: ['complexity'],
    customLabels: { intensity: 'Glow' }
  },
  {
    id: 'MOLTEN_CHROME',
    name: 'Molten Chrome',
    icon: 'fa-vial',
    description: 'Metallic fluid with high reflectivity and liquid movement.',
    defaultConfig: {
      primaryColor: '#94a3b8',
      secondaryColor: '#1e293b',
      tertiaryColor: '#f1f5f9',
      complexity: 0.8,
      speed: 0.15,
      intensity: 2.5,
      grain: 0.05,
      scale: 1.2,
      contrast: 2.0
    },
    customLabels: { complexity: 'Complexity' }
  },
  // ===== Space & Premium Presets =====
  {
    id: 'DEEP_COSMOS',
    name: 'Deep Cosmos',
    icon: 'fa-infinity',
    description: 'Enhanced vibrant interstellar nebula clouds with dynamic coloring and multi-layered starfields.',
    defaultConfig: {
      primaryColor: '#0a0a1a',
      secondaryColor: '#b24bf3',
      tertiaryColor: '#00ffc8',
      complexity: 0.75,
      speed: 0.12,
      intensity: 1.4,
      grain: 0.04,
      scale: 0.38,
      contrast: 1.15,
      customValues: { cloudScale: 0.55, starDensity: 0.42 }
    },
    customizations: [
      { key: 'cloudScale', label: 'Cloud Scale', min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.55 },
      { key: 'starDensity', label: 'Star Density', min: 0.0, max: 1.0, step: 0.01, defaultValue: 0.42 }
    ]
  },
  {
    id: 'SPECTRAL_DRIFT',
    name: 'Mesh Gradient',
    icon: 'fa-rainbow',
    description: 'Drifting color spectrum waves with chromatic separation and prismatic interference patterns.',
    defaultConfig: {
      primaryColor: '#ebebff',
      secondaryColor: '#ff6bb5',
      tertiaryColor: '#0bcdfe',
      complexity: 0.6,
      speed: 0.22,
      intensity: 1.2,
      grain: 0.0,
      scale: 0.5,
      contrast: 1.15,
      customValues: { chromaSeparation: 0.65, driftIntensity: 0.75 }
    },
    customizations: [
      { key: 'chromaSeparation', label: 'Chromatic Separation', min: 0.2, max: 1.5, step: 0.01, defaultValue: 0.65 },
      { key: 'driftIntensity', label: 'Drift Intensity', min: 0.2, max: 1.5, step: 0.01, defaultValue: 0.75 }
    ]
  },
];

export const INITIAL_CONFIG: WallpaperConfig = {
  preset: PRESETS[0].id,
  primaryColor: PRESETS[0].defaultConfig.primaryColor!,
  secondaryColor: PRESETS[0].defaultConfig.secondaryColor!,
  tertiaryColor: PRESETS[0].defaultConfig.tertiaryColor!,
  complexity: PRESETS[0].defaultConfig.complexity!,
  speed: PRESETS[0].defaultConfig.speed!,
  intensity: PRESETS[0].defaultConfig.intensity!,
  grain: PRESETS[0].defaultConfig.grain!,
  scale: PRESETS[0].defaultConfig.scale!,
  contrast: PRESETS[0].defaultConfig.contrast!,
  customValues: PRESETS[0].defaultConfig.customValues
};
