export const BAUHAUS_SHADER = `
  vec3 renderBauhaus(vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity, float seed) {
    float res = 2.0 + floor(complexity * 6.0);
    vec2 gridUV = p * res;

    float slideSpeed = t * 0.4;
    float rowID = floor(gridUV.y);
    float colID = floor(gridUV.x);

    if (mod(rowID, 2.0) == 0.0) gridUV.x += slideSpeed;
    else gridUV.x -= slideSpeed;

    vec2 id = floor(gridUV);
    vec2 f = fract(gridUV);

    float h = hash(id + seed);
    float rotateH = hash(id * 1.5 + seed + floor(t * 0.2));

    if (rotateH > 0.5) f = vec2(f.y, 1.0 - f.x);

    vec3 bg = c1;
    vec3 charcoal = vec3(0.12, 0.12, 0.14);

    vec3 accent = (h > 0.7) ? c2 : (h > 0.4) ? c3 : charcoal;
    if (h > 0.92) accent = bg;

    float mask = 0.0;
    float shapeType = hash(id * 2.3 + seed + 0.1);

    if (shapeType < 0.25) {
      mask = step(length(f - 0.5), 0.4);
    } else if (shapeType < 0.5) {
      mask = step(length(f - vec2(0.0)), 1.0);
    } else if (shapeType < 0.75) {
      mask = step(f.x + f.y, 1.0);
    } else {
      mask = 1.0;
    }

    vec3 color = mix(bg, accent, mask);

    float borderThickness = 0.02 * (1.0 + intensity * 0.5);
    float line = step(borderThickness, f.x) * step(borderThickness, f.y);
    return mix(charcoal, color, line);
  }
`;
