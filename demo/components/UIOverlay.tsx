import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { PRESETS, createDefaultConfig, mergeWallpaperConfig } from '../../src/index.js';
import type { PresetCustomization, WallpaperConfig, WallpaperPerformanceMetrics } from '../../src/types.js';

interface UIOverlayProps {
  config: WallpaperConfig;
  setConfig: Dispatch<SetStateAction<WallpaperConfig>>;
  onSave: () => void;
  performanceMetrics: WallpaperPerformanceMetrics | null;
}

const UIOverlay = ({ config, setConfig, onSave, performanceMetrics }: UIOverlayProps) => {
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const updateConfig = (key: keyof WallpaperConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateCustomValue = (key: string, value: number) => {
    setConfig((prev) => ({
      ...prev,
      customValues: { ...prev.customValues, [key]: value },
    }));
  };

  const currentPreset = useMemo(
    () => PRESETS.find((preset) => preset.id === config.preset),
    [config.preset],
  );

  const presetCustomizations = currentPreset?.customizations || [];

  const Slider = ({
    label,
    value,
    min = 0,
    max = 1,
    step = 0.01,
    configKey,
  }: {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    configKey: keyof WallpaperConfig;
  }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
        <span className="font-mono text-[9px] opacity-50">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => updateConfig(configKey, parseFloat(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-white"
      />
    </div>
  );

  const CustomSlider = ({ customization }: { customization: PresetCustomization }) => {
    const value = config.customValues?.[customization.key] ?? customization.defaultValue;

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
            {customization.label}
          </label>
          <span className="font-mono text-[9px] opacity-50">{value.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={customization.min}
          max={customization.max}
          step={customization.step}
          value={value}
          onChange={(e) => updateCustomValue(customization.key, parseFloat(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-cyan-400"
        />
      </div>
    );
  };

  return (
    <>
      <div className="absolute right-6 top-6 z-30 flex flex-col gap-3 pointer-events-auto">
        <button
          onClick={() => setCustomizeOpen(!customizeOpen)}
          className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-all ${
            customizeOpen ? 'bg-white text-black' : 'glass border border-white/20 hover:bg-white/10'
          }`}
          title="Customize"
        >
          <i className="fa-solid fa-sliders text-lg" />
        </button>

        <button
          onClick={onSave}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black shadow-lg transition-all hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] active:scale-95"
          title="Download"
        >
          <i className="fa-solid fa-download text-lg" />
        </button>
      </div>

      {performanceMetrics ? (
        <div className="glass pointer-events-none absolute left-6 top-6 z-30 rounded-2xl border border-white/20 p-3 text-[10px] font-mono text-white/80 shadow-2xl">
          <div>FPS {performanceMetrics.fps.toFixed(1)}</div>
          <div>Frame {performanceMetrics.averageFrameTime.toFixed(2)}ms</div>
          <div>Canvas {performanceMetrics.renderWidth}x{performanceMetrics.renderHeight}</div>
          <div>DPR {performanceMetrics.pixelRatio.toFixed(2)}</div>
          <div>Preset {performanceMetrics.preset}</div>
          <div>Context loss {performanceMetrics.contextLossCount}</div>
        </div>
      ) : null}

      <div className="pointer-events-auto fixed bottom-6 left-1/2 z-30 -translate-x-1/2">
        <div className="scrollbar-hide glass flex max-h-32 max-w-[calc(100vw-3rem)] gap-2 overflow-x-auto rounded-2xl border border-white/20 p-3 shadow-2xl">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                const defaults = createDefaultConfig(preset.id);
                setConfig((prev) =>
                  mergeWallpaperConfig(prev, {
                    ...defaults,
                    preset: preset.id,
                    customValues: defaults.customValues,
                  }),
                );
              }}
              className={`flex min-w-fit flex-col items-center justify-center whitespace-nowrap rounded-xl border px-4 py-3 transition-all ${
                config.preset === preset.id
                  ? 'border-white bg-white/20 shadow-lg shadow-white/30'
                  : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
              }`}
              title={preset.name}
            >
              <i className={`fa-solid ${preset.icon} mb-1 text-lg`} />
              <span className="text-[7px] font-bold uppercase tracking-wider leading-tight">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {customizeOpen ? (
        <div className="glass fixed left-1/2 top-1/2 z-40 max-h-[60vh] w-[calc(100vw-3rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/20 p-4 shadow-2xl md:absolute md:bottom-40 md:left-auto md:right-6 md:top-auto md:max-h-[70vh] md:w-[300px] md:translate-x-0 md:translate-y-0">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest">Customize</h3>
            <button
              onClick={() => setCustomizeOpen(false)}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/10"
            >
              <i className="fa-solid fa-xmark text-xs opacity-60" />
            </button>
          </div>

          <div className="space-y-4">
            {presetCustomizations.length > 0 ? (
              <div className="border-b border-white/10 pb-3">
                <div className="mb-3 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-cyan-400">
                  <i className="fa-solid fa-sparkles" />
                  {currentPreset?.name} Settings
                </div>
                <div className="space-y-3">
                  {presetCustomizations.map((customization) => (
                    <CustomSlider key={customization.key} customization={customization} />
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              {!currentPreset?.hideGlobalControls?.includes('speed') ? (
                <Slider label={currentPreset?.customLabels?.speed || 'Motion Speed'} value={config.speed} configKey="speed" max={1} />
              ) : null}
              {!currentPreset?.hideGlobalControls?.includes('scale') ? (
                <Slider label={currentPreset?.customLabels?.scale || 'Canvas Scale'} value={config.scale} configKey="scale" min={0.2} max={4} />
              ) : null}
              {!currentPreset?.hideGlobalControls?.includes('complexity') ? (
                <Slider
                  label={currentPreset?.customLabels?.complexity || 'Composition'}
                  value={config.complexity}
                  configKey="complexity"
                />
              ) : null}
              {!currentPreset?.hideGlobalControls?.includes('intensity') ? (
                <Slider
                  label={currentPreset?.customLabels?.intensity || 'Color Intensity'}
                  value={config.intensity}
                  configKey="intensity"
                  max={3}
                />
              ) : null}
              {!currentPreset?.hideGlobalControls?.includes('contrast') ? (
                <Slider
                  label={currentPreset?.customLabels?.contrast || 'Visual Contrast'}
                  value={config.contrast}
                  configKey="contrast"
                  min={0.5}
                  max={2}
                />
              ) : null}
            </div>

            <div className="border-t border-white/10 pt-3">
              <div className="flex items-center justify-center gap-4">
                {(['primaryColor', 'secondaryColor', 'tertiaryColor'] as const).map((colorKey) => (
                  <div key={colorKey} className="flex flex-col items-center gap-1">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20 shadow-inner">
                      <input
                        type="color"
                        value={config[colorKey]}
                        onChange={(e) => updateConfig(colorKey, e.target.value)}
                        className="absolute -inset-2 h-16 w-16 cursor-pointer bg-transparent"
                      />
                    </div>
                    <span className="text-[7px] font-bold uppercase tracking-widest opacity-40">
                      {colorKey.replace('Color', '')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default UIOverlay;
