import * as THREE from 'three';
import { mergeWallpaperConfig, resolveWallpaperConfig } from './config.js';
import { presetShaderDefinitions } from './presets/index.js';
import { shaderUtils } from './shaderUtils.js';
import type {
  CreateWallpaperOptions,
  PerformanceInstrumentation,
  PresetType,
  RenderPolicy,
  WallpaperConfig,
  WallpaperConfigUpdate,
  WallpaperInstance,
  WallpaperPerformanceMetrics,
} from './types.js';

const DEFAULT_RENDER_POLICY: Required<RenderPolicy> = {
  pauseWhenHidden: true,
  pauseWhenOffscreen: true,
  quality: 'high',
};

const DEFAULT_INSTRUMENTATION: Required<Pick<PerformanceInstrumentation, 'enabled' | 'logToConsole' | 'sampleIntervalMs'>> = {
  enabled: false,
  logToConsole: false,
  sampleIntervalMs: 1000,
};

const QUALITY_PIXEL_RATIO_CAPS: Record<RenderPolicy['quality'] & string, number> = {
  high: 2,
  balanced: 1.5,
  performance: 1.25,
};

const PRESET_QUALITY_MULTIPLIERS: Record<PresetType, Record<RenderPolicy['quality'] & string, number>> = {
  LIQUID_GLASS: { high: 1, balanced: 1, performance: 0.95 },
  MONO_TOPOLOGY: { high: 1, balanced: 1, performance: 1 },
  WINDOWS_BLOOM: { high: 1, balanced: 0.95, performance: 0.9 },
  MARBLE_METAMORPHOSIS: { high: 1, balanced: 0.95, performance: 0.9 },
  BAUHAUS_GRID: { high: 1, balanced: 1, performance: 1 },
  ISO_SLABS: { high: 1, balanced: 0.95, performance: 0.9 },
  SOLAR_PLASMA: { high: 1, balanced: 0.95, performance: 0.9 },
  CYBER_GRID: { high: 1, balanced: 0.95, performance: 0.9 },
  MOLTEN_CHROME: { high: 1, balanced: 0.9, performance: 0.85 },
  DEEP_COSMOS: { high: 1, balanced: 0.9, performance: 0.8 },
  SPECTRAL_DRIFT: { high: 1, balanced: 1, performance: 0.95 },
};

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

function buildFragmentShader(preset: PresetType) {
  const definition = presetShaderDefinitions[preset];

  return `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uComplexity;
    uniform float uIntensity;
    uniform float uGrain;
    uniform float uScale;
    uniform float uContrast;
    uniform float uCustom1;
    uniform float uCustom2;
    varying vec2 vUv;

    ${shaderUtils}
    ${definition.source}

    void main() {
      vec2 uv = vUv;
      vec2 p = (uv * 2.0 - 1.0) * uScale;
      p.x *= uResolution.x / uResolution.y;

      float t = uTime;
      vec3 finalColor = ${definition.renderCall};

      finalColor = mix(vec3(0.5), finalColor, uContrast);
      finalColor = aces(finalColor);

      if (uGrain > 0.0) {
        finalColor += (hash(uv + fract(uTime)) - 0.5) * uGrain;
      }

      gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
    }
  `;
}

function applyCanvasStyles(canvas: HTMLCanvasElement) {
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  canvas.style.pointerEvents = 'none';
}

function ensureTargetStyles(target: HTMLElement) {
  const computed = window.getComputedStyle(target);
  const previousPosition = target.style.position;
  const previousOverflow = target.style.overflow;

  if (computed.position === 'static') {
    target.style.position = 'relative';
  }

  if (computed.overflow === 'visible') {
    target.style.overflow = 'hidden';
  }

  return () => {
    target.style.position = previousPosition;
    target.style.overflow = previousOverflow;
  };
}

function createFallbackInstance(config: WallpaperConfig): WallpaperInstance {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  applyCanvasStyles(canvas);

  return {
    canvas,
    destroy: () => {},
    resize: () => {},
    capture: () => '',
    getConfig: () => config,
    setConfig: (update) => {
      const patch = typeof update === 'function' ? update(config) : update;
      config = mergeWallpaperConfig(config, patch);
      return config;
    },
  };
}

function canCreateWebGLContext() {
  try {
    const probe = document.createElement('canvas');
    return Boolean(
      probe.getContext('webgl2', { alpha: true, antialias: true })
        || probe.getContext('webgl', { alpha: true, antialias: true })
        || probe.getContext('experimental-webgl', { alpha: true, antialias: true }),
    );
  } catch {
    return false;
  }
}

