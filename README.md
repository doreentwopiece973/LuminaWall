![LuminaWall preset collage](./images/readme/collage.png)

# LuminaWall

LuminaWall is a WebGL background package for landing pages, app shells, hero sections, and immersive panels. It mounts an animated shader preset into any container element and keeps the canvas pinned to that element's bounds.

It supports:

- Plain HTML / vanilla JavaScript via `createWallpaper()`
- React via `LuminaWall`
- Runtime preset switching by preset name
- Shared global controls plus preset-specific custom controls

## Installation

```bash
npm install luminawall
```

## Repository Layout

```text
src/     package source published to npm
demo/    local demo app that consumes the package source
dist/    generated package build output
```

For local development in this repo:

```bash
npm run dev
```

That starts the demo app from `demo/`. The npm package itself is built only from `src/`.

## Quick Start

### Vanilla JavaScript

```html
<div id="hero" style="position: relative; width: 100%; height: 100vh;">
  <div style="position: relative; z-index: 1; color: white;">
    Your content
  </div>
</div>

<script type="module">
  import { createWallpaper } from 'luminawall';

  const hero = document.getElementById('hero');

  const wallpaper = createWallpaper(hero, {
    preset: 'DEEP_COSMOS',
  });

  wallpaper.setConfig({
    preset: 'SPECTRAL_DRIFT',
    customValues: {
      chromaSeparation: 0.9,
      driftIntensity: 1.1,
    },
  });
</script>
```

### React

```tsx
import { LuminaWall } from 'luminawall/react';

export function Hero() {
  return (
    <LuminaWall
      preset="MARBLE_METAMORPHOSIS"
      style={{ minHeight: '100vh' }}
      customValues={{ tileSize: 0.72 }}
    >
      <section
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          color: 'white',
        }}
      >
        Your content
      </section>
    </LuminaWall>
  );
}
```

## Package Exports

### Core API

```ts
import {
  PRESETS,
  PRESET_IDS,
  createDefaultConfig,
  createWallpaper,
  getPresetById,
  isPresetType,
  resolveWallpaperConfig,
} from 'luminawall';
```

### React API

```ts
import { LuminaWall } from 'luminawall/react';
```

## Core API Reference

### `createWallpaper(target, options)`

Mounts a wallpaper canvas into `target` and stretches it to fill the element.

```ts
const wallpaper = createWallpaper(targetElement, {
  preset: 'LIQUID_GLASS',
  renderPolicy: {
    pauseWhenHidden: true,
    pauseWhenOffscreen: true,
    quality: 'high',
  },
});
```

Returns a `WallpaperInstance` with:

- `canvas`: the mounted `HTMLCanvasElement`
- `getConfig()`: returns the active resolved config
- `setConfig(update)`: updates the current config
- `resize()`: recomputes size from the target element
- `capture(type?, quality?)`: exports the current frame as a data URL
- `destroy()`: removes the canvas and listeners

### `setConfig(update)`

Accepts either a partial config object or an updater function.

```ts
wallpaper.setConfig({
  preset: 'CYBER_GRID',
  intensity: 2,
});

wallpaper.setConfig((current) => ({
  speed: current.speed + 0.05,
}));
```

If `preset` changes, LuminaWall resets to that preset's defaults first and then applies your overrides.

When `preset` changes, LuminaWall now recompiles only that preset's fragment shader and swaps the material. Normal config updates stay on the existing material and only update uniforms.

### Preset Helpers

- `PRESETS`: full preset metadata, including descriptions and custom controls
- `PRESET_IDS`: array of valid preset ids
- `getPresetById(id)`: returns metadata for one preset
- `isPresetType(value)`: runtime type guard for preset ids
- `createDefaultConfig(id)`: returns the resolved default config for that preset
- `resolveWallpaperConfig(options)`: expands partial options into a full `WallpaperConfig`

## React API Reference

### `LuminaWall`

`LuminaWall` mounts the wallpaper into its root `div` and renders children above the canvas.

Props:

- All `CreateWallpaperOptions` fields
- `className?: string`
- `style?: React.CSSProperties`
- `contentClassName?: string`
- `children?: React.ReactNode`

Example:

