import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createWallpaper } from './engine.js';
import type { CreateWallpaperOptions, WallpaperInstance } from './types.js';

export interface LuminaWallProps extends CreateWallpaperOptions {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  contentClassName?: string;
}

export function LuminaWall({
  children,
  className,
  style,
  contentClassName,
  ...options
}: LuminaWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WallpaperInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    try {
      const instance = createWallpaper(containerRef.current, options);
      instanceRef.current = instance;

      return () => {
        instance.destroy();
        instanceRef.current = null;
      };
    } catch (error) {
      console.warn('LuminaWall: mount failed. Rendering without wallpaper.', error);
      instanceRef.current = null;
      return;
    }
  }, []);

  useEffect(() => {
    instanceRef.current?.setConfig(options);
  }, [
    options.preset,
    options.primaryColor,
    options.secondaryColor,
    options.tertiaryColor,
    options.complexity,
    options.speed,
    options.intensity,
    options.grain,
    options.scale,
    options.contrast,
    options.customValues,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      {children ? (
        <div className={contentClassName} style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default LuminaWall;
