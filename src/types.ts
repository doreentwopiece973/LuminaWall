
export type PresetType =
  | 'LIQUID_GLASS' | 'MONO_TOPOLOGY' | 'WINDOWS_BLOOM'
  | 'MARBLE_METAMORPHOSIS'
  | 'BAUHAUS_GRID' | 'ISO_SLABS' | 'SOLAR_PLASMA' | 'CYBER_GRID' | 'MOLTEN_CHROME'
  | 'DEEP_COSMOS' | 'SPECTRAL_DRIFT';


// Preset-specific customization options
export interface PresetCustomization {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface WallpaperConfig {
  preset: PresetType;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  complexity: number;
  speed: number;
  intensity: number;
  grain: number;
  scale: number;
  contrast: number;
  // Preset-specific custom values stored dynamically
  customValues?: Record<string, number>;
}

export interface CreateWallpaperOptions extends Partial<Omit<WallpaperConfig, 'preset'>> {
  preset: PresetType;
}

export type WallpaperConfigUpdate =
  | Partial<WallpaperConfig>
  | ((currentConfig: WallpaperConfig) => Partial<WallpaperConfig>);

export interface WallpaperInstance {
  canvas: HTMLCanvasElement;
  destroy: () => void;
  resize: () => void;
  capture: (type?: string, quality?: number) => string;
  getConfig: () => WallpaperConfig;
  setConfig: (update: WallpaperConfigUpdate) => WallpaperConfig;
}

export interface PresetData {
  id: PresetType;
  name: string;
  icon: string;
  description: string;
  defaultConfig: Partial<WallpaperConfig>;
  customizations?: PresetCustomization[];
  hideGlobalControls?: string[];
  customLabels?: Record<string, string>;
}
