export const ISO_SLABS_SHADER = `
  vec3 renderIsoSlabs(vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity, float seed) {
    mat2 iso = mat2(1.0, -0.5, 0.5, 0.5);
    vec2 q = iso * p * 1.5;
    vec2 id = floor(q);
    vec2 f = fract(q);

    float distToCenter = length(id);
    float h = 0.5 + 0.5 * sin(distToCenter * 0.4 - t * 1.5 + seed);

    vec3 col = c2;
    if (f.x + f.y > 1.0 + h * 0.4) col = c3;

    float edge = smoothstep(0.0, 0.04, f.x) * smoothstep(0.0, 0.04, f.y);
    return mix(c1, col, edge) * (0.85 + 0.15 * h);
  }
`;