function resolveRenderPolicy(policy?: RenderPolicy): Required<RenderPolicy> {
  return {
    pauseWhenHidden: policy?.pauseWhenHidden ?? DEFAULT_RENDER_POLICY.pauseWhenHidden,
    pauseWhenOffscreen: policy?.pauseWhenOffscreen ?? DEFAULT_RENDER_POLICY.pauseWhenOffscreen,
    quality: policy?.quality ?? DEFAULT_RENDER_POLICY.quality,
  };
}

function resolveInstrumentation(instrumentation?: PerformanceInstrumentation) {
  return {
    enabled: instrumentation?.enabled ?? DEFAULT_INSTRUMENTATION.enabled,
    logToConsole: instrumentation?.logToConsole ?? DEFAULT_INSTRUMENTATION.logToConsole,
    sampleIntervalMs: instrumentation?.sampleIntervalMs ?? DEFAULT_INSTRUMENTATION.sampleIntervalMs,
    onSample: instrumentation?.onSample,
  };
}

function getPixelRatio(config: WallpaperConfig, renderPolicy: Required<RenderPolicy>) {
  const quality = renderPolicy.quality;
  const cap = QUALITY_PIXEL_RATIO_CAPS[quality];
  const multiplier = PRESET_QUALITY_MULTIPLIERS[config.preset][quality];
  return Math.min((window.devicePixelRatio || 1) * multiplier, cap);
}

function createUniforms(config: WallpaperConfig) {
  return {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uColor1: { value: new THREE.Color(config.primaryColor) },
    uColor2: { value: new THREE.Color(config.secondaryColor) },
    uColor3: { value: new THREE.Color(config.tertiaryColor) },
    uComplexity: { value: config.complexity },
    uIntensity: { value: config.intensity },
    uGrain: { value: config.grain },
    uScale: { value: config.scale },
    uContrast: { value: config.contrast },
    uCustom1: { value: 0.5 },
    uCustom2: { value: 0.5 },
  };
}

function applyConfigToUniforms(config: WallpaperConfig, uniforms: ReturnType<typeof createUniforms>) {
  uniforms.uColor1.value.set(config.primaryColor);
  uniforms.uColor2.value.set(config.secondaryColor);
  uniforms.uColor3.value.set(config.tertiaryColor);
  uniforms.uComplexity.value = config.complexity;
  uniforms.uIntensity.value = config.intensity;
  uniforms.uGrain.value = config.grain;
  uniforms.uScale.value = config.scale;
  uniforms.uContrast.value = config.contrast;

  const customValues = Object.values(config.customValues ?? {});
  uniforms.uCustom1.value = customValues[0] ?? 0.5;
  uniforms.uCustom2.value = customValues[1] ?? 0.5;
}

function createMaterial(
  preset: PresetType,
  uniforms: ReturnType<typeof createUniforms>,
) {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader: buildFragmentShader(preset),
  });
}

