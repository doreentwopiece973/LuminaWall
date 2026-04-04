export const MOLTEN_CHROME_SHADER = `
  vec3 renderMoltenChrome(vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity) {
    vec2 q = p;
    int iterations = int(complexity * 10.0) + 2;
    for(int i=1; i < 8; i++) {
      if(i > iterations) break;
      float fi = float(i);
      q += vec2(sin(fi * q.y + t), cos(fi * q.x + t)) * 0.5;
    }

    float lum = 0.5 + 0.5 * sin(length(q) * 2.0 + t);
    vec3 col = mix(c1, c2, lum);

    float reflect = pow(max(0.0, 1.0 - length(p - q * 0.1)), 8.0) * intensity;
    col = mix(col, c3, reflect);

    float highlight = smoothstep(0.4, 1.0, lum) * 0.3 * intensity;
    col += c3 * highlight;

    return col * (0.6 + 0.4 * intensity);
  }
`;
