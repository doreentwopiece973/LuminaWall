import * as THREE from 'three';
import { PRESETS } from './constants.js';
import { mergeWallpaperConfig, resolveWallpaperConfig } from './config.js';
import { allPresetsShaders } from './presets/index.js';
import { shaderUtils } from './shaderUtils.js';
import type { CreateWallpaperOptions, WallpaperConfig, WallpaperInstance, WallpaperConfigUpdate } from './types.js';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
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
  uniform int uPreset;
  uniform float uCustom1;
  uniform float uCustom2;
  varying vec2 vUv;

  ${shaderUtils}
  ${allPresetsShaders}

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv * 2.0 - 1.0) * uScale;
    p.x *= uResolution.x / uResolution.y;

    float t = uTime;
    vec3 finalColor = vec3(0.0);

    if (uPreset == 0) {
      finalColor = renderLiquidGlass(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2);
    } else if (uPreset == 1) {
      finalColor = renderMonoTopology(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2);
    } else if (uPreset == 2) {
      finalColor = renderWindowsBloom(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2);
    } else if (uPreset == 3) {
      finalColor = renderMarbleMetamorphosis(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2);
    } else if (uPreset == 4) {
      finalColor = renderBauhaus(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, 0.0);
    } else if (uPreset == 5) {
      finalColor = renderIsoSlabs(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, 0.0);
    } else if (uPreset == 6) {
      finalColor = renderSolarPlasma(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity);
    } else if (uPreset == 7) {
      finalColor = renderCyberGrid(uv, p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity);
    } else if (uPreset == 8) {
      finalColor = renderMoltenChrome(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity);
    } else if (uPreset == 9) {
      finalColor = renderDeepCosmos(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2);
    } else if (uPreset == 10) {
      finalColor = renderSpectralDrift(p, t, uColor1, uColor2, uColor3, uComplexity, uIntensity, uCustom1, uCustom2);
    }

    finalColor = mix(vec3(0.5), finalColor, uContrast);
    finalColor = aces(finalColor);
    
    if (uGrain > 0.0) {
      finalColor += (hash(uv + fract(uTime)) - 0.5) * uGrain;
    }
    
    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
  }
`;

const presetIndexMap = Object.fromEntries(PRESETS.map((preset, index) => [preset.id, index])) as Record<
  WallpaperConfig['preset'],
  number
>;

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
    uPreset: { value: presetIndexMap[config.preset] ?? 0 },
    uCustom1: { value: 0.5 },
    uCustom2: { value: 0.5 },
  };
}

function applyConfigToUniforms(
  config: WallpaperConfig,
  uniforms: ReturnType<typeof createUniforms>,
) {
  uniforms.uColor1.value.set(config.primaryColor);
  uniforms.uColor2.value.set(config.secondaryColor);
  uniforms.uColor3.value.set(config.tertiaryColor);
  uniforms.uComplexity.value = config.complexity;
  uniforms.uIntensity.value = config.intensity;
  uniforms.uGrain.value = config.grain;
  uniforms.uScale.value = config.scale;
  uniforms.uContrast.value = config.contrast;
  uniforms.uPreset.value = presetIndexMap[config.preset] ?? 0;

  const customValues = Object.values(config.customValues ?? {});
  uniforms.uCustom1.value = customValues[0] ?? 0.5;
  uniforms.uCustom2.value = customValues[1] ?? 0.5;
}

export function createWallpaper(target: HTMLElement, options: CreateWallpaperOptions): WallpaperInstance {
  if (!(target instanceof HTMLElement)) {
    throw new Error('createWallpaper(target, options) requires a valid HTMLElement target.');
  }

  let currentConfig = resolveWallpaperConfig(options);
  const restoreTargetStyles = ensureTargetStyles(target);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

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
  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const resize = () => {
    const width = Math.max(target.clientWidth, 1);
    const height = Math.max(target.clientHeight, 1);
    renderer.setSize(width, height, false);
    uniforms.uResolution.value.set(width, height);
  };

  resize();

  let animationFrame = 0;
  const render = (time: number) => {
    uniforms.uTime.value = (time / 1000) * currentConfig.speed;
    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(render);
  };
  animationFrame = window.requestAnimationFrame(render);

  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(target);
  window.addEventListener('resize', resize);

  const setConfig = (update: WallpaperConfigUpdate) => {
    const patch = typeof update === 'function' ? update(currentConfig) : update;
    currentConfig = mergeWallpaperConfig(currentConfig, patch);
    applyConfigToUniforms(currentConfig, uniforms);
    return currentConfig;
  };

  const destroy = () => {
    window.cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
    resizeObserver?.disconnect();
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
    capture: (type = 'image/png', quality) => canvas.toDataURL(type, quality),
    getConfig: () => currentConfig,
    setConfig,
  };
}
