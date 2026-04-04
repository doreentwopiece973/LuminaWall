// Tech-Inspired Presets
import { LIQUID_GLASS_SHADER } from './liquidGlass.js';
import { MONO_TOPOLOGY_SHADER } from './monoTopology.js';
import { WINDOWS_BLOOM_SHADER } from './windowsBloom.js';

// Original Presets
import { BAUHAUS_SHADER } from './bauhaus.js';
import { ISO_SLABS_SHADER } from './isoSlabs.js';
import { SOLAR_PLASMA_SHADER } from './solarPlasma.js';
import { CYBER_GRID_SHADER } from './cyberGrid.js';
import { MOLTEN_CHROME_SHADER } from './moltenChrome.js';

// Premium High-End Presets
import { MARBLE_METAMORPHOSIS_SHADER } from './marbleMetamorphosis.js';

// Space Presets
import { DEEP_COSMOS_SHADER } from './deepCosmos.js';

// Premium Presets
import { SPECTRAL_DRIFT_SHADER } from './spectralDrift.js';

// Combine all shaders into a single string for the fragment shader
export const allPresetsShaders = [
  // Tech
  LIQUID_GLASS_SHADER,
  MONO_TOPOLOGY_SHADER,
  WINDOWS_BLOOM_SHADER,

  // Original
  BAUHAUS_SHADER,
  ISO_SLABS_SHADER,
  SOLAR_PLASMA_SHADER,
  CYBER_GRID_SHADER,
  MOLTEN_CHROME_SHADER,

  // Premium
  MARBLE_METAMORPHOSIS_SHADER,

  // Space
  DEEP_COSMOS_SHADER,

  // Premium
  SPECTRAL_DRIFT_SHADER,
].join('\n');
