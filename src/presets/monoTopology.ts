export const MONO_TOPOLOGY_SHADER = `
  vec3 renderMonoTopology(vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity, float lineWeight, float elevation) {
    float elev = 0.0;
    float amp = 1.0;
    vec2 q = p * (1.0 + complexity);

    for(int i = 0; i < 4; i++) {
      elev += amp * snoise(q + t * 0.05);
      q *= 2.0;
      amp *= 0.5;
    }

    elev = elev * elevation + 0.5;

    float contourSpacing = 0.1;
    float contours = fract(elev / contourSpacing);
    float line = smoothstep(lineWeight * 0.1, 0.0, abs(contours - 0.5) - 0.45);

    float majorContour = fract(elev / (contourSpacing * 5.0));
    float majorLine = smoothstep(lineWeight * 0.15, 0.0, abs(majorContour - 0.5) - 0.45);

    vec3 col = mix(c1, c1 * 0.95, (p.y + 1.0) * 0.5);

    col = mix(col, c2 * 0.6, line * 0.5);
    col = mix(col, c2, majorLine * 0.8);

    col = mix(col, c3 * 0.1, smoothstep(-0.5, 0.5, elev) * 0.1 * intensity);

    return col;
  }
`;