export function createWallpaper(target: HTMLElement, options: CreateWallpaperOptions): WallpaperInstance {
  if (!(target instanceof HTMLElement)) {
    throw new Error('createWallpaper(target, options) requires a valid HTMLElement target.');
  }

  const initialRenderPolicy = resolveRenderPolicy(options.renderPolicy);
  const instrumentation = resolveInstrumentation(options.instrumentation);
  const configOptions = { ...options };
  delete configOptions.renderPolicy;
  delete configOptions.instrumentation;

  let currentConfig = resolveWallpaperConfig(configOptions);
  let currentRenderPolicy = initialRenderPolicy;

  if (!canCreateWebGLContext()) {
    return createFallbackInstance(currentConfig);
  }

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });
  } catch (error) {
    console.warn('LuminaWall: WebGL renderer creation failed. Falling back to a no-op instance.', error);
    return createFallbackInstance(currentConfig);
  }

  const restoreTargetStyles = ensureTargetStyles(target);
  renderer.setPixelRatio(getPixelRatio(currentConfig, currentRenderPolicy));

  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  applyCanvasStyles(canvas);
  target.prepend(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10);
  camera.position.z = 1;

  const uniforms = createUniforms(currentConfig);
  applyConfigToUniforms(currentConfig, uniforms);

  const geometry = new THREE.PlaneGeometry(2, 2);
  let material = createMaterial(currentConfig.preset, uniforms);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let width = 0;
  let height = 0;
  const resize = () => {
    const nextWidth = Math.max(target.clientWidth, 1);
    const nextHeight = Math.max(target.clientHeight, 1);
    if (nextWidth === width && nextHeight === height) {
      return;
    }

    width = nextWidth;
    height = nextHeight;
    renderer.setSize(width, height, false);
    uniforms.uResolution.value.set(width, height);
  };

  resize();

  let animationFrame = 0;
  let isVisible = !document.hidden;
  let isInViewport = true;
  let isContextLost = false;
  let contextLossCount = 0;
  let sampleFrameCount = 0;
  let sampleAccumulatedFrameTime = 0;
  let sampleStartedAt = performance.now();
  let previousFrameTime = sampleStartedAt;

  const reportPerformance = (now: number) => {
    if (!instrumentation.enabled || now - sampleStartedAt < instrumentation.sampleIntervalMs) {
      return;
    }

    const elapsed = now - sampleStartedAt;
    const metrics: WallpaperPerformanceMetrics = {
      fps: sampleFrameCount > 0 ? (sampleFrameCount * 1000) / elapsed : 0,
      averageFrameTime: sampleFrameCount > 0 ? sampleAccumulatedFrameTime / sampleFrameCount : 0,
      frameCount: sampleFrameCount,
      contextLossCount,
      isVisible,
      isInViewport,
      pixelRatio: renderer.getPixelRatio(),
      renderWidth: width,
      renderHeight: height,
      preset: currentConfig.preset,
      quality: currentRenderPolicy.quality,
    };

    instrumentation.onSample?.(metrics);
    if (instrumentation.logToConsole) {
      console.info('LuminaWall performance', metrics);
    }

    sampleFrameCount = 0;
    sampleAccumulatedFrameTime = 0;
    sampleStartedAt = now;
  };

  const renderFrame = (time: number) => {
    uniforms.uTime.value = (time / 1000) * currentConfig.speed;
    renderer.render(scene, camera);

    const frameDelta = Math.max(0, time - previousFrameTime);
    previousFrameTime = time;
    sampleFrameCount += 1;
    sampleAccumulatedFrameTime += frameDelta;
    reportPerformance(time);
  };

  const stopLoop = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  };

  const shouldRender = () => {
    if (isContextLost) {
      return false;
    }

    if (currentRenderPolicy.pauseWhenHidden && !isVisible) {
      return false;
    }

    if (currentRenderPolicy.pauseWhenOffscreen && !isInViewport) {
      return false;
    }

    return true;
  };

  const startLoop = () => {
    if (animationFrame || !shouldRender()) {
      return;
    }

    animationFrame = window.requestAnimationFrame(render);
  };

  const render = (time: number) => {
    animationFrame = 0;
    if (!shouldRender()) {
      return;
    }

    renderFrame(time);
    animationFrame = window.requestAnimationFrame(render);
  };
  startLoop();

  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(target);
  const intersectionObserver = currentRenderPolicy.pauseWhenOffscreen && typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(([entry]) => {
      isInViewport = entry?.isIntersecting ?? true;
      if (isInViewport) {
        resize();
        startLoop();
      } else {
        stopLoop();
      }
    }, { threshold: 0 })
    : null;
  intersectionObserver?.observe(target);
  window.addEventListener('resize', resize);

  const handleVisibilityChange = () => {
    isVisible = !document.hidden;
    if (!currentRenderPolicy.pauseWhenHidden || isVisible) {
      resize();
      startLoop();
    } else {
      stopLoop();
    }
  };

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    isContextLost = true;
    contextLossCount += 1;
    stopLoop();
  };

  const handleContextRestored = () => {
    isContextLost = false;
    renderer.setPixelRatio(getPixelRatio(currentConfig, currentRenderPolicy));
    resize();
    startLoop();
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  canvas.addEventListener('webglcontextlost', handleContextLost as EventListener, false);
  canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

  const setConfig = (update: WallpaperConfigUpdate) => {
    const patch = typeof update === 'function' ? update(currentConfig) : update;
    const presetChanged = Boolean(patch.preset && patch.preset !== currentConfig.preset);

    currentConfig = mergeWallpaperConfig(currentConfig, patch);
    applyConfigToUniforms(currentConfig, uniforms);
    renderer.setPixelRatio(getPixelRatio(currentConfig, currentRenderPolicy));

    if (presetChanged) {
      const nextMaterial = createMaterial(currentConfig.preset, uniforms);
      mesh.material = nextMaterial;
      material.dispose();
      material = nextMaterial;
    }

    resize();
    if (shouldRender()) {
      startLoop();
    } else {
      stopLoop();
    }

    return currentConfig;
  };

  const destroy = () => {
    stopLoop();
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    canvas.removeEventListener('webglcontextlost', handleContextLost as EventListener, false);
    canvas.removeEventListener('webglcontextrestored', handleContextRestored, false);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    canvas.remove();
    restoreTargetStyles();
  };

  return {
    canvas,
    destroy,
    resize,
    capture: (type = 'image/png', quality) => {
      renderFrame(performance.now());
      return canvas.toDataURL(type, quality);
    },
    getConfig: () => currentConfig,
    setConfig,
  };
}