```tsx
<LuminaWall
  preset="WINDOWS_BLOOM"
  className="hero"
  style={{ minHeight: 720 }}
  customValues={{ ribbonDensity: 0.75, curlAmount: 1.1 }}
>
  <HeroContent />
</LuminaWall>
```

## Configuration Model

### `CreateWallpaperOptions`

```ts
interface CreateWallpaperOptions {
  preset: PresetType;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  complexity?: number;
  speed?: number;
  intensity?: number;
  grain?: number;
  scale?: number;
  contrast?: number;
  customValues?: Record<string, number>;
  renderPolicy?: {
    pauseWhenHidden?: boolean;
    pauseWhenOffscreen?: boolean;
    quality?: 'high' | 'balanced' | 'performance';
  };
  instrumentation?: {
    enabled?: boolean;
    sampleIntervalMs?: number;
    logToConsole?: boolean;
    onSample?: (metrics: WallpaperPerformanceMetrics) => void;
  };
}
```

If you only pass `preset`, LuminaWall uses that preset's built-in defaults.

### Render Policy

- `pauseWhenHidden`: pauses rendering when the tab is hidden. Default `true`.
- `pauseWhenOffscreen`: pauses rendering when the target leaves the viewport. Default `true`.
- `quality`: opt-in internal pixel ratio tier. Default `high`.

`quality` is intentionally conservative:

- `high`: full default quality
- `balanced`: moderate pixel-ratio reduction for heavier presets
- `performance`: stronger pixel-ratio reduction for constrained devices

Preset visuals stay the same by default. Lower quality tiers are explicit tradeoffs for sites that need more headroom on weaker hardware.

### Performance Instrumentation

Instrumentation is optional and intended for local development and profiling.

Reported metrics include:

- FPS
- average frame time
- rendered canvas size
- effective pixel ratio
- current preset
- WebGL context loss count

Example:

```ts
const wallpaper = createWallpaper(target, {
  preset: 'DEEP_COSMOS',
  instrumentation: {
    enabled: true,
    sampleIntervalMs: 1000,
    onSample: (metrics) => {
      console.log(metrics.fps, metrics.averageFrameTime);
    },
  },
});
```

### Global Controls

These controls are shared across presets, though some presets hide or relabel a few of them.

| Option | Meaning |
| --- | --- |
| `primaryColor` | Main palette color |
| `secondaryColor` | Secondary palette color |
| `tertiaryColor` | Accent / highlight color |
| `complexity` | Detail level, density, or structural variation |
| `speed` | Animation speed multiplier |
| `intensity` | Brightness, glow, or effect strength |
| `grain` | Added surface noise |
| `scale` | Zoom / framing |
| `contrast` | Post-process contrast |
| `customValues` | Preset-specific parameters |

## Preset Catalog

Each preset section below lists:

- Description
- Default configuration
- Preset-specific custom options
- Hidden or relabeled global controls

### `LIQUID_GLASS`

**Liquid Glass**  
Viscous molten glass with refractive distortion and iridescence.

Default config:

- `primaryColor`: `#e0f2fe`
- `secondaryColor`: `#fce7f3`
- `tertiaryColor`: `#38bdf8`
- `complexity`: `0.6`
- `speed`: `0.2`
- `intensity`: `1.1`
- `grain`: `0`
- `scale`: `0.8`
- `contrast`: `1.1`
- `customValues.waveScale`: `0.7`
- `customValues.iridescence`: `0.5`

Custom options:

- `waveScale`: Wave Scale, range `0.3` to `2`, step `0.01`, default `1`
- `iridescence`: Iridescence, range `0` to `1.5`, step `0.01`, default `0.8`

Global control labels:

- `complexity` is labeled as `Complexity`

### `MONO_TOPOLOGY`

**Mono Topology**  
Elegant topographic contour lines with a monochrome, product-hero look.

Default config:

- `primaryColor`: `#f5f5f5`
- `secondaryColor`: `#1a1a1a`
- `tertiaryColor`: `#888888`
- `complexity`: `0.5`
- `speed`: `0.08`
- `intensity`: `1`
- `grain`: `0.01`
- `scale`: `1`
- `contrast`: `1`
- `customValues.lineWeight`: `0.5`
- `customValues.elevation`: `0.6`

