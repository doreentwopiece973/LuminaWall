import { useCallback, useMemo, useRef, useState } from 'react';
import { PRESETS, createDefaultConfig } from '../src/index.js';
import type { RenderPolicy, WallpaperConfig, WallpaperPerformanceMetrics } from '../src/types.js';
import WallpaperCanvas from './components/WallpaperCanvas.js';
import UIOverlay from './components/UIOverlay.js';

const App = () => {
  const initialConfig = useMemo<WallpaperConfig>(() => createDefaultConfig(PRESETS[0].id), []);
  const [config, setConfig] = useState<WallpaperConfig>(initialConfig);
  const [metrics, setMetrics] = useState<WallpaperPerformanceMetrics | null>(null);
  const captureFnRef = useRef<(() => string) | null>(null);
  const renderPolicy = useMemo<RenderPolicy>(() => ({
    pauseWhenHidden: true,
    pauseWhenOffscreen: true,
    quality: 'high',
  }), []);

  const handleCaptureRequest = useCallback((captureFn: () => string) => {
    captureFnRef.current = captureFn;
  }, []);

  const handlePerformanceSample = useCallback((sample: WallpaperPerformanceMetrics) => {
    setMetrics(sample);
  }, []);

  const handleSave = useCallback(() => {
    if (!captureFnRef.current) {
      return;
    }

    const dataUrl = captureFnRef.current();
    const link = document.createElement('a');
    link.download = `lumina-wallpaper-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <WallpaperCanvas
          config={config}
          onCaptureRequest={handleCaptureRequest}
          onPerformanceSample={handlePerformanceSample}
          renderPolicy={renderPolicy}
        />
      </div>
      <UIOverlay config={config} setConfig={setConfig} onSave={handleSave} performanceMetrics={metrics} />
    </div>
  );
};

export default App;
