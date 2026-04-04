export const SOLAR_PLASMA_SHADER = `
  vec3 renderSolarPlasma(vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity) {
    vec2 q = p;
    float v = 0.0;
    float a = 0.5;
    for(int i=0; i<6; i++) {
        q += vec2(snoise(q + t * 0.15), snoise(q.yx - t * 0.2)) * 0.25;
        v += a * snoise(q);
        a *= 0.5;
    }

    vec3 col = mix(c1, c2, v * 0.5 + 0.5);
    col = mix(col, c3, smoothstep(0.1, 0.9, v));
    return col * (0.7 + 0.5 * intensity);
  }
`;
