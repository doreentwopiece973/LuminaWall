export const CYBER_GRID_SHADER = `
  vec3 renderCyberGrid(vec2 uv, vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity) {
    float horizon = 0.0;
    vec3 col = vec3(0.0);

    if (p.y >= horizon) {
      vec3 skyTop = c1;
      vec3 skyHorizon = mix(c1, c2, 0.3);

      float skyGrad = pow(1.0 - p.y, 2.0);
      col = mix(skyTop, skyHorizon, skyGrad);

      float fStarScale = 400.0;
      float starRand = hash(floor(p * fStarScale));
      float stars = step(0.998, starRand) * complexity;
      stars *= 0.5 + 0.5 * sin(t * 3.0 + starRand * 100.0);

      stars *= smoothstep(0.0, 0.4, p.y);
      col += vec3(stars);

      vec2 sunPos = vec2(0.0, 0.35);
      float sunRadius = 0.45;
      float d = length(p - sunPos);

      if (d < sunRadius) {
        float sunY = (p.y - sunPos.y + sunRadius) / (sunRadius * 2.0);
        vec3 sunColor = mix(c2, c3, sqrt(sunY));

        float bandPos = p.y - sunPos.y;
        float bandFreq = 20.0 + bandPos * 10.0;
        float blinds = sin(bandPos * bandFreq - t * 0.5);

        float cut = smoothstep(0.0, 0.1, blinds);

        col = sunColor;
        col *= cut * 0.9 + 0.1;
        col *= 1.5 * intensity;
      }

      float m1 = sin(p.x * 3.0 + 1.0) * 0.1 + sin(p.x * 7.0) * 0.05 + 0.2;
      float m2 = sin(p.x * 5.0 - 2.0) * 0.08 + sin(p.x * 12.0) * 0.03 + 0.15;

      if (p.y < m1) {
        vec3 mountColor = mix(c1, c2, 0.3) * 0.5;
        mountColor = mix(mountColor, skyHorizon, (p.y / m1) * 0.5);
        col = mountColor;
      }
      if (p.y < m2) {
         col = mix(c1, vec3(0.0), 0.5);
      }

      float glow = 1.0 / (d * 3.0 + 0.5);
      col += c2 * glow * 0.4 * intensity;
    }
    else {
      float camHeight = 0.8;
      float z = camHeight / (horizon - p.y);
      vec2 pos = vec2(p.x * z, z);

      pos.y += t * 1.5;

      float fog = 1.0 / (z * z * 0.05 + 1.0);
      vec3 groundColor = mix(c1, c2 * 0.2, fog);
      col = groundColor;

      vec2 gridUV = fract(pos) - 0.5;

      float lineWidth = 0.02 * z;
      lineWidth = clamp(lineWidth, 0.001, 1.0);

      float lineX = smoothstep(0.5 - lineWidth, 0.5, abs(gridUV.y) + 0.5 * lineWidth);
      float lineY = smoothstep(0.5 - lineWidth, 0.5, abs(gridUV.x) + 0.5 * lineWidth);

      float grid = max(lineX, lineY);
      vec3 gridColor = c2 * 2.5;

      float gridFade = exp(-0.05 * z);
      col = mix(col, gridColor, grid * gridFade * intensity);

      float sunReflect = 1.0 / (abs(p.x) * 10.0 + 0.5) * smoothstep(0.0, -1.0, p.y);
      col += c3 * sunReflect * 0.15 * gridFade;
    }

    float scanline = 0.5 + 0.5 * sin(uv.y * 600.0);
    col *= 0.9 + 0.1 * scanline;

    float vig = 1.0 - length(p) * 0.2;
    col *= vig;

    return col;
  }
`;
