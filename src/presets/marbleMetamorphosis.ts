export const MARBLE_METAMORPHOSIS_SHADER = `
  // Pseudo-random number generator
  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // Value Noise
  float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);

      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      // Cubic Hermite Curve for smooth interpolation
      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x) +
             (c - a) * u.y * (1.0 - u.x) +
             (d - b) * u.x * u.y;
  }

  // Fractal Brownian Motion (fBM) - WebGL 1.0 Safe Constant Loop
  float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 5; i++) {
          value += amplitude * noise(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }

  vec3 renderMarbleMetamorphosis(vec2 p, float t, vec3 c1, vec3 c2, vec3 c3, float complexity, float intensity, float tileSize, float reflectivity) {
      float scale = 2.5 + tileSize * 8.0;
      vec2 uv = p * scale;
      
      // Slow down time for a geological, shifting feel
      float time = t * 0.05;

      // --- DOMAIN WARPING ---
      // 1st layer of distortion
      vec2 q = vec2(fbm(uv + vec2(0.0, 0.0) + time),
                    fbm(uv + vec2(5.2, 1.3) - time));

      // 2nd layer of distortion: The 'complexity' drives how heavily the liquid twists
      vec2 r = vec2(fbm(uv + q * (2.0 + complexity * 3.0) + vec2(1.7, 9.2)),
                    fbm(uv + q * (2.0 + complexity * 3.0) + vec2(8.3, 2.8)));

      // Final base noise field
      float f = fbm(uv + r * 4.0);

      // --- SHARP VEIN CREATION ---
      // We calculate a new noise layer, then fold it over itself using abs() to create sharp ridges
      float veinNoise = fbm(uv * 1.5 + r * 3.0);
      float ridge = 1.0 - abs(veinNoise - 0.5) * 2.0;
      
      // Raising the ridge to a high power squeezes it into thin, dark lines
      float vein = pow(ridge, 8.0); 

      // Soft caramel/tan swirling areas
      float swirl = smoothstep(0.3, 0.7, f);

      // --- COLOR COMPOSITION ---
      // We start with the light cream base and blend in the soft tan swirls
      vec3 color = mix(c3, c2, swirl * 0.7);
      
      // Add the dark, sharp veins on top. We mask them slightly with 'f' so they break up naturally
      float veinMask = smoothstep(0.2, 0.8, fbm(uv * 3.0));
      color = mix(color, c1, vein * veinMask);

      // --- MARBLE POLISH (SPECULARITY) ---
      // We use the distorted r-vector to fake tiny surface imperfections in the stone
      vec3 normal = normalize(vec3(r.x - 0.5, r.y - 0.5, 3.0));
      vec3 lightDir = normalize(vec3(0.5, 1.0, 1.0));
      
      // Soft, broad specular highlight to make it look polished
      float spec = pow(max(dot(normal, lightDir), 0.0), 16.0) * reflectivity * 0.2;
      color += vec3(1.0) * spec;

      // Blend with base color by intensity
      return clamp(mix(c3, color, intensity), 0.0, 1.0);
  }
`;
