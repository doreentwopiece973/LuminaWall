export const LIQUID_GLASS_SHADER = `
  vec3 renderLiquidGlass(vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity, float waveScale, float iridescence) {
    vec2 q = p * (0.5 + (1.0/max(0.1, waveScale)) * 0.5);
    float movement = t * 0.3;

    int iterations = 4 + int(complexity * 4.0);
    for(int i = 1; i < 7; i++) {
      if(i > iterations) break;
      float fi = float(i);
      q += vec2(
        sin(fi * q.y + movement),
        cos(fi * q.x + movement)
      ) * 0.45;
    }

    float density = 0.5 + 0.5 * sin(length(q) * 1.5 + t);

    vec2 distort = vec2(sin(q.x), cos(q.y)) * 0.15;

    float aberration = 0.02 + iridescence * 0.05;

    vec3 col;

    vec2 posR = p + distort * (1.0 + aberration);
    float gradR = sin(posR.y * 2.0 + posR.x) * 0.5 + 0.5;
    col.r = mix(c1.r, c2.r, gradR);

    vec2 posG = p + distort;
    float gradG = sin(posG.y * 2.0 + posG.x) * 0.5 + 0.5;
    col.g = mix(c1.g, c2.g, gradG);

    vec2 posB = p + distort * (1.0 - aberration);
    float gradB = sin(posB.y * 2.0 + posB.x) * 0.5 + 0.5;
    col.b = mix(c1.b, c2.b, gradB);

    col = mix(col, c3, density * 0.4);

    float warpLen = length(p - q * 0.15);
    float highlight = smoothstep(0.4, 0.0, warpLen);

    highlight = pow(highlight, 4.0) * 1.5 * intensity;

    col += vec3(1.0) * highlight;

    if(iridescence > 0.0) {
      vec3 spectrum = 0.5 + 0.5 * cos(q.y * 2.0 + vec3(0, 2, 4) + t);
      float rim = smoothstep(0.0, 0.2, highlight) * (1.0 - smoothstep(0.5, 1.0, highlight));
      col += spectrum * rim * iridescence * 2.0;
    }

    float crevices = smoothstep(0.0, 0.8, warpLen);
    col *= 0.6 + 0.4 * crevices;

    return clamp(col, 0.0, 1.0);
  }
`;
