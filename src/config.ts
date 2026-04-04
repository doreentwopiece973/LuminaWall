import { PRESETS } from './constants.js';
import type { CreateWallpaperOptions, PresetData, PresetType, WallpaperConfig } from './types.js';

const presetMap = new Map<PresetType, PresetData>(PRESETS.map((preset) => [preset.id, preset]));

export const PRESET_IDS = PRESETS.map((preset) => preset.id);

export function isPresetType(value: string): value is PresetType {
  return presetMap.has(value as PresetType);
}

export function getPresetById(preset: PresetType): PresetData {
  const presetData = presetMap.get(preset);
  if (!presetData) {
    throw new Error(`Unknown LuminaWall preset: "${preset}"`);
  }

  return presetData;
}

export function createDefaultConfig(preset: PresetType): WallpaperConfig {
  const presetData = getPresetById(preset);

  return {
    preset,
    primaryColor: presetData.defaultConfig.primaryColor ?? '#000000',
    secondaryColor: presetData.defaultConfig.secondaryColor ?? '#ffffff',
    tertiaryColor: presetData.defaultConfig.tertiaryColor ?? '#888888',
    complexity: presetData.defaultConfig.complexity ?? 0.5,
    speed: presetData.defaultConfig.speed ?? 0.15,
    intensity: presetData.defaultConfig.intensity ?? 1,
    grain: presetData.defaultConfig.grain ?? 0,
    scale: presetData.defaultConfig.scale ?? 1,
    contrast: presetData.defaultConfig.contrast ?? 1,
    customValues: { ...(presetData.defaultConfig.customValues ?? {}) },
  };
}

export function resolveWallpaperConfig(options: CreateWallpaperOptions): WallpaperConfig {
  const defaults = createDefaultConfig(options.preset);

  return {
    ...defaults,
    ...options,
    customValues: {
      ...defaults.customValues,
      ...(options.customValues ?? {}),
    },
  };
}

export function mergeWallpaperConfig(
  currentConfig: WallpaperConfig,
  update: Partial<WallpaperConfig>,
): WallpaperConfig {
  if (update.preset && update.preset !== currentConfig.preset) {
    return resolveWallpaperConfig({
      ...createDefaultConfig(update.preset),
      ...update,
      preset: update.preset,
    });
  }

  return {
    ...currentConfig,
    ...update,
    customValues: {
      ...(currentConfig.customValues ?? {}),
      ...(update.customValues ?? {}),
    },
  };
}