Custom options:

- `lineWeight`: Line Weight, range `0.1` to `1`, step `0.01`, default `0.5`
- `elevation`: Elevation Range, range `0.2` to `1.5`, step `0.1`, default `0.6`

Global control labels:

- `complexity` is labeled as `Zoom`

### `WINDOWS_BLOOM`

**Ribbon Bloom**  
Flowing ribbon sculpture inspired by the Windows 11 wallpaper style.

Default config:

- `primaryColor`: `#b4d5e8`
- `secondaryColor`: `#0078d4`
- `tertiaryColor`: `#4fc3f7`
- `complexity`: `0.5`
- `speed`: `0.12`
- `intensity`: `1.2`
- `grain`: `0`
- `scale`: `3`
- `contrast`: `1`
- `customValues.ribbonDensity`: `0.6`
- `customValues.curlAmount`: `0.7`

Custom options:

- `ribbonDensity`: Ribbon Density, range `0.2` to `1`, step `0.01`, default `0.6`
- `curlAmount`: Stretch, range `0` to `1.5`, step `0.01`, default `0.7`

Hidden global controls:

- `intensity`

Global control labels:

- `complexity` is labeled as `Ribbon Width`

### `MARBLE_METAMORPHOSIS`

**Marble Metamorphosis**  
Flowing organic marble patterns with liquid metal refraction and depth.

Default config:

- `primaryColor`: `#2a2a3e`
- `secondaryColor`: `#d4af37`
- `tertiaryColor`: `#a8a8c0`
- `complexity`: `0.68`
- `speed`: `0.18`
- `intensity`: `1.3`
- `grain`: `0.01`
- `scale`: `0.2`
- `contrast`: `1.15`
- `customValues.tileSize`: `0.6`

Custom options:

- `tileSize`: Tile Size, range `0.2` to `1.5`, step `0.01`, default `0.6`

Global control labels:

- `complexity` is labeled as `Seed`

### `BAUHAUS_GRID`

**Bauhaus Grid**  
Kinetic minimalist grid with mid-century geometric primitives.

Default config:

- `primaryColor`: `#F5F5F0`
- `secondaryColor`: `#002FA7`
- `tertiaryColor`: `#E95C20`
- `complexity`: `0.4`
- `speed`: `0.15`
- `intensity`: `1`
- `grain`: `0`
- `scale`: `1.2`
- `contrast`: `1.1`

Custom options:

- None

Hidden global controls:

- `complexity`
- `intensity`

### `ISO_SLABS`

**Iso Slabs**  
3D isometric slabs with architectural lighting and scale.

Default config:

- `primaryColor`: `#1A1A1A`
- `secondaryColor`: `#333333`
- `tertiaryColor`: `#FFD700`
- `complexity`: `0.6`
- `speed`: `0.1`
- `intensity`: `1.2`
- `grain`: `0`
- `scale`: `1.8`
- `contrast`: `1.3`

Custom options:

- None

Hidden global controls:

- `complexity`
- `intensity`

### `SOLAR_PLASMA`

**Solar Plasma**  
High-energy ribbons of light flowing like liquid silk.

Default config:

- `primaryColor`: `#9B2226`
- `secondaryColor`: `#EE9B00`
- `tertiaryColor`: `#FFFFFF`
- `complexity`: `0.7`
- `speed`: `0.2`
- `intensity`: `1`
- `grain`: `0`
- `scale`: `1.2`
- `contrast`: `1`

Custom options:

- None

Hidden global controls:

- `complexity`

Global control labels:

- `intensity` is labeled as `Brightness`

### `CYBER_GRID`

**Cyber Grid**  
Retro-futurist synthwave landscape with an infinite grid.

Default config:

- `primaryColor`: `#000000`
- `secondaryColor`: `#FF00FF`
- `tertiaryColor`: `#FFD700`
- `complexity`: `0.5`
- `speed`: `0.2`
- `intensity`: `1.5`
- `grain`: `0`
- `scale`: `1`
- `contrast`: `1.2`

Custom options:

- None

Hidden global controls:

- `complexity`

