export type {
  CreateWallpaperOptions,
  PresetCustomization,
  PresetData,
  PresetType,
  WallpaperConfig,
  WallpaperConfigUpdate,
  WallpaperInstance,
} from './types.js';

export { INITIAL_CONFIG, PRESETS } from './constants.js';
export { createWallpaper } from './engine.js';
export { createDefaultConfig, getPresetById, isPresetType, mergeWallpaperConfig, PRESET_IDS, resolveWallpaperConfig } from './config.js';
export { allPresetsShaders as WALLPAPER_SHADERS } from './presets/index.js';
