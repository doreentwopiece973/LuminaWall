import type { PresetType } from '../types.js';
import { BAUHAUS_SHADER } from './bauhaus.js';
import { CYBER_GRID_SHADER } from './cyberGrid.js';
import { DEEP_COSMOS_SHADER } from './deepCosmos.js';
import { ISO_SLABS_SHADER } from './isoSlabs.js';
import { LIQUID_GLASS_SHADER } from './liquidGlass.js';
import { MARBLE_METAMORPHOSIS_SHADER } from './marbleMetamorphosis.js';
import { MOLTEN_CHROME_SHADER } from './moltenChrome.js';
import { MONO_TOPOLOGY_SHADER } from './monoTopology.js';
import { SOLAR_PLASMA_SHADER } from './solarPlasma.js';
import { SPECTRAL_DRIFT_SHADER } from './spectralDrift.js';
import { WINDOWS_BLOOM_SHADER } from './windowsBloom.js';

export interface PresetShaderDefinition {
  source: string;
  renderCall: string;
}

export const presetShaderDefinitions: Record<PresetType, PresetShaderDefinition> = {
  LIQUID_GLASS: {
    source: LIQUID_GLASS_SHADER,
    renderCall: 'renderLiquidGlass(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2)',
  },
  MONO_TOPOLOGY: {
    source: MONO_TOPOLOGY_SHADER,
    renderCall: 'renderMonoTopology(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2)',
  },
  WINDOWS_BLOOM: {
    source: WINDOWS_BLOOM_SHADER,
    renderCall: 'renderWindowsBloom(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2)',
  },
  MARBLE_METAMORPHOSIS: {
    source: MARBLE_METAMORPHOSIS_SHADER,
    renderCall: 'renderMarbleMetamorphosis(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2)',
  },
  BAUHAUS_GRID: {
    source: BAUHAUS_SHADER,
    renderCall: 'renderBauhaus(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, 0.0)',
  },
  ISO_SLABS: {
    source: ISO_SLABS_SHADER,
    renderCall: 'renderIsoSlabs(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, 0.0)',
  },
  SOLAR_PLASMA: {
    source: SOLAR_PLASMA_SHADER,
    renderCall: 'renderSolarPlasma(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity)',
  },
  CYBER_GRID: {
    source: CYBER_GRID_SHADER,
    renderCall: 'renderCyberGrid(uv, p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity)',
  },
  MOLTEN_CHROME: {
    source: MOLTEN_CHROME_SHADER,
    renderCall: 'renderMoltenChrome(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity)',
  },
  DEEP_COSMOS: {
    source: DEEP_COSMOS_SHADER,
    renderCall: 'renderDeepCosmos(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2)',
  },
  SPECTRAL_DRIFT: {
    source: SPECTRAL_DRIFT_SHADER,
    renderCall: 'renderSpectralDrift(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2)',
  },
};

export const allPresetsShaders = Object.values(presetShaderDefinitions)
  .map((definition) => definition.source)
  .join('\n');
