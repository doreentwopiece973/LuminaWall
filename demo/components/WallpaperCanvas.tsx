import { useEffect, useRef } from 'react';
import { createWallpaper } from '../../src/index.js';
import type {
  RenderPolicy,
  WallpaperConfig,
  WallpaperInstance,
  WallpaperPerformanceMetrics,
} from '../../src/types.js';

interface WallpaperCanvasProps {
  config: WallpaperConfig;
  onCaptureRequest?: (captureFn: () => string) => void;
  onPerformanceSample?: (metrics: WallpaperPerformanceMetrics) => void;
  renderPolicy?: RenderPolicy;
}

const WallpaperCanvas = ({ config, onCaptureRequest, onPerformanceSample, renderPolicy }: WallpaperCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WallpaperInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const instance = createWallpaper(containerRef.current, {
      ...config,
      renderPolicy,
      instrumentation: {
        enabled: true,
        sampleIntervalMs: 1000,
        onSample: onPerformanceSample,
      },
    });
    instanceRef.current = instance;
    onCaptureRequest?.(() => instance.capture());

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    instanceRef.current?.setConfig(config);
    if (instanceRef.current && onCaptureRequest) {
      onCaptureRequest(() => instanceRef.current!.capture());
    }
  }, [config, onCaptureRequest]);

  return <div ref={containerRef} className="h-full w-full" />;
};

export default WallpaperCanvas;
