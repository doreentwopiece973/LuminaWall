export const SPECTRAL_DRIFT_SHADER = `
  vec3 renderSpectralDrift(vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity, float chromaSeparation, float driftIntensity) {
    vec3 col = c1;

    vec2 drift = vec2(sin(t * 0.15 * driftIntensity) * 0.3, cos(t * 0.12 * driftIntensity) * 0.2);
    vec2 q = p + drift;

    float wave1 = sin(q.x * 3.0 - t * 0.8) * 0.5 + 0.5;
    float wave2 = sin(q.y * 2.5 + t * 0.6) * 0.5 + 0.5;
    float interference = sin((wave1 + wave2) * 6.28 + t * 1.2) * 0.5 + 0.5;

    float shift = chromaSeparation * 0.1;
    vec3 r = vec3(
      mix(c1.r, c2.r, wave1 * 0.7 + shift),
      mix(c1.g, c2.g, wave2 * 0.7),
      mix(c1.b, c3.b, interference * 0.7 - shift)
    );

    vec3 g = vec3(
      mix(c2.r, c3.r, interference * 0.6 - shift),
      mix(c2.g, c3.g, wave1 * 0.6),
      mix(c2.b, c1.b, wave2 * 0.6 + shift)
    );

    vec3 b = vec3(
      mix(c3.r, c1.r, wave2 * 0.5 + shift),
      mix(c3.g, c1.g, interference * 0.5),
      mix(c3.b, c2.b, wave1 * 0.5 - shift)
    );

    col = r * 0.4 + g * 0.35 + b * 0.25;

    float prismaticShift = sin(length(q) * 8.0 + t * driftIntensity) * 0.5 + 0.5;
    col = mix(col, c3, prismaticShift * 0.2);

    col *= (0.7 + interference * 0.3);

    return clamp(col, 0.0, 1.0);
  }
`;