Global control labels:

- `intensity` is labeled as `Glow`

### `MOLTEN_CHROME`

**Molten Chrome**  
Metallic fluid with high reflectivity and liquid motion.

Default config:

- `primaryColor`: `#94a3b8`
- `secondaryColor`: `#1e293b`
- `tertiaryColor`: `#f1f5f9`
- `complexity`: `0.8`
- `speed`: `0.15`
- `intensity`: `2.5`
- `grain`: `0.05`
- `scale`: `1.2`
- `contrast`: `2`

Custom options:

- None

Global control labels:

- `complexity` is labeled as `Complexity`

### `DEEP_COSMOS`

**Deep Cosmos**  
Vibrant nebula clouds with dynamic coloring and layered starfields.

Default config:

- `primaryColor`: `#0a0a1a`
- `secondaryColor`: `#b24bf3`
- `tertiaryColor`: `#00ffc8`
- `complexity`: `0.75`
- `speed`: `0.12`
- `intensity`: `1.4`
- `grain`: `0.04`
- `scale`: `0.38`
- `contrast`: `1.15`
- `customValues.cloudScale`: `0.55`
- `customValues.starDensity`: `0.42`

Custom options:

- `cloudScale`: Cloud Scale, range `0.1` to `2`, step `0.1`, default `0.55`
- `starDensity`: Star Density, range `0` to `1`, step `0.01`, default `0.42`

### `SPECTRAL_DRIFT`

**Mesh Gradient**  
Drifting color waves with chromatic separation and prismatic interference.

Default config:

- `primaryColor`: `#ebebff`
- `secondaryColor`: `#ff6bb5`
- `tertiaryColor`: `#0bcdfe`
- `complexity`: `0.6`
- `speed`: `0.22`
- `intensity`: `1.2`
- `grain`: `0`
- `scale`: `0.5`
- `contrast`: `1.15`
- `customValues.chromaSeparation`: `0.65`
- `customValues.driftIntensity`: `0.75`

Custom options:

- `chromaSeparation`: Chromatic Separation, range `0.2` to `1.5`, step `0.01`, default `0.65`
- `driftIntensity`: Drift Intensity, range `0.2` to `1.5`, step `0.01`, default `0.75`

## Building a Preset Picker

If you want to let users switch presets dynamically:

```ts
import { PRESETS, createWallpaper } from 'luminawall';

const wallpaper = createWallpaper(container, { preset: 'LIQUID_GLASS' });

for (const preset of PRESETS) {
  const button = document.createElement('button');
  button.textContent = preset.name;
  button.onclick = () => {
    wallpaper.setConfig({ preset: preset.id });
  };
  picker.appendChild(button);
}
```

If you need per-preset custom sliders, use each preset's `customizations` metadata from `PRESETS`.

## Layout Notes

- The target element must have a measurable size. Set an explicit height or place it in a layout that computes one.
- LuminaWall automatically sets the target to `position: relative` when needed.
- The canvas is mounted absolutely and fills the container.
- In plain HTML, overlay content should use normal flow or `position: relative; z-index: 1`.

## Browser Support

LuminaWall relies on WebGL and modern ESM package support. Current Chromium, Firefox, Safari, and Edge versions are the practical target.

LuminaWall now compiles the active preset shader only, rather than shipping one combined fragment shader to every instance. That reduces shader compile pressure and lowers driver risk on weaker or stricter browser environments.

## Troubleshooting

### Nothing renders

- Confirm the container has a real width and height.
- Confirm the browser supports WebGL.
- Check that the container is attached to the DOM before calling `createWallpaper()`.
- If the browser blocks or disables WebGL, LuminaWall now falls back to a no-op instance so the page keeps rendering without the wallpaper.
- Use `instrumentation.onSample` during development to identify presets that are unsafe at your target canvas size and device pixel ratio.

### Background renders but content disappears behind it

- Put overlay content in a positioned layer above the canvas.
- In plain HTML, `position: relative; z-index: 1` is usually enough.

### A preset looks wrong after switching

- When switching presets, LuminaWall resets to that preset's defaults first.
- Reapply your custom overrides after setting the new `preset`.

## License

MIT
